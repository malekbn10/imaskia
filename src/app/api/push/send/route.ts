import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushNotification, PushPayload } from "@/lib/web-push";

/**
 * POST /api/push/send — Internal endpoint to send push to a specific user
 * Protected by API key check (for internal/cron use only)
 */
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.NEXTAUTH_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId, payload } = (await req.json()) as {
    userId: string;
    payload: PushPayload;
  };

  const tokens = await prisma.pushToken.findMany({
    where: { userId },
  });

  let sent = 0;
  const expired: string[] = [];

  for (const token of tokens) {
    const success = await sendPushNotification(
      { endpoint: token.endpoint, keys: { p256dh: token.p256dh, auth: token.auth } },
      payload
    );
    if (success) {
      sent++;
    } else {
      expired.push(token.id);
    }
  }

  // Clean up expired subscriptions
  if (expired.length > 0) {
    await prisma.pushToken.deleteMany({
      where: { id: { in: expired } },
    });
  }

  return NextResponse.json({ sent, expired: expired.length });
}
