import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentStatus } from "@/lib/konnect";
import { verifyKonnectSignature } from "@/lib/konnect-verify";

/**
 * POST /api/webhook/konnect — Webhook called by Konnect after payment
 */
export async function POST(req: NextRequest) {
  try {
    // Read raw body as text for HMAC verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-konnect-signature");

    // Verify HMAC signature
    if (!verifyKonnectSignature(rawBody, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Optional IP allowlist
    const allowedIps = process.env.KONNECT_ALLOWED_IPS;
    if (allowedIps) {
      const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
        ?? req.headers.get("x-real-ip")
        ?? "";
      const allowed = allowedIps.split(",").map((ip) => ip.trim());
      if (!allowed.includes(clientIp)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = JSON.parse(rawBody);
    const paymentRef = body.payment_ref;

    if (!paymentRef) {
      return NextResponse.json({ error: "Missing payment_ref" }, { status: 400 });
    }

    // Idempotence check — skip if this payment was already processed
    const existing = await prisma.subscription.findFirst({
      where: { konnectId: paymentRef },
    });
    if (existing) {
      return NextResponse.json({ success: true, message: "Already processed" });
    }

    // Verify payment with Konnect API
    const { status } = await getPaymentStatus(paymentRef);

    if (status !== "completed") {
      return NextResponse.json({ error: "Payment not completed", status }, { status: 400 });
    }

    // Extract user info from orderId: "userId-plan-timestamp"
    const orderId = body.orderId as string | undefined;
    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const parts = orderId.split("-");
    const plan = parts[parts.length - 2];
    const userId = parts.slice(0, parts.length - 2).join("-");

    if (!userId || !["premium", "vip"].includes(plan)) {
      return NextResponse.json({ error: "Invalid orderId format" }, { status: 400 });
    }

    // Calculate expiration (30 days from now)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Upsert subscription
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: "active",
        konnectId: paymentRef,
        expiresAt,
      },
      update: {
        plan,
        status: "active",
        konnectId: paymentRef,
        expiresAt,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
