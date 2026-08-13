import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Challan GST invoices.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 text-sm leading-7 text-carbon">
      <h1 className="font-serif text-4xl">Terms</h1>
      <p className="mt-4 text-mute">Last updated 13 August 2026.</p>
      <p className="mt-6">
        Challan generates a tax-invoice layout from the text you provide. You are responsible
        for the accuracy of GSTIN, HSN, tax split, and amounts. Challan is not a CA, not a GST
        return filer, and not a substitute for Tally or your accountant.
      </p>
      <p className="mt-4">
        Founding is a one-time UPI payment for use of this software for one year on the
        devices you unlock. Seats are limited. Refunds are handled case by case on WhatsApp
        if the tool cannot produce a PDF on a supported modern browser.
      </p>
      <p className="mt-4">
        Do not use Challan to create false invoices. Misuse is your liability.
      </p>
    </article>
  );
}
