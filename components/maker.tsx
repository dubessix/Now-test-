"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { InvoicePad } from "@/components/invoice-pad";
import { GST_RATES, INDIAN_STATES } from "@/lib/gst";
import { parseChat } from "@/lib/parse-chat";
import { invoiceText, printInvoice } from "@/lib/pdf";
import {
  FREE_INVOICES,
  bumpMade,
  emptyInvoice,
  isUnlocked,
  loadSeller,
  madeCount,
  newId,
  saveSeller,
} from "@/lib/storage";
import type { Invoice, LineItem, Seller } from "@/lib/types";

const SAMPLE = `Invoice for Sharma Electricals, Salt Lake
2 ceiling fan x 1850
wiring labour 2500
GST 18
9876543210`;

export function Maker() {
  const [invoice, setInvoice] = useState<Invoice>(() => emptyInvoice());
  const [chat, setChat] = useState(SAMPLE);
  const [ready, setReady] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [used, setUsed] = useState(0);
  const [gate, setGate] = useState(false);

  useEffect(() => {
    const next = emptyInvoice();
    next.seller = loadSeller();
    setInvoice(parseChat(SAMPLE, next));
    setUnlocked(isUnlocked());
    setUsed(madeCount());
    setReady(true);
  }, []);

  const blocked = ready && !unlocked && used >= FREE_INVOICES;

  function applyChat() {
    setInvoice((current) => parseChat(chat, current));
  }

  function setSeller<K extends keyof Seller>(key: K, value: Seller[K]) {
    setInvoice((current) => {
      const seller = { ...current.seller, [key]: value };
      saveSeller(seller);
      return { ...current, seller };
    });
  }

  function setItem(id: string, patch: Partial<LineItem>) {
    setInvoice((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));
  }

  function addItem() {
    setInvoice((current) => ({
      ...current,
      items: [...current.items, { id: newId(), name: "", hsn: "", qty: 1, rate: 0 }],
    }));
  }

  function removeItem(id: string) {
    setInvoice((current) => ({
      ...current,
      items: current.items.filter((item) => item.id !== id),
    }));
  }

  function shareWhatsapp() {
    const text = invoiceText(invoice);
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  }

  function download() {
    if (blocked) {
      setGate(true);
      return;
    }
    bumpMade();
    setUsed(madeCount());
    printInvoice();
    if (!isUnlocked() && madeCount() >= FREE_INVOICES) setGate(true);
  }

  const field = useMemo(
    () =>
      "w-full border border-rule bg-sheet px-2.5 py-2 text-sm text-ink placeholder:text-mute/70 focus:border-carbon focus:outline-none",
    [],
  );

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <div className="no-print space-y-5">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-stamp">
            Bill book
          </p>
          <h1 className="mt-1 font-serif text-3xl text-carbon">Make the invoice</h1>
          <p className="mt-2 text-sm text-mute">
            Paste the WhatsApp quote. Fix anything the parser missed. First invoice is free.
          </p>
        </div>

        <label className="block">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Paste chat
          </span>
          <textarea
            value={chat}
            onChange={(e) => setChat(e.target.value)}
            rows={7}
            className={`${field} mt-1 font-mono text-[13px]`}
          />
        </label>
        <button
          type="button"
          onClick={applyChat}
          className="bg-carbon px-4 py-2 text-sm font-medium text-white hover:bg-carbon-mid"
        >
          Read the chat
        </button>

        <section className="space-y-3 border border-rule bg-sheet p-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Your letterhead
          </h2>
          <input
            className={field}
            value={invoice.seller.name}
            onChange={(e) => setSeller("name", e.target.value)}
            placeholder="Business name"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className={field}
              value={invoice.seller.gstin}
              onChange={(e) => setSeller("gstin", e.target.value.toUpperCase())}
              placeholder="Your GSTIN"
            />
            <input
              className={field}
              value={invoice.seller.phone}
              onChange={(e) => setSeller("phone", e.target.value)}
              placeholder="Your phone"
            />
          </div>
          <input
            className={field}
            value={invoice.seller.address}
            onChange={(e) => setSeller("address", e.target.value)}
            placeholder="Address"
          />
          <input
            className={field}
            value={invoice.seller.upi}
            onChange={(e) => setSeller("upi", e.target.value)}
            placeholder="Your UPI id (printed on invoice)"
          />
        </section>

        <section className="space-y-3 border border-rule bg-sheet p-4">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Customer
          </h2>
          <input
            className={field}
            value={invoice.buyer.name}
            onChange={(e) =>
              setInvoice((c) => ({ ...c, buyer: { ...c.buyer, name: e.target.value } }))
            }
            placeholder="Customer name"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <input
              className={field}
              value={invoice.buyer.gstin}
              onChange={(e) =>
                setInvoice((c) => ({
                  ...c,
                  buyer: { ...c.buyer, gstin: e.target.value.toUpperCase() },
                }))
              }
              placeholder="Customer GSTIN"
            />
            <input
              className={field}
              value={invoice.buyer.phone}
              onChange={(e) =>
                setInvoice((c) => ({ ...c, buyer: { ...c.buyer, phone: e.target.value } }))
              }
              placeholder="Customer phone"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select
              className={field}
              value={invoice.placeOfSupply}
              onChange={(e) => setInvoice((c) => ({ ...c, placeOfSupply: e.target.value }))}
            >
              {INDIAN_STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
            <select
              className={field}
              value={invoice.taxRate}
              onChange={(e) => setInvoice((c) => ({ ...c, taxRate: Number(e.target.value) }))}
            >
              {GST_RATES.map((rate) => (
                <option key={rate} value={rate}>
                  GST {rate}%
                </option>
              ))}
            </select>
            <select
              className={field}
              value={invoice.taxSplit}
              onChange={(e) =>
                setInvoice((c) => ({
                  ...c,
                  taxSplit: e.target.value as Invoice["taxSplit"],
                }))
              }
            >
              <option value="cgst-sgst">CGST + SGST</option>
              <option value="igst">IGST</option>
            </select>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-mute">
            Line items
          </h2>
          {invoice.items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-1">
              <input
                className={`${field} col-span-5`}
                value={item.name}
                onChange={(e) => setItem(item.id, { name: e.target.value })}
                placeholder="Particulars"
              />
              <input
                className={`${field} col-span-2`}
                value={item.hsn}
                onChange={(e) => setItem(item.id, { hsn: e.target.value })}
                placeholder="HSN"
              />
              <input
                className={`${field} col-span-2`}
                type="number"
                min={0}
                step="0.01"
                value={item.qty}
                onChange={(e) => setItem(item.id, { qty: Number(e.target.value) })}
              />
              <input
                className={`${field} col-span-2`}
                type="number"
                min={0}
                step="0.01"
                value={item.rate}
                onChange={(e) => setItem(item.id, { rate: Number(e.target.value) })}
              />
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="col-span-1 text-xs text-mute hover:text-stamp"
                aria-label="Remove line"
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" onClick={addItem} className="text-sm text-carbon underline">
            Add a line
          </button>
        </section>
      </div>

      <div className="space-y-4">
        <div className="no-print flex flex-wrap gap-2">
          <button
            type="button"
            onClick={download}
            className="bg-stamp px-4 py-2 text-sm font-medium text-white hover:bg-stamp/90"
          >
            Download / print PDF
          </button>
          <button
            type="button"
            onClick={shareWhatsapp}
            className="border border-carbon px-4 py-2 text-sm text-carbon hover:bg-paper"
          >
            Share on WhatsApp
          </button>
          <p className="self-center font-mono text-[11px] text-mute">
            {unlocked ? "Founding unlocked" : `${Math.max(FREE_INVOICES - used, 0)} free left`}
          </p>
        </div>
        <InvoicePad invoice={invoice} />
      </div>

      {gate ? (
        <div className="no-print fixed inset-0 z-40 grid place-items-center bg-ink/50 p-4">
          <div className="max-w-md border border-rule bg-sheet p-6 shadow-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
              First invoice used
            </p>
            <h2 className="mt-2 font-serif text-2xl text-carbon">
              Lock founding at ₹1,999 for the year.
            </h2>
            <p className="mt-2 text-sm text-mute">
              Pay on UPI. Zero monthly fee for the first 50. Public price later is ₹6,999/year.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/founding" className="bg-stamp px-4 py-2 text-sm text-white">
                Pay on UPI
              </Link>
              <button type="button" onClick={() => setGate(false)} className="text-sm text-mute">
                Keep editing
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
