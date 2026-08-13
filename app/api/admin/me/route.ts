import { NextResponse } from "next/server";
import { adminConfigured, getAdminSession } from "@/lib/admin";
import { storeMode } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { ok: false, configured: adminConfigured() },
      { status: 401 },
    );
  }
  return NextResponse.json({
    ok: true,
    email: session.email,
    store: storeMode(),
    configured: true,
  });
}
