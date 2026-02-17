import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPushNotification } from "@/lib/web-push";

const PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;
const PRAYER_NOTIFY_FIELDS = {
  Fajr: "notifyFajr",
  Dhuhr: "notifyDhuhr",
  Asr: "notifyAsr",
  Maghrib: "notifyMaghrib",
  Isha: "notifyIsha",
} as const;

/**
 * GET /api/cron/notifications — Vercel cron handler
 * Runs every 5 minutes. Checks which users need prayer notifications.
 */
export async function GET(req: NextRequest) {
  // Verify cron secret (Vercel sends this header)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET ?? process.env.NEXTAUTH_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Get all users with push tokens and their subscriptions
  const users = await prisma.user.findMany({
    where: {
      pushTokens: { some: {} },
      lat: { not: null },
      lng: { not: null },
    },
    include: {
      pushTokens: true,
      subscription: true,
    },
  });

  let totalSent = 0;

  for (const user of users) {
    if (!user.lat || !user.lng) continue;

    const isPremium =
      user.subscription?.plan === "premium" || user.subscription?.plan === "vip";

    // Fetch today's prayer times for this user's location
    let timings: Record<string, string>;
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings/${Math.floor(now.getTime() / 1000)}?latitude=${user.lat}&longitude=${user.lng}&method=16`
      );
      const data = await res.json();
      timings = data.data.timings;
    } catch {
      continue;
    }

    for (const prayer of PRAYER_KEYS) {
      // Free users: only Maghrib
      if (!isPremium && prayer !== "Maghrib") continue;

      const notifyField = PRAYER_NOTIFY_FIELDS[prayer];
      if (!user[notifyField]) continue;

      const timeStr = timings[prayer];
      if (!timeStr) continue;

      const [h, m] = timeStr.replace(/\s*\(.*\)/, "").split(":").map(Number);
      const prayerMinutes = h * 60 + m;
      const notifyAt = prayerMinutes - user.notifyDelay;

      // Check if we're within the 5-minute cron window
      if (nowMinutes >= notifyAt && nowMinutes < notifyAt + 5) {
        const prayerName = prayer;
        const expired: string[] = [];

        for (const token of user.pushTokens) {
          const success = await sendPushNotification(
            { endpoint: token.endpoint, keys: { p256dh: token.p256dh, auth: token.auth } },
            {
              title: `🕌 ${prayerName}`,
              body: `${user.notifyDelay} min — ${timeStr.replace(/\s*\(.*\)/, "")}`,
              icon: "/icons/icon-192.png",
              badge: "/icons/icon-192.png",
              tag: `prayer-${prayer}`,
              url: "/",
            }
          );
          if (success) {
            totalSent++;
          } else {
            expired.push(token.id);
          }
        }

        if (expired.length > 0) {
          await prisma.pushToken.deleteMany({
            where: { id: { in: expired } },
          });
        }
      }
    }

    // Special: Laylat al-Qadr notification during last 10 nights
    if (isPremium) {
      try {
        const res = await fetch(
          `https://api.aladhan.com/v1/timings/${Math.floor(now.getTime() / 1000)}?latitude=${user.lat}&longitude=${user.lng}&method=16`
        );
        const data = await res.json();
        const hijriDay = parseInt(data.data.date.hijri.day, 10);

        if (hijriDay >= 21 && hijriDay <= 30 && hijriDay % 2 === 1) {
          const ishaTime = timings.Isha;
          if (ishaTime) {
            const [ih, im] = ishaTime.replace(/\s*\(.*\)/, "").split(":").map(Number);
            const ishaMin = ih * 60 + im;
            if (nowMinutes >= ishaMin && nowMinutes < ishaMin + 5) {
              for (const token of user.pushTokens) {
                await sendPushNotification(
                  { endpoint: token.endpoint, keys: { p256dh: token.p256dh, auth: token.auth } },
                  {
                    title: "✨ ليلة القدر",
                    body: "لَيْلَةُ الْقَدْرِ خَيْرٌ مِنْ أَلْفِ شَهْرٍ",
                    icon: "/icons/icon-192.png",
                    tag: "laylat-al-qadr",
                    url: "/adhkar",
                  }
                );
                totalSent++;
              }
            }
          }
        }
      } catch {
        // Ignore hijri date fetch errors
      }
    }
  }

  return NextResponse.json({ ok: true, sent: totalSent, users: users.length });
}
