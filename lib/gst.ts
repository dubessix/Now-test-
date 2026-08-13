import type { Invoice, LineItem, Money } from "./types";

export function lineAmount(item: LineItem) {
  return round2(item.qty * item.rate);
}

export function totals(invoice: Pick<Invoice, "items" | "taxRate" | "taxSplit">): Money {
  const taxable = round2(invoice.items.reduce((sum, item) => sum + lineAmount(item), 0));
  const tax = round2((taxable * invoice.taxRate) / 100);
  if (invoice.taxSplit === "igst") {
    return { taxable, cgst: 0, sgst: 0, igst: tax, total: round2(taxable + tax) };
  }
  const half = round2(tax / 2);
  return {
    taxable,
    cgst: half,
    sgst: round2(tax - half),
    igst: 0,
    total: round2(taxable + tax),
  };
}

export function inr(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}

export function round2(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function amountInWords(value: number) {
  const rupees = Math.floor(value);
  const paise = Math.round((value - rupees) * 100);
  const words = `${toWords(rupees)} rupees`;
  if (paise) return `${words} and ${toWords(paise)} paise only`;
  return `${words} only`;
}

const ones = [
  "",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];
const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function twoDigit(n: number) {
  if (n < 20) return ones[n];
  return `${tens[Math.floor(n / 10)]}${n % 10 ? ` ${ones[n % 10]}` : ""}`.trim();
}

function toWords(n: number): string {
  if (n === 0) return "zero";
  const crore = Math.floor(n / 1_00_00_000);
  const lakh = Math.floor((n % 1_00_00_000) / 1_00_000);
  const thousand = Math.floor((n % 1_00_000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;
  const parts: string[] = [];
  if (crore) parts.push(`${toWords(crore)} crore`);
  if (lakh) parts.push(`${twoDigit(lakh)} lakh`);
  if (thousand) parts.push(`${twoDigit(thousand)} thousand`);
  if (hundred) parts.push(`${ones[hundred]} hundred`);
  if (rest) parts.push(twoDigit(rest));
  return parts.join(" ");
}

export const GST_RATES = [0, 5, 12, 18, 28];

export const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
