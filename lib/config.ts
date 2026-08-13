function publicUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Challan",
  tagline: "Paste the WhatsApp quote. Get a GST invoice.",
  url: publicUrl(),
  foundingPrice: Number(process.env.NEXT_PUBLIC_FOUNDING_PRICE ?? 1999),
  foundingSeats: 50,
  monthlyPrice: 499,
  yearlyPublic: 6999,
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "replace-me@upi",
  upiName: process.env.NEXT_PUBLIC_UPI_NAME ?? "Challan",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "91XXXXXXXXXX").replace(
    /\D/g,
    "",
  ),
};

export function upiPayUrl(amount = site.foundingPrice, note = "Challan founding") {
  const params = new URLSearchParams({
    pa: site.upiId,
    pn: site.upiName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}

export function whatsappUrl(text: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const isUpiConfigured = !site.upiId.includes("replace-me");
export const isWhatsappConfigured = !site.whatsapp.includes("X");
