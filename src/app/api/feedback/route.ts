import { NextResponse } from "next/server";
import { getSessionUser, getUserMembership } from "@/lib/session";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const membership = await getUserMembership(user.id);
    if (!membership) {
      return NextResponse.json({ error: "No organization found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const sentiment = searchParams.get("sentiment");
    const search = searchParams.get("search");

    const query: Record<string, unknown> = {
      organizationId: membership.organizationId,
    };

    if (sentiment && sentiment !== "ALL") {
      query.sentiment = sentiment.toLowerCase();
    }

    if (search) {
      query.$or = [
        { text: { $regex: search, $options: "i" } },
        { customer: { $regex: search, $options: "i" } },
        { themes: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const items = await db
      .collection("feedback")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    return NextResponse.json({
      items: items.map((doc) => ({
        id: doc._id.toString(),
        customer: doc.customer || doc.userName || "Verified User",
        email: doc.email || doc.userEmail || "user@organization.io",
        org: membership.organizationName,
        channel: doc.channel || doc.source || "In-App Feedback",
        sentiment: (doc.sentiment || "NEUTRAL").toUpperCase(),
        score: doc.score || (doc.sentiment === "positive" ? 92 : doc.sentiment === "negative" ? 28 : 55),
        theme: Array.isArray(doc.themes) && doc.themes.length > 0 ? doc.themes[0] : (doc.theme || "Customer Experience"),
        themes: doc.themes || [],
        content: doc.text || doc.content || "",
        date: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : "Recent",
      })),
      total: items.length,
    });
  } catch (error: unknown) {
    console.error("[/api/feedback GET]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch feedback" },
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

    const body = await req.json();
    const doc = {
      organizationId: membership.organizationId,
      customer: body.customer || user.name || "Customer",
      email: body.email || user.email || "",
      text: body.text || body.content || "",
      sentiment: (body.sentiment || "neutral").toLowerCase(),
      themes: body.themes || [body.theme || "General Feedback"],
      channel: body.channel || "Direct Input",
      score: body.score || 70,
      createdAt: new Date(),
      createdBy: user.id,
    };

    const res = await db.collection("feedback").insertOne(doc);
    return NextResponse.json({ success: true, id: res.insertedId });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save feedback" },
      { status: 500 }
    );
  }
}
