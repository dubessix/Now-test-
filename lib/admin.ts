import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "challan_admin";
const MAX_AGE = 60 * 60 * 12;

export function adminEnv() {
  return {
    email: (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase(),
    password: process.env.ADMIN_PASSWORD ?? "",
    secret: process.env.ADMIN_SECRET ?? "",
    actionPassword: process.env.ADMIN_ACTION_PASSWORD || process.env.ADMIN_PASSWORD || "",
  };
}

export function adminConfigured() {
  const env = adminEnv();
  return Boolean(env.email && env.password && env.secret.length >= 16);
}

export function emailsMatch(input: string, expected: string) {
  return safeEqual(input.trim().toLowerCase(), expected.trim().toLowerCase());
}

export function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) {
    timingSafeEqual(left, Buffer.alloc(left.length));
    return false;
  }
  return timingSafeEqual(left, right);
}

export function signSession(email: string, secret: string) {
  const exp = Date.now() + MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  const sig = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function readSession(token: string | undefined, secret: string) {
  if (!token || !secret) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as {
      email: string;
      exp: number;
    };
    if (data.exp < Date.now()) return null;
    if (!emailsMatch(data.email, adminEnv().email)) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  if (!adminConfigured()) return null;
  const jar = await cookies();
  return readSession(jar.get(COOKIE)?.value, adminEnv().secret);
}

export function sessionCookie(token: string) {
  return {
    name: COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}
