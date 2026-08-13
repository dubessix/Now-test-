import type { Invoice, Seller } from "./types";

const SELLER_KEY = "challan.seller";
const COUNT_KEY = "challan.made";
const UNLOCK_KEY = "challan.unlocked";

export function newId() {
  return Math.random().toString(36).slice(2, 10);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function nextInvoiceNumber() {
  const day = new Date();
  const y = day.getFullYear();
  const m = String(day.getMonth() + 1).padStart(2, "0");
  const seq = String(madeCount() + 1).padStart(3, "0");
  return `CHL/${y}${m}/${seq}`;
}

export function defaultSeller(): Seller {
  return {
    name: "Your business name",
    gstin: "",
    phone: "",
    email: "",
    address: "Kolkata, West Bengal",
    state: "West Bengal",
    upi: "",
  };
}

export function emptyInvoice(): Invoice {
  return {
    number: nextInvoiceNumber(),
    date: todayISO(),
    placeOfSupply: "West Bengal",
    taxRate: 18,
    taxSplit: "cgst-sgst",
    notes: "Thank you for your business.",
    seller: loadSeller(),
    buyer: {
      name: "",
      gstin: "",
      phone: "",
      address: "",
      state: "West Bengal",
    },
    items: [{ id: newId(), name: "", hsn: "", qty: 1, rate: 0 }],
  };
}

export function loadSeller(): Seller {
  if (typeof window === "undefined") return defaultSeller();
  try {
    const raw = localStorage.getItem(SELLER_KEY);
    return raw ? { ...defaultSeller(), ...JSON.parse(raw) } : defaultSeller();
  } catch {
    return defaultSeller();
  }
}

export function saveSeller(seller: Seller) {
  localStorage.setItem(SELLER_KEY, JSON.stringify(seller));
}

export function madeCount() {
  if (typeof window === "undefined") return 0;
  return Number(localStorage.getItem(COUNT_KEY) || 0);
}

export function bumpMade() {
  const next = madeCount() + 1;
  localStorage.setItem(COUNT_KEY, String(next));
  return next;
}

export function isUnlocked() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(UNLOCK_KEY) === "yes";
}

export function unlockFounding() {
  localStorage.setItem(UNLOCK_KEY, "yes");
}

export const FREE_INVOICES = 1;
