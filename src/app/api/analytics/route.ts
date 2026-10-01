import { NextResponse } from "next/server";
import { getSessionUser, getUserMembership } from "@/lib/session";
import { db } from "@/lib/db";

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

    const orgId = membership.organizationId;
    const feedbackCol = db.collection("feedback");

    const total = await feedbackCol.countDocuments({ organizationId: orgId });

    // Sentiment aggregation
    const sentimentAgg = await feedbackCol
      .aggregate([
        { $match: { organizationId: orgId } },
        {
          $group: {
            _id: "$sentiment",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const sentiment: Record<string, number> = { positive: 0, neutral: 0, negative: 0 };
    for (const s of sentimentAgg) {
      const key = (s._id || "neutral").toLowerCase();
      if (key in sentiment) {
        sentiment[key] = s.count;
      }
    }

    // Top themes
    const themesAgg = await feedbackCol
      .aggregate([
        { $match: { organizationId: orgId, themes: { $exists: true } } },
        { $unwind: "$themes" },
        { $group: { _id: "$themes", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    const topThemes = themesAgg.map((t) => ({ theme: t._id as string, count: t.count as number }));

    return NextResponse.json({ total, sentiment, topThemes });
  } catch (error: unknown) {
    console.error("[/api/analytics]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal error" },
      { status: 500 }
    );
  }
}
