import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkSubscription } from "@/lib/subscription";

/**
 * GET /api/subscription/status — Get the current user's subscription status
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ plan: "free", active: true, expiresAt: null });
  }

  const status = await checkSubscription(session.user.id);
  return NextResponse.json(status);
}
