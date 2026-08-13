"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isUpiConfigured, isWhatsappConfigured, site, whatsappUrl } from "@/lib/config";
import { isUnlocked, unlockFounding } from "@/lib/storage";

export function FoundingDesk() {
  const [unlocked, setUnlocked] = useState(false);
  const [upi, setUpi] = useState(site.upiId);

  useEffect(() => {
    setUnlocked(isUnlocked());
    const saved = localStorage.getItem("challan.founderUpi");
    if (saved) setUpi(saved);
  }, []);

  const pay = (() => {
    const params = new URLSearchParams({
      pa: upi || site.upiId,
      pn: site.upiName,
      am: String(site.foundingPrice),
      cu: "INR",
      tn: "Challan founding year",
    });
    return `upi://pay?${params.toString()}`;
  })();
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(pay)}`;

  function markPaid() {
    unlockFounding();
    setUnlocked(true);
  }

  function saveUpi(value: string) {
    setUpi(value);
    localStorage.setItem("challan.founderUpi", value);
  }

  const confirmText = `Paid ₹${site.foundingPrice} founding for Challan. UPI ${upi}. Unlock my year.`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stamp">
        First {site.foundingSeats} seats
      </p>
      <h1 className="mt-2 font-serif text-4xl text-carbon">
        ₹{site.foundingPrice.toLocaleString("en-IN")} for the year.
      </h1>
      <p className="mt-3 max-w-xl text-mute">
        Pay on UPI. No ads. No card fees. After you pay, tap “I paid” and WhatsApp the
        screenshot so the seat is recorded.
      </p>

      {!isUpiConfigured ? (
        <div className="mt-6 border border-stamp/40 bg-sheet p-4 text-sm">
          <p className="font-medium text-carbon">Put your UPI id here (this device only).</p>
          <p className="mt-1 text-mute">
            Zero budget setup: type the UPI you collect on. Customers will pay that id.
          </p>
          <input
            value={upi.includes("replace-me") ? "" : upi}
            onChange={(e) => saveUpi(e.target.value)}
            placeholder="yourname@oksbi"
            className="mt-3 w-full border border-rule bg-paper px-3 py-2 font-mono text-sm"
          />
        </div>
      ) : null}

      <div className="mt-8 grid gap-8 border border-rule bg-sheet p-6 sm:grid-cols-[220px_1fr]">
        <img src={qr} width={220} height={220} alt="UPI QR for Challan founding" />
        <div>
          <p className="font-mono text-sm text-carbon">{upi}</p>
          <p className="mt-1 text-3xl font-serif text-ink">
            ₹{site.foundingPrice.toLocaleString("en-IN")}
          </p>
          <p className="mt-2 text-sm text-mute">
            Open any UPI app. Scan, or tap pay on your phone.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={pay} className="bg-carbon px-4 py-2 text-sm text-white">
              Open UPI app
            </a>
            <button
              type="button"
              onClick={markPaid}
              className="border border-carbon px-4 py-2 text-sm text-carbon"
            >
              I paid
            </button>
            {isWhatsappConfigured ? (
              <a
                href={whatsappUrl(confirmText)}
                className="text-sm text-stamp underline"
                target="_blank"
                rel="noreferrer"
              >
                Send screenshot on WhatsApp
              </a>
            ) : null}
          </div>
          {unlocked ? (
            <p className="mt-4 font-mono text-sm text-paid">
              Unlocked on this browser.{" "}
              <Link href="/make" className="underline">
                Make invoices
              </Link>
            </p>
          ) : null}
        </div>
      </div>

      <ol className="mt-10 space-y-2 text-sm text-mute">
        <li>1. Pay ₹{site.foundingPrice.toLocaleString("en-IN")} on UPI.</li>
        <li>2. Tap I paid — this browser unlocks immediately.</li>
        <li>3. WhatsApp the payment screenshot so your seat is counted.</li>
        <li>4. Walk into the next shop with the same QR.</li>
      </ol>
    </div>
  );
}
