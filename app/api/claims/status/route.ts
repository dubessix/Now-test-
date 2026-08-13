import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loadStore } from "@/lib/store";
import { cleanPhone } from "@/lib/validate";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const limited = rateLimit(`status:${clientIp(request)}`, 30, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many checks." }, { status: 429 });
  }

  const url = new URL(request.url);
  const phone = cleanPhone(url.searchParams.get("phone") ?? "");
  const utr = (url.searchParams.get("utr") ?? "").trim().toUpperCase();
  if (phone.length !== 10 || utr.length < 8) {
    return NextResponse.json({ error: "Need phone and UTR." }, { status: 400 });
  }

  const data = await loadStore();
  const claim = data.claims.find((item) => item.phone === phone && item.utr === utr);
  if (!claim) {
    return NextResponse.json({ status: "unknown" });
  }
  return NextResponse.json({
    status: claim.status,
    unlockCode: claim.status === "paid" ? claim.unlockCode : "",
  });
}
