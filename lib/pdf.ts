import { amountInWords, inr, lineAmount, totals } from "./gst";
import type { Invoice } from "./types";

export function invoiceText(invoice: Invoice) {
  const money = totals(invoice);
  const lines = [
    `TAX INVOICE  ${invoice.number}`,
    invoice.seller.name,
    invoice.seller.gstin ? `GSTIN ${invoice.seller.gstin}` : "",
    invoice.seller.address,
    invoice.seller.phone ? `Ph ${invoice.seller.phone}` : "",
    "",
    `Date: ${invoice.date}`,
    `Bill to: ${invoice.buyer.name || "Customer"}`,
    invoice.buyer.gstin ? `GSTIN ${invoice.buyer.gstin}` : "",
    invoice.buyer.phone ? `Ph ${invoice.buyer.phone}` : "",
    `Place of supply: ${invoice.placeOfSupply}`,
    "",
    ...invoice.items
      .filter((item) => item.name.trim())
      .map(
        (item, i) =>
          `${i + 1}. ${item.name}  ${item.qty} × ${inr(item.rate)} = ${inr(lineAmount(item))}`,
      ),
    "",
    `Taxable: ${inr(money.taxable)}`,
    invoice.taxSplit === "igst"
      ? `IGST ${invoice.taxRate}%: ${inr(money.igst)}`
      : `CGST ${invoice.taxRate / 2}%: ${inr(money.cgst)}  SGST ${invoice.taxRate / 2}%: ${inr(money.sgst)}`,
    `TOTAL: ${inr(money.total)}`,
    amountInWords(money.total),
    invoice.seller.upi ? `Pay UPI: ${invoice.seller.upi}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

export function printInvoice() {
  window.print();
}
