import { amountInWords, inr, lineAmount, totals } from "@/lib/gst";
import type { Invoice } from "@/lib/types";

export function InvoicePad({ invoice }: { invoice: Invoice }) {
  const money = totals(invoice);
  const items = invoice.items.filter((item) => item.name.trim() || item.rate);
  const rows = items.length ? items : invoice.items.slice(0, 1);

  return (
    <article className="print-sheet relative overflow-hidden border border-rule bg-sheet text-ink shadow-[4px_6px_0_rgba(11,28,44,0.08)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-carbon" />
      <div className="border-b border-dashed border-rule px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-stamp">
              Tax invoice
            </p>
            <h2 className="mt-1 font-serif text-2xl font-semibold text-carbon">
              {invoice.seller.name || "Your business"}
            </h2>
            <p className="mt-1 max-w-sm text-xs text-mute">
              {invoice.seller.address}
              {invoice.seller.phone ? ` · ${invoice.seller.phone}` : ""}
            </p>
          </div>
          <div className="text-right font-mono text-xs">
            <p>{invoice.number}</p>
            <p className="text-mute">{invoice.date}</p>
            {invoice.seller.gstin ? <p>GSTIN {invoice.seller.gstin}</p> : null}
          </div>
        </div>
      </div>

      <div className="grid gap-4 border-b border-dashed border-rule px-5 py-4 text-sm sm:grid-cols-2 sm:px-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">Bill to</p>
          <p className="mt-1 font-medium">{invoice.buyer.name || "Customer name"}</p>
          <p className="text-xs text-mute">
            {invoice.buyer.address || "Address"}
            {invoice.buyer.phone ? ` · ${invoice.buyer.phone}` : ""}
          </p>
          {invoice.buyer.gstin ? (
            <p className="font-mono text-xs">GSTIN {invoice.buyer.gstin}</p>
          ) : null}
        </div>
        <div className="sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
            Place of supply
          </p>
          <p className="mt-1">{invoice.placeOfSupply}</p>
          <p className="text-xs text-mute">
            {invoice.taxSplit === "igst" ? "IGST" : "CGST + SGST"} @ {invoice.taxRate}%
          </p>
        </div>
      </div>

      <table className="w-full text-left text-sm">
        <thead className="bg-paper font-mono text-[10px] uppercase tracking-[0.16em] text-mute">
          <tr>
            <th className="px-5 py-2 font-medium sm:px-6">#</th>
            <th className="py-2 font-medium">Particulars</th>
            <th className="hidden py-2 font-medium sm:table-cell">HSN</th>
            <th className="py-2 font-medium">Qty</th>
            <th className="py-2 font-medium">Rate</th>
            <th className="px-5 py-2 text-right font-medium sm:px-6">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item, index) => (
            <tr key={item.id} className="border-t border-rule/70">
              <td className="px-5 py-2 font-mono text-xs text-mute sm:px-6">{index + 1}</td>
              <td className="py-2">{item.name || "—"}</td>
              <td className="hidden py-2 font-mono text-xs sm:table-cell">{item.hsn || "—"}</td>
              <td className="py-2 font-mono text-xs">{item.qty}</td>
              <td className="py-2 font-mono text-xs">{inr(item.rate)}</td>
              <td className="px-5 py-2 text-right font-mono text-xs sm:px-6">
                {inr(lineAmount(item))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid gap-4 border-t border-rule px-5 py-4 sm:grid-cols-[1fr_220px] sm:px-6">
        <div className="text-xs text-mute">
          <p className="font-mono uppercase tracking-[0.16em]">Amount in words</p>
          <p className="mt-1 capitalize text-ink">{amountInWords(money.total)}</p>
          {invoice.seller.upi ? (
            <p className="mt-3 font-mono text-ink">UPI {invoice.seller.upi}</p>
          ) : null}
          {invoice.notes ? <p className="mt-3">{invoice.notes}</p> : null}
        </div>
        <dl className="space-y-1 font-mono text-xs">
          <Row label="Taxable" value={inr(money.taxable)} />
          {invoice.taxSplit === "igst" ? (
            <Row label={`IGST ${invoice.taxRate}%`} value={inr(money.igst)} />
          ) : (
            <>
              <Row label={`CGST ${invoice.taxRate / 2}%`} value={inr(money.cgst)} />
              <Row label={`SGST ${invoice.taxRate / 2}%`} value={inr(money.sgst)} />
            </>
          )}
          <div className="mt-2 flex justify-between border-t border-ink pt-2 text-sm font-semibold">
            <dt>Total</dt>
            <dd>{inr(money.total)}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-mute">
      <dt>{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
