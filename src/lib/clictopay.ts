/**
 * ClicToPay (SMT) Payment Gateway Client
 * 3-party redirect model — PCI-DSS compliant
 * Docs: CLICTOPAY_INTEGRATION_GUIDE.md
 */

import https from "node:https";
import http from "node:http";

const CURRENCY_TND = "788";

interface InitPaymentResult {
  orderId: string;
  formUrl: string;
}

/**
 * Low-level HTTPS request that can optionally skip TLS verification
 * for ClicToPay test/sandbox (their test cert chain is broken).
 */
function clictoPayFetch(
  url: string,
  options: { method?: string; body?: string; headers?: Record<string, string> } = {}
): Promise<{ json: () => Promise<Record<string, unknown>> }> {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const isTest = parsed.hostname.includes("test.clictopay.com");
    const transport = parsed.protocol === "https:" ? https : http;

    const reqOptions: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (parsed.protocol === "https:" ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: options.method ?? "GET",
      headers: options.headers ?? {},
      ...(isTest ? { rejectUnauthorized: false } : {}),
    };

    const req = transport.request(reqOptions, (res) => {
      let data = "";
      res.on("data", (chunk: Buffer) => { data += chunk.toString(); });
      res.on("end", () => {
        resolve({
          json: () => Promise.resolve(JSON.parse(data)),
        });
      });
    });

    req.on("error", reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

/**
 * Step A: Initiate a payment session with ClicToPay.
 * Returns the formUrl to redirect the user to.
 * @param amountTnd - Amount in TND (e.g. 4.9)
 * @param orderNumber - Unique order identifier (e.g. "ORD-userId-plan-timestamp")
 */
export async function initiatePayment(
  amountTnd: number,
  orderNumber: string,
  plan: string
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
    returnUrl: `${appUrl}/premium/success?plan=${plan}`,
    failUrl: `${appUrl}/premium?error=payment_failed`,
  });

  const res = await clictoPayFetch(`${baseUrl}register.do`, {
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
    orderId: data.orderId as string,
    formUrl: data.formUrl as string,
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

  const res = await clictoPayFetch(
    `${baseUrl}getOrderStatusExtended.do?${params.toString()}`
  );

  const data = await res.json();
  const status = parseInt(data.orderStatus as string, 10);

  // Status 2 = PAID (successful transaction)
  return status === 2;
}
