import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { db } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const name = (body.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Organization name is required" }, { status: 400 });
    }

    const orgId = new ObjectId().toString();
    const org = {
      _id: orgId,
      name,
      createdAt: new Date(),
      plan: "standard",
      ownerId: user.id,
    };

    await db.collection("organization").insertOne(org);

    // Create member mapping
    await db.collection("member").insertOne({
      _id: new ObjectId().toString(),
      userId: user.id,
      organizationId: orgId,
      role: "owner",
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      organization: {
        id: orgId,
        name: org.name,
        role: "owner",
      },
    });
  } catch (error) {
    console.error("Org onboard error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal Server Error" },
      { status: 500 }
    );
  }
}
