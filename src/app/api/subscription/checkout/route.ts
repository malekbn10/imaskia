import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createCheckoutSession } from "@/lib/konnect";

const PLAN_PRICES: Record<string, number> = {
  premium: 4900, // 4.9 TND in millimes
  vip: 9900,     // 9.9 TND in millimes
};

/**
 * POST /api/subscription/checkout — Create a Konnect checkout session
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const checkout = await createCheckoutSession({
      amount: PLAN_PRICES[plan],
      userId: session.user.id,
      plan: plan as "premium" | "vip",
      successUrl: `${appUrl}/premium/success?plan=${plan}`,
      failUrl: `${appUrl}/premium?error=payment_failed`,
    });

    return NextResponse.json({ url: checkout.payUrl, ref: checkout.paymentRef });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
