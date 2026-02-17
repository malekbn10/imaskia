const KONNECT_API_URL = "https://api.konnect.network/api/v2";

interface KonnectCheckoutResponse {
  payUrl: string;
  paymentRef: string;
}

interface CheckoutParams {
  amount: number; // in millimes (10000 = 10 TND)
  userId: string;
  plan: "premium" | "vip";
  successUrl: string;
  failUrl: string;
}

/**
 * Create a checkout session with Konnect payment gateway.
 * Returns the redirect URL and payment reference.
 */
export async function createCheckoutSession(params: CheckoutParams): Promise<KonnectCheckoutResponse> {
  const res = await fetch(`${KONNECT_API_URL}/payments/init-payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.KONNECT_API_KEY ?? "",
    },
    body: JSON.stringify({
      receiverWalletId: process.env.KONNECT_WALLET_ID,
      amount: params.amount,
      token: "TND",
      type: "immediate",
      description: `Imsakia.tn - ${params.plan}`,
      acceptedPaymentMethods: ["bank_card", "e-DINAR", "wallet"],
      lifespan: 30, // minutes
      checkoutForm: false,
      addPaymentFeesToAmount: true,
      firstName: "",
      lastName: "",
      email: "",
      orderId: `${params.userId}-${params.plan}-${Date.now()}`,
      webhook: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/konnect`,
      silentWebhook: true,
      successUrl: params.successUrl,
      failUrl: params.failUrl,
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Konnect API error: ${res.status} ${error}`);
  }

  const data = await res.json();
  return {
    payUrl: data.payUrl,
    paymentRef: data.paymentRef,
  };
}

/**
 * Verify a payment status with Konnect.
 */
export async function getPaymentStatus(paymentRef: string): Promise<{ status: string }> {
  const res = await fetch(`${KONNECT_API_URL}/payments/${paymentRef}`, {
    headers: {
      "x-api-key": process.env.KONNECT_API_KEY ?? "",
    },
  });

  if (!res.ok) {
    throw new Error(`Konnect status check failed: ${res.status}`);
  }

  const data = await res.json();
  return { status: data.payment?.status ?? "unknown" };
}
