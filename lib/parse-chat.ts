import type { Invoice, LineItem } from "./types";
import { emptyInvoice, newId } from "./storage";

const SKIP =
  /^(ok|okay|haan|han|ji|thanks|thank you|done|yes|no|hmm|bro|bhai|sir|madam|pls|please|send|bhejo|bill|invoice|quote|quotation)$/i;

export function parseChat(raw: string, base: Invoice = emptyInvoice()): Invoice {
  const text = raw.replace(/\r/g, "").trim();
  if (!text) return base;

  const lines = text
    .split("\n")
    .map((line) => stripWhatsappMeta(line).trim())
    .filter(Boolean);

  const invoice: Invoice = {
    ...base,
    buyer: { ...base.buyer },
    seller: { ...base.seller },
    items: [],
  };

  const joined = lines.join("\n");
  const gstin = joined.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b/i);
  if (gstin) invoice.buyer.gstin = gstin[0].toUpperCase();

  const phone = joined.match(/(?:\+91[\s-]?)?[6-9]\d{9}\b/);
  if (phone) invoice.buyer.phone = phone[0].replace(/[^\d+]/g, "");

  const rateMatch = joined.match(/(?:gst|tax)\s*(?:@|at|:)?\s*(\d{1,2})\s*%?/i);
  if (rateMatch) invoice.taxRate = Number(rateMatch[1]);

  if (/\bigst\b/i.test(joined)) invoice.taxSplit = "igst";

  const party = extractParty(lines);
  if (party) invoice.buyer.name = party;

  for (const line of lines) {
    const item = parseItem(line);
    if (item) invoice.items.push(item);
  }

  if (invoice.items.length === 0) {
    const loose = parseLooseAmounts(lines);
    invoice.items.push(...loose);
  }

  if (invoice.items.length === 0) {
    invoice.items.push({
      id: newId(),
      name: "Service as discussed",
      hsn: "",
      qty: 1,
      rate: 0,
    });
  }

  return invoice;
}

function stripWhatsappMeta(line: string) {
  return line
    .replace(/^\[?\d{1,2}[/-]\d{1,2}[/-]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*[-–]?\s*/, "")
    .replace(/^[^:]{1,40}:\s+/, "");
}

function extractParty(lines: string[]) {
  for (const line of lines) {
    const labeled = line.match(
      /(?:invoice|bill|quote|quotation|for|to|party|client|customer)\s*(?:for|to|:|-)?\s+(.+)/i,
    );
    if (labeled) {
      const name = cleanName(labeled[1]);
      if (name.length > 1) return name;
    }
  }
  const first = lines.find((line) => !parseItem(line) && !SKIP.test(line) && !/\d{5,}/.test(line));
  return first ? cleanName(first) : "";
}

function cleanName(value: string) {
  return value
    .replace(/[₹]|rs\.?|inr/gi, "")
    .replace(/\b(?:gst|igst|cgst)\b.+$/i, "")
    .replace(/[|:]+/g, " ")
    .trim();
}

function parseItem(line: string): LineItem | null {
  if (SKIP.test(line) || /gstin|upi|%|invoice no/i.test(line)) return null;

  const xQty = line.match(
    /^(?:[-*•]\s*)?(.+?)\s*[x×]\s*(\d+(?:\.\d+)?)\s*(?:@|₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*$/i,
  );
  if (xQty) {
    return item(xQty[1], Number(xQty[2]), money(xQty[3]));
  }

  const qtyFirst = line.match(
    /^(?:[-*•]\s*)?(\d+(?:\.\d+)?)\s*[x×]?\s+(.+?)\s+(?:@|₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*$/i,
  );
  if (qtyFirst && !/^\d{10}$/.test(qtyFirst[1])) {
    return item(qtyFirst[2], Number(qtyFirst[1]), money(qtyFirst[3]));
  }

  const namePrice = line.match(
    /^(?:[-*•]\s*)?(.+?)\s*[-–:]\s*(?:₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*$/i,
  );
  if (namePrice && namePrice[1].length > 1) {
    return item(namePrice[1], 1, money(namePrice[2]));
  }

  const trailing = line.match(/^(?:[-*•]\s*)?([a-zA-Z].+?)\s+(₹|rs\.?|inr)?\s*(\d[\d,]*(?:\.\d+)?)\s*$/i);
  if (trailing && trailing[1].trim().split(/\s+/).length <= 8) {
    return item(trailing[1], 1, money(trailing[3]));
  }

  return null;
}

function parseLooseAmounts(lines: string[]): LineItem[] {
  return lines.flatMap((line) => {
    const m = line.match(/(₹|rs\.?)\s*(\d[\d,]*(?:\.\d+)?)/i);
    if (!m) return [];
    const name = line.replace(m[0], "").replace(/[-–:]/g, " ").trim() || "Item";
    return [item(name, 1, money(m[2]))];
  });
}

function money(value: string) {
  return Number(value.replace(/,/g, ""));
}

function item(name: string, qty: number, rate: number): LineItem {
  return {
    id: newId(),
    name: name.replace(/\s+/g, " ").trim(),
    hsn: "",
    qty: qty || 1,
    rate: Number.isFinite(rate) ? rate : 0,
  };
}
