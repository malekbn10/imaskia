import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { initiatePayment } from "@/lib/clictopay";

export const dynamic = "force-dynamic";

const PLAN_PRICES: Record<string, number> = {
  premium: 4.9,  // TND
  vip: 9.9,      // TND
};

/**
 * POST /api/subscription/checkout — Create a ClicToPay payment session
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { plan } = await req.json();

  if (!plan || !PLAN_PRICES[plan]) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  try {
    const orderNumber = `${session.user.id}-${plan}-${Date.now()}`;

    const { orderId, formUrl } = await initiatePayment(
      PLAN_PRICES[plan],
      orderNumber
    );

    return NextResponse.json({ url: formUrl, orderId });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );
  }
}
