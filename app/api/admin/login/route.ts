import { NextResponse } from "next/server";
import {
  adminConfigured,
  adminEnv,
  assertSameOrigin,
  emailsMatch,
  safeEqual,
  sessionCookie,
  signSession,
} from "@/lib/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  if (!adminConfigured()) {
    return NextResponse.json(
      { error: "Admin env is not set. Add ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_SECRET." },
      { status: 503 },
    );
  }

  const limited = rateLimit(`login:${clientIp(request)}`, 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many attempts. Wait 15 minutes." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;
  const env = adminEnv();
  const emailOk = emailsMatch(body?.email ?? "", env.email);
  const passOk = safeEqual(body?.password ?? "", env.password);
  if (!emailOk || !passOk) {
    return NextResponse.json({ error: "Email or password is wrong." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  const cookie = sessionCookie(signSession(env.email, env.secret));
  res.cookies.set(cookie);
  return res;
}
