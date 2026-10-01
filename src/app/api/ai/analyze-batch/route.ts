import { NextResponse } from "next/server";
import { getSessionUser, getUserMembership } from "@/lib/session";
import { askGemini } from "@/lib/gemini";

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

    const { texts } = await req.json();
    if (!Array.isArray(texts) || texts.length === 0) {
      return NextResponse.json({ error: "texts array is required" }, { status: 400 });
    }

    if (texts.length > 25) {
      return NextResponse.json({ error: "Maximum 25 texts per batch" }, { status: 400 });
    }

    const numbered = texts.map((t: string, i: number) => `[${i + 1}] "${t}"`).join("\n");

    const prompt = `You are a sentiment analysis AI. Analyze each review below and return a JSON array (no markdown fences) with one object per review.

Each object must have:
- "text": the original review text
- "sentiment": one of "positive", "neutral", or "negative"
- "themes": array of 1-3 short theme tags (e.g. "Delivery", "Customer Service", "Product Quality")
- "summary": a single-sentence insight about the review

Reviews:
${numbered}

Return ONLY the JSON array, no other text.`;

    const raw = await askGemini(prompt);

    // Parse the JSON response - strip markdown fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    const results = JSON.parse(cleaned);

    return NextResponse.json(results);
  } catch (error: unknown) {
    console.error("[/api/ai/analyze-batch]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Batch analysis failed" },
      { status: 500 }
    );
  }
}
