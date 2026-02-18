/**
 * ClicToPay (SMT) Payment Gateway Client
 * 3-party redirect model — PCI-DSS compliant
 * Docs: CLICTOPAY_INTEGRATION_GUIDE.md
 */

const CURRENCY_TND = "788";

interface InitPaymentResult {
  orderId: string;
  formUrl: string;
}

/**
 * Step A: Initiate a payment session with ClicToPay.
 * Returns the formUrl to redirect the user to.
 * @param amountTnd - Amount in TND (e.g. 4.9)
 * @param orderNumber - Unique order identifier (e.g. "ORD-userId-plan-timestamp")
 */
export async function initiatePayment(
  amountTnd: number,
  orderNumber: string
): Promise<InitPaymentResult> {
  const baseUrl = process.env.CLICTOPAY_BASE_URL;
  const userName = process.env.CLICTOPAY_USERNAME;
  const password = process.env.CLICTOPAY_PASSWORD;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!baseUrl || !userName || !password) {
    throw new Error("ClicToPay credentials not configured");
  }

  const amountMillimes = Math.round(amountTnd * 1000);

  const params = new URLSearchParams({
    userName,
    password,
    orderNumber,
    amount: amountMillimes.toString(),
    currency: CURRENCY_TND,
    returnUrl: `${appUrl}/premium/success`,
    failUrl: `${appUrl}/premium?error=payment_failed`,
  });

  const res = await fetch(`${baseUrl}register.do`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const data = await res.json();

  if (data.errorCode && data.errorCode !== "0" && data.errorCode !== 0) {
    throw new Error(`ClicToPay Error ${data.errorCode}: ${data.errorMessage}`);
  }

  if (!data.formUrl) {
    throw new Error("No formUrl received from ClicToPay");
  }

  return {
    orderId: data.orderId,
    formUrl: data.formUrl,
  };
}

/**
 * Step C: Verify payment status server-side.
 * MUST be called after user returns — never trust the redirect alone.
 * @returns true if payment status is 2 (PAID)
 */
export async function verifyPayment(orderId: string): Promise<boolean> {
  const baseUrl = process.env.CLICTOPAY_BASE_URL;
  const userName = process.env.CLICTOPAY_USERNAME;
  const password = process.env.CLICTOPAY_PASSWORD;

  if (!baseUrl || !userName || !password) {
    throw new Error("ClicToPay credentials not configured");
  }

  const params = new URLSearchParams({
    userName,
    password,
    orderId,
  });

  const res = await fetch(
    `${baseUrl}getOrderStatusExtended.do?${params.toString()}`
  );

  const data = await res.json();
  const status = parseInt(data.orderStatus, 10);

  // Status 2 = PAID (successful transaction)
  return status === 2;
}
