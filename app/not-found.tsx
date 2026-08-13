import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp">404</p>
      <h1 className="mt-2 font-serif text-4xl text-carbon">This page is not on the bill.</h1>
      <Link href="/" className="mt-6 inline-block text-sm text-carbon underline">
        Back to Challan
      </Link>
    </div>
  );
}
