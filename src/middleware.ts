import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Routes requiring authenticated session (NextAuth session token cookie)
 */
const AUTH_ROUTES = ["/api/push/register", "/api/subscription/checkout", "/api/subscription/status"];

/**
 * Routes requiring API key (internal cron / admin)
 */
const API_KEY_ROUTES = ["/api/cron/notifications", "/api/push/send"];

/**
 * Webhook routes with stricter rate limiting
 */
const WEBHOOK_ROUTES = ["/api/webhook/konnect"];

function getSessionToken(req: NextRequest): string | undefined {
  return (
    req.cookies.get("__Secure-authjs.session-token")?.value ??
    req.cookies.get("authjs.session-token")?.value
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rate limiting
  const isWebhook = WEBHOOK_ROUTES.some((r) => pathname.startsWith(r));
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const limit = isWebhook ? 10 : 60;
  const { allowed, remaining, retryAfter } = rateLimit(clientIp, limit);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          "X-RateLimit-Remaining": "0",
          "Retry-After": String(retryAfter),
        },
      }
    );
  }

  // Auth guard — require session cookie
  const requiresAuth = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  if (requiresAuth) {
    const token = getSessionToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // API key guard — require CRON_SECRET
  const requiresApiKey = API_KEY_ROUTES.some((r) => pathname.startsWith(r));
  if (requiresApiKey) {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const response = NextResponse.next();
  response.headers.set("X-RateLimit-Remaining", String(remaining));
  return response;
}

export const config = {
  matcher: ["/api/push/:path*", "/api/subscription/:path*", "/api/cron/:path*", "/api/webhook/:path*"],
};
