import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { verifyPayment } from "@/lib/clictopay";

export const dynamic = "force-dynamic";

/**
 * POST /api/subscription/verify — Verify ClicToPay payment and activate subscription
 * Called by the success page after user returns from ClicToPay
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId, plan } = await req.json();

  if (!orderId || !plan || !["premium", "vip"].includes(plan)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  try {
    const isPaid = await verifyPayment(orderId);

    if (!isPaid) {
      return NextResponse.json(
        { error: "Payment not completed", verified: false },
        { status: 402 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Upsert subscription
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        plan,
        status: "active",
        paymentRef: orderId,
        expiresAt,
      },
      update: {
        plan,
        status: "active",
        paymentRef: orderId,
        expiresAt,
      },
    });

    return NextResponse.json({ verified: true, plan });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
