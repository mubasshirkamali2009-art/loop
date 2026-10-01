import { NextResponse } from "next/server";
import { getSessionUser, getUserMembership } from "@/lib/session";
import { db } from "@/lib/db";

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

    if (membership.role === "viewer") {
      return NextResponse.json({ error: "Viewers cannot save feedback" }, { status: 403 });
    }

    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items array is required" }, { status: 400 });
    }

    const orgId = membership.organizationId;
    const feedbackCol = db.collection("feedback");

    const docs = items.map((item: { text: string; sentiment: string; themes: string[]; summary: string }) => ({
      organizationId: orgId,
      text: item.text,
      sentiment: item.sentiment,
      themes: item.themes || [],
      summary: item.summary || "",
      source: "ai_bulk_analysis",
      createdBy: user.id,
      createdAt: new Date(),
    }));

    const result = await feedbackCol.insertMany(docs);

    return NextResponse.json({ inserted: result.insertedCount });
  } catch (error: unknown) {
    console.error("[/api/feedback/bulk]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Bulk save failed" },
      { status: 500 }
    );
  }
}
