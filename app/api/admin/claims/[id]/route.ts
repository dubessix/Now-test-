import { NextResponse } from "next/server";
import {
  adminEnv,
  assertSameOrigin,
  getAdminSession,
  safeEqual,
} from "@/lib/admin";
import { logActivity, mutateStore, newUnlockCode } from "@/lib/store";

export const runtime = "nodejs";

type Body = { action?: string; password?: string; note?: string };

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!assertSameOrigin(request)) {
    return NextResponse.json({ error: "Bad origin" }, { status: 403 });
  }
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { id } = await context.params;
  const body = ((await request.json().catch(() => null)) ?? {}) as Body;
  if (!safeEqual(body.password ?? "", adminEnv().actionPassword)) {
    return NextResponse.json({ error: "Action password is wrong." }, { status: 403 });
  }

  const action = body.action;
  if (action !== "approve" && action !== "reject" && action !== "note") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  try {
    const claim = await mutateStore((data) => {
      const found = data.claims.find((item) => item.id === id);
      if (!found) throw new Error("Claim not found");
      found.updatedAt = new Date().toISOString();
      if (action === "approve") {
        found.status = "paid";
        found.paidAt = found.updatedAt;
        if (!found.unlockCode) found.unlockCode = newUnlockCode();
        logActivity(data, "approve", `${found.name} · ${found.phone} · ${found.unlockCode}`);
      } else if (action === "reject") {
        found.status = "rejected";
        found.paidAt = null;
        logActivity(data, "reject", `${found.name} · ${found.phone}`);
      } else if (body.note) {
        found.note = body.note.slice(0, 240);
        logActivity(data, "note", `${found.name}: ${found.note}`);
      }
      return found;
    });
    return NextResponse.json({ ok: true, claim });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
