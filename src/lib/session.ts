/**
 * Server-side session helper for API route handlers.
 * Returns the current user + their organization membership.
 */
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { headers } from "next/headers";
import { ObjectId } from "mongodb";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

export interface OrgMembership {
  organizationId: string;
  organizationName: string;
  role: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? null,
    };
  } catch {
    return null;
  }
}

export async function getUserMembership(userId: string): Promise<OrgMembership | null> {
  try {
    const membership =
      (await db.collection("memberships").findOne({ userId })) ||
      (await db.collection("member").findOne({ userId }));
    if (!membership) return null;

    const orgId = membership.organizationId;

    let orgObjectId: ObjectId | null = null;
    try {
      orgObjectId = new ObjectId(orgId);
    } catch {
      // orgId is not a valid ObjectId string
    }

    const orgFilter = orgObjectId ? { _id: orgObjectId } : { _id: orgId as unknown as ObjectId };
    const org =
      (await db.collection("organizations").findOne(orgFilter)) ||
      (await db.collection("organization").findOne(orgFilter));

    return {
      organizationId: String(membership.organizationId),
      organizationName: org?.name ?? "Unknown Org",
      role: membership.role ?? "viewer",
    };
  } catch {
    return null;
  }
}
