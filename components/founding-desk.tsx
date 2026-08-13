"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { isUpiConfigured, site } from "@/lib/config";
import { isUnlocked, unlockFounding } from "@/lib/storage";

export function FoundingDesk() {
  const [unlocked, setUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [utr, setUtr] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setUnlocked(isUnlocked());
    const saved = localStorage.getItem("challan.claim");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { phone?: string; utr?: string; name?: string; email?: string };
      setPhone(parsed.phone ?? "");
      setUtr(parsed.utr ?? "");
      setName(parsed.name ?? "");
      setEmail(parsed.email ?? "");
    } catch {
      /* ignore */
    }
  }, []);

  const pay = (() => {
    const params = new URLSearchParams({
      pa: site.upiId,
      pn: site.upiName,
      am: String(site.foundingPrice),
      cu: "INR",
      tn: "Challan founding year",
    });
    return `upi://pay?${params.toString()}`;
  })();
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pay)}`;

  async function submitClaim(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/claims", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, utr }),
    });
    const data = (await res.json()) as { error?: string; message?: string; status?: string };
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error || "Could not send the claim.");
      return;
    }
    localStorage.setItem("challan.claim", JSON.stringify({ name, email, phone, utr }));
    setStatus(data.status ?? "pending");
    setMessage(data.message || "Claim sent. Wait for the desk to confirm.");
  }

  async function checkPayment() {
    setBusy(true);
    setMessage("");
    const res = await fetch(
      `/api/claims/status?phone=${encodeURIComponent(phone)}&utr=${encodeURIComponent(utr)}`,
    );
    const data = (await res.json()) as { status?: string; unlockCode?: string; error?: string };
    setBusy(false);
    if (!res.ok) {
      setMessage(data.error || "Could not check.");
      return;
    }
    setStatus(data.status ?? "unknown");
    if (data.status === "paid" && data.unlockCode) {
      unlockFounding();
      localStorage.setItem("challan.unlockCode", data.unlockCode);
      setUnlocked(true);
      setMessage(`Unlocked. Code ${data.unlockCode}`);
      return;
    }
    if (data.status === "pending") {
      setMessage("Still waiting. The desk has not confirmed this UTR yet.");
      return;
    }
    if (data.status === "rejected") {
      setMessage("This claim was rejected. WhatsApp if you already paid.");
      return;
    }
    setMessage("No claim found for that phone + UTR.");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stamp">
        First {site.foundingSeats} seats
      </p>
      <h1 className="mt-2 font-serif text-4xl text-carbon">
        ₹{site.foundingPrice.toLocaleString("en-IN")} on UPI. Then wait for the stamp.
      </h1>
      <p className="mt-3 max-w-xl text-mute">
        No Razorpay. Pay the QR, send the UTR. Unlock happens only after the admin confirms
        the money in the UPI app.
      </p>

      {!isUpiConfigured ? (
        <p className="mt-6 border border-stamp/40 bg-sheet p-4 text-sm">
          Set NEXT_PUBLIC_UPI_ID in env so customers can pay you.
        </p>
      ) : (
        <div className="mt-8 grid gap-8 border border-rule bg-sheet p-6 sm:grid-cols-[220px_1fr]">
          <img src={qr} width={220} height={220} alt="UPI QR for Challan founding" />
          <div>
            <p className="font-mono text-sm text-carbon">{site.upiId}</p>
            <p className="mt-1 font-serif text-3xl">
              ₹{site.foundingPrice.toLocaleString("en-IN")}
            </p>
            <a href={pay} className="mt-4 inline-block bg-carbon px-4 py-2 text-sm text-white">
              Open UPI app
            </a>
          </div>
        </div>
      )}

      <form onSubmit={submitClaim} className="mt-8 space-y-3 border border-rule bg-sheet p-6">
        <h2 className="font-serif text-2xl text-carbon">After you pay</h2>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full border border-rule bg-paper px-3 py-2 text-sm"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="border border-rule bg-paper px-3 py-2 text-sm"
          />
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="10-digit mobile"
            className="border border-rule bg-paper px-3 py-2 text-sm"
          />
        </div>
        <input
          required
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="UPI UTR / reference number"
          className="w-full border border-rule bg-paper px-3 py-2 font-mono text-sm"
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={busy}
            className="bg-stamp px-4 py-2 text-sm text-white disabled:opacity-60"
          >
            Send claim to the desk
          </button>
          <button
            type="button"
            disabled={busy || !phone || !utr}
            onClick={checkPayment}
            className="border border-carbon px-4 py-2 text-sm text-carbon disabled:opacity-60"
          >
            Check my payment
          </button>
        </div>
        {status ? (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-mute">Status: {status}</p>
        ) : null}
        {message ? <p className="text-sm text-carbon">{message}</p> : null}
        {unlocked ? (
          <p className="font-mono text-sm text-paid">
            Unlocked.{" "}
            <Link href="/make" className="underline">
              Make invoices
            </Link>
          </p>
        ) : null}
      </form>
    </div>
  );
}
