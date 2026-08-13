import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="no-print border-t border-rule mt-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
        <p>Challan · Kolkata · GST invoice from a WhatsApp quote.</p>
        <div className="flex gap-4">
          <Link href="/pricing" className="hover:text-ink">
            Pricing
          </Link>
          <Link href="/privacy" className="hover:text-ink">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-ink">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
