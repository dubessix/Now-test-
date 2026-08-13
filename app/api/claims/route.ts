import { NextResponse } from "next/server";
import { site } from "@/lib/config";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import {
  logActivity,
  mutateStore,
  newClaimId,
  type Claim,
} from "@/lib/store";
import { cleanPhone, isEmail, isName, isPhone, isUtr } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const limited = rateLimit(`claim:${clientIp(request)}`, 8, 60 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many claims from this network." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as
    | { name?: string; email?: string; phone?: string; utr?: string }
    | null;
  if (!body) return NextResponse.json({ error: "Send JSON." }, { status: 400 });

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const phone = cleanPhone(body.phone ?? "");
  const utr = (body.utr ?? "").trim().toUpperCase();

  if (!isName(name)) return NextResponse.json({ error: "Enter your name." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  if (!isPhone(phone)) return NextResponse.json({ error: "Enter a 10-digit mobile." }, { status: 400 });
  if (!isUtr(utr)) return NextResponse.json({ error: "Enter the UPI UTR / reference no." }, { status: 400 });

  const now = new Date().toISOString();
  const claim: Claim = {
    id: newClaimId(),
    name,
    email,
    phone,
    utr,
    amount: site.foundingPrice,
    status: "pending",
    unlockCode: "",
    note: "",
    createdAt: now,
    updatedAt: now,
    paidAt: null,
  };

  try {
    const saved = await mutateStore((data) => {
      const dup = data.claims.find(
        (item) => item.utr === utr || (item.phone === phone && item.status !== "rejected"),
      );
      if (dup) return dup;
      data.claims.unshift(claim);
      logActivity(data, "claim", `${name} · ${phone} · UTR ${utr}`);
      return claim;
    });
    return NextResponse.json({
      ok: true,
      id: saved.id,
      status: saved.status,
      message:
        saved.id === claim.id
          ? "Claim received. Unlock after the admin confirms your UPI."
          : "This payment is already on file.",
    });
  } catch {
    return NextResponse.json(
      { error: "Could not save the claim. Try again or WhatsApp the UTR." },
      { status: 500 },
    );
  }
}
