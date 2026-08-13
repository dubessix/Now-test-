import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { loadStore } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  const data = await loadStore();
  return NextResponse.json({
    claims: data.claims,
    activity: data.activity.slice(0, 40),
    stats: {
      pending: data.claims.filter((c) => c.status === "pending").length,
      paid: data.claims.filter((c) => c.status === "paid").length,
      rejected: data.claims.filter((c) => c.status === "rejected").length,
      seats: data.claims.filter((c) => c.status === "paid").length,
    },
  });
}
