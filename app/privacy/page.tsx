import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Challan stores invoices on your device. We do not run an account database.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 text-sm leading-7 text-carbon">
      <h1 className="font-serif text-4xl">Privacy</h1>
      <p className="mt-4 text-mute">Last updated 13 August 2026. Kolkata, India.</p>
      <p className="mt-6">
        Challan is a browser tool. Your business name, GSTIN, chat paste, and invoices stay in
        this device’s local storage. We do not create an account for you and we do not upload
        the chat to a server for the free and founding versions.
      </p>
      <p className="mt-4">
        If you WhatsApp a payment screenshot to confirm founding, that message is between you
        and the operator’s WhatsApp. UPI payments are processed by your bank / UPI app, not by
        Challan.
      </p>
      <p className="mt-4">
        The founding page may load a QR image from a public QR API so you can scan the UPI
        link. No invoice data is sent there — only the payment string.
      </p>
    </article>
  );
}
