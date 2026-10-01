import { NextResponse } from "next/server";
import { getSessionUser, getUserMembership } from "@/lib/session";
import { db } from "@/lib/db";
import { askGemini } from "@/lib/gemini";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const membership = await getUserMembership(user.id);
    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const history = await db
      .collection("chat_messages")
      .find({ organizationId: membership.organizationId })
      .sort({ createdAt: 1 })
      .limit(50)
      .toArray();

    return NextResponse.json({ history });
  } catch (error: unknown) {
    console.error("Failed to load chat history:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load history" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const membership = await getUserMembership(user.id);
    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const { question, history } = await req.json();
    if (!question || typeof question !== "string") {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const orgId = membership.organizationId;
    const feedbackCol = db.collection("feedback");

    // Grab recent feedback for context
    const recentFeedback = await feedbackCol
      .find({ organizationId: orgId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const total = await feedbackCol.countDocuments({ organizationId: orgId });

    // Build context from feedback data
    const feedbackContext = recentFeedback
      .map(
        (f, i) =>
          `[${i + 1}] Sentiment: ${f.sentiment || "unknown"} | Themes: ${(f.themes || []).join(", ")} | Text: "${f.text || f.content || ""}"`
      )
      .join("\n");

    // Build chat history context
    const historyContext = (history || [])
      .map((m: { sender: string; text: string }) => `${m.sender === "user" ? "User" : "AI"}: ${m.text}`)
      .join("\n");

    const prompt = `You are LOOP AI, a customer feedback intelligence assistant for the organization "${membership.organizationName}".

You have access to ${total} total feedback records. Here are the ${recentFeedback.length} most recent ones:

${feedbackContext || "No feedback records found."}

${historyContext ? `Previous conversation:\n${historyContext}\n` : ""}

User's question: ${question}

Instructions:
- Answer based ONLY on the feedback data provided.
- If you can identify sentiment trends, themes, or patterns, highlight them.
- Use **bold** for important terms.
- Be concise and data-driven.
- If there's no relevant data, say so honestly.`;

    const answer = await askGemini(prompt);

    // Save to database
    try {
      await db.collection("chat_messages").insertOne({
        organizationId: orgId,
        userId: user.id,
        userName: user.name,
        question,
        answer,
        createdAt: new Date(),
        basedOn: recentFeedback.length,
      });
    } catch (saveErr) {
      console.warn("Failed to persist chat message:", saveErr);
    }

    return NextResponse.json({
      answer,
      basedOn: recentFeedback.length,
      total,
    });
  } catch (error: unknown) {
    console.error("[/api/ai/query]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI query failed" },
      { status: 500 }
    );
  }
}
