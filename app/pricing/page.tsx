import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Pricing",
  description: `Challan founding year ₹${site.foundingPrice}. Public price ₹${site.yearlyPublic}/year or ₹${site.monthlyPrice}/month.`,
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="font-serif text-4xl text-carbon">Pay once. Bill every day.</h1>
      <p className="mt-3 max-w-xl text-mute">
        First invoice is free. Founding is a one-time UPI payment — no card, no
        international fee, no ad spend.
      </p>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Card
          kicker="Try"
          title="Free"
          price="₹0"
          note="1 invoice on this device"
          cta="Make an invoice"
          href="/make"
        />
        <Card
          kicker="Start earning"
          title="Founding year"
          price={`₹${site.foundingPrice.toLocaleString("en-IN")}`}
          note={`First ${site.foundingSeats} seats · UPI`}
          cta="Pay on UPI"
          href="/founding"
          featured
        />
        <Card
          kicker="Later"
          title="Public"
          price={`₹${site.monthlyPrice}`}
          note={`₹${site.yearlyPublic.toLocaleString("en-IN")} / year after founding closes`}
          cta="Join founding instead"
          href="/founding"
        />
      </div>
    </div>
  );
}

function Card({
  kicker,
  title,
  price,
  note,
  cta,
  href,
  featured = false,
}: {
  kicker: string;
  title: string;
  price: string;
  note: string;
  cta: string;
  href: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`flex flex-col border p-6 ${
        featured ? "border-stamp bg-sheet" : "border-rule bg-sheet"
      }`}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stamp">{kicker}</p>
      <h2 className="mt-2 font-serif text-2xl text-carbon">{title}</h2>
      <p className="mt-4 font-serif text-4xl">{price}</p>
      <p className="mt-2 text-sm text-mute">{note}</p>
      <Link
        href={href}
        className={`mt-6 inline-block px-4 py-2 text-center text-sm ${
          featured ? "bg-stamp text-white" : "border border-carbon text-carbon"
        }`}
      >
        {cta}
      </Link>
    </article>
  );
}
