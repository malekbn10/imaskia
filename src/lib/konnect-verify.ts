import { createHmac, timingSafeEqual } from "crypto";

/**
 * Verify Konnect webhook signature using HMAC SHA256.
 * The signature is expected in the `x-konnect-signature` header.
 */
export function verifyKonnectSignature(
  rawBody: string,
  signature: string | null
): boolean {
  const secret = process.env.KONNECT_WEBHOOK_SECRET;
  if (!secret) {
    console.warn("KONNECT_WEBHOOK_SECRET not set — skipping signature verification");
    return true;
  }

  if (!signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    return timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}
