"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Activity, Claim } from "@/lib/store";

type Payload = {
  claims: Claim[];
  activity: Activity[];
  stats: { pending: number; paid: number; rejected: number; seats: number };
};

export function AdminDesk() {
  const router = useRouter();
  const [data, setData] = useState<Payload | null>(null);
  const [email, setEmail] = useState("");
  const [store, setStore] = useState("");
  const [actionPassword, setActionPassword] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    const me = await fetch("/api/admin/me");
    if (!me.ok) {
      router.replace("/admin/login");
      return;
    }
    const who = (await me.json()) as { email?: string; store?: string };
    setEmail(who.email ?? "");
    setStore(who.store ?? "");
    const res = await fetch("/api/admin/claims");
    if (!res.ok) {
      router.replace("/admin/login");
      return;
    }
    setData((await res.json()) as Payload);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(id: string, action: "approve" | "reject") {
    setError("");
    if (!actionPassword) {
      setError("Type the action password from env first.");
      return;
    }
    setBusyId(id);
    const res = await fetch(`/api/admin/claims/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, password: actionPassword }),
    });
    const body = (await res.json()) as { error?: string };
    setBusyId("");
    if (!res.ok) {
      setError(body.error || "Action failed.");
      return;
    }
    await load();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  if (!data) {
    return <p className="p-8 text-slate-400">Opening the desk…</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-700 pb-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-red-300">
            Challan desk
          </p>
          <h1 className="mt-1 font-serif text-3xl text-sheet">Users and UPI claims</h1>
          <p className="mt-1 text-sm text-slate-400">
            Signed in as {email} · store {store} · no Razorpay
          </p>
        </div>
        <button type="button" onClick={logout} className="text-sm text-slate-400 underline">
          Sign out
        </button>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-4">
        <Stat label="Waiting" value={data.stats.pending} />
        <Stat label="Paid / unlocked" value={data.stats.paid} />
        <Stat label="Rejected" value={data.stats.rejected} />
        <Stat label="Founding seats used" value={data.stats.seats} />
      </section>

      <section className="mt-8 border border-slate-700 bg-slate-900 p-4 text-sm leading-6 text-slate-300">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-red-300">
          How this works
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Customer pays your UPI (GPay / PhonePe). No Razorpay.</li>
          <li>They submit name, phone, email, and the UTR on /founding.</li>
          <li>The claim appears here as Waiting.</li>
          <li>You open your UPI app, confirm the money, type the action password, Approve.</li>
          <li>They tap “Check my payment” and the invoice pad unlocks.</li>
        </ol>
      </section>

      <label className="mt-6 block max-w-md text-sm text-slate-300">
        Action password (from ADMIN_ACTION_PASSWORD)
        <input
          type="password"
          value={actionPassword}
          onChange={(e) => setActionPassword(e.target.value)}
          className="mt-1 w-full border border-slate-600 bg-ink px-3 py-2 text-sheet"
          placeholder="Required to approve or reject"
        />
      </label>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400">
            <tr>
              <th className="py-2">User</th>
              <th>UTR</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Unlock</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {data.claims.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-slate-500">
                  No users yet. The first claim appears when someone pays and submits the UTR.
                </td>
              </tr>
            ) : (
              data.claims.map((claim) => (
                <tr key={claim.id} className="border-t border-slate-800">
                  <td className="py-3">
                    <p className="text-sheet">{claim.name}</p>
                    <p className="text-xs text-slate-400">
                      {claim.phone} · {claim.email}
                    </p>
                  </td>
                  <td className="font-mono text-xs">{claim.utr}</td>
                  <td>₹{claim.amount.toLocaleString("en-IN")}</td>
                  <td className="capitalize">{claim.status}</td>
                  <td className="font-mono text-xs">{claim.unlockCode || "—"}</td>
                  <td className="space-x-2 whitespace-nowrap">
                    <button
                      type="button"
                      disabled={busyId === claim.id || claim.status === "paid"}
                      onClick={() => act(claim.id, "approve")}
                      className="bg-emerald-800 px-2 py-1 text-xs text-white disabled:opacity-40"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === claim.id || claim.status === "rejected"}
                      onClick={() => act(claim.id, "reject")}
                      className="border border-slate-500 px-2 py-1 text-xs text-slate-200 disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-sheet">Activity</h2>
        <ul className="mt-3 space-y-2 text-sm text-slate-400">
          {data.activity.length === 0 ? <li>No events yet.</li> : null}
          {data.activity.map((item) => (
            <li key={item.id}>
              <span className="font-mono text-[11px] text-red-300">{item.kind}</span>{" "}
              {item.detail}
              <span className="ml-2 text-xs text-slate-600">
                {new Date(item.at).toLocaleString("en-IN")}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-slate-700 bg-slate-900 px-4 py-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-400">{label}</p>
      <p className="mt-1 font-serif text-3xl text-sheet">{value}</p>
    </div>
  );
}
