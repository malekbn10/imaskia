import { prisma } from "@/lib/prisma";

export type Plan = "free" | "premium" | "vip";

interface SubscriptionStatus {
  plan: Plan;
  active: boolean;
  expiresAt: Date | null;
}

/**
 * Check the subscription status for a user.
 * Returns "free" for users without a subscription or with expired ones.
 */
export async function checkSubscription(userId: string): Promise<SubscriptionStatus> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!sub) {
    return { plan: "free", active: true, expiresAt: null };
  }

  // Check if subscription has expired
  if (sub.expiresAt && sub.expiresAt < new Date()) {
    return { plan: "free", active: false, expiresAt: sub.expiresAt };
  }

  if (sub.status !== "active") {
    return { plan: "free", active: false, expiresAt: sub.expiresAt };
  }

  return {
    plan: sub.plan as Plan,
    active: true,
    expiresAt: sub.expiresAt,
  };
}

/**
 * Quick check: is the user a premium (or higher) subscriber?
 */
export async function isPremium(userId: string): Promise<boolean> {
  const { plan, active } = await checkSubscription(userId);
  return active && (plan === "premium" || plan === "vip");
}

/**
 * Quick check: is the user a VIP subscriber?
 */
export async function isVIP(userId: string): Promise<boolean> {
  const { plan, active } = await checkSubscription(userId);
  return active && plan === "vip";
}
