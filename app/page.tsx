import Link from "next/link";
import { InvoicePad } from "@/components/invoice-pad";
import { JsonLd } from "@/components/json-ld";
import { site } from "@/lib/config";
import type { Invoice } from "@/lib/types";

const demo: Invoice = {
  number: "CHL/202608/001",
  date: "2026-08-13",
  placeOfSupply: "West Bengal",
  taxRate: 18,
  taxSplit: "cgst-sgst",
  notes: "Pay on UPI. Goods once sold are not returnable.",
  seller: {
    name: "Banerjee Interiors",
    gstin: "19AABCU9603R1ZX",
    phone: "98300 11223",
    email: "",
    address: "Salt Lake, Sector V, Kolkata 700091",
    state: "West Bengal",
    upi: "banerjee@upi",
  },
  buyer: {
    name: "Sharma Electricals",
    gstin: "19AADCS1234F1Z5",
    phone: "98765 43210",
    address: "New Town, Kolkata",
    state: "West Bengal",
  },
  items: [
    { id: "1", name: "Ceiling fan (1200mm)", hsn: "8414", qty: 2, rate: 1850 },
    { id: "2", name: "Concealed wiring labour", hsn: "9954", qty: 1, rate: 2500 },
  ],
};

const faqs = [
  {
    q: "Do I need the WhatsApp Business API?",
    a: "No. Paste the chat. Challan never logs into your WhatsApp. That is why you can start today on zero budget.",
  },
  {
    q: "Is the invoice GST-ready?",
    a: "Yes — tax invoice layout with GSTIN, HSN, place of supply, CGST/SGST or IGST, and amount in words. Your CA still files the return.",
  },
  {
    q: "What does founding cost?",
    a: `₹${site.foundingPrice.toLocaleString("en-IN")} once for the first year, first ${site.foundingSeats} seats. After that ₹${site.yearlyPublic.toLocaleString("en-IN")}/year or ₹${site.monthlyPrice}/month. First invoice is free.`,
  },
  {
    q: "Where is my data stored?",
    a: "On this device, in the browser. No account, no server bill, no subscription to start.",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name: "Challan",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: String(site.foundingPrice),
                priceCurrency: "INR",
                url: `${site.url}/founding`,
              },
              description: site.tagline,
              url: site.url,
            },
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
            {
              "@type": "Organization",
              name: "Challan",
              url: site.url,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kolkata",
                addressRegion: "West Bengal",
                addressCountry: "IN",
              },
            },
          ],
        }}
      />

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_1.05fr] lg:py-16">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-stamp">
            Kolkata · GST bill book
          </p>
          <h1 className="mt-3 max-w-[14ch] font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-carbon sm:text-6xl">
            Paste the chat. Stamp the invoice.
          </h1>
          <p className="mt-5 max-w-md text-lg text-mute">
            Indian businesses already quote on WhatsApp, then retype it into Excel.
            Challan reads the message and returns a GST tax invoice you can print or
            forward.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/make"
              className="bg-stamp px-5 py-3 text-sm font-medium text-white hover:bg-stamp/90"
            >
              Make a free invoice
            </Link>
            <Link
              href="/founding"
              className="border border-carbon px-5 py-3 text-sm text-carbon hover:bg-sheet"
            >
              Founding year ₹{site.foundingPrice.toLocaleString("en-IN")}
            </Link>
          </div>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">
            Zero budget to start · works offline in the browser · no API approval
          </p>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute -right-2 -top-3 rotate-6 border-2 border-stamp px-3 py-1 font-serif text-sm font-semibold uppercase tracking-[0.2em] text-stamp">
            Sample
          </div>
          <InvoicePad invoice={demo} />
        </div>
      </section>

      <section className="border-y border-rule bg-sheet">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
          {[
            {
              k: "Paste",
              t: "The WhatsApp quote, as it is. Names, qty, rupees.",
            },
            {
              k: "Check",
              t: "GSTIN, HSN, CGST/SGST or IGST. Fix a line if the parser missed it.",
            },
            {
              k: "Send",
              t: "Print PDF or share the bill on WhatsApp. Collect on your UPI.",
            },
          ].map((step) => (
            <div key={step.k}>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">
                {step.k}
              </p>
              <p className="mt-2 text-carbon">{step.t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-serif text-3xl text-carbon">Built for people who bill from the phone.</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            "Interior contractors quoting on WhatsApp at 10 pm",
            "Clinics and tuition centres that still use a paper bill book",
            "Electricians, AC, and plumbing shops in Kolkata and beyond",
            "Freelancers who need a GST invoice, not another Tally course",
          ].map((line) => (
            <p key={line} className="border border-rule bg-sheet px-4 py-4 text-sm text-carbon">
              {line}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="font-serif text-3xl text-carbon">Questions shops actually ask</h2>
        <dl className="mt-8 divide-y divide-rule border border-rule bg-sheet">
          {faqs.map((item) => (
            <div key={item.q} className="px-5 py-4">
              <dt className="font-medium text-carbon">{item.q}</dt>
              <dd className="mt-1 text-sm text-mute">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </>
  );
}
