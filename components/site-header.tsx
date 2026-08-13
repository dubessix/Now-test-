import Link from "next/link";

export function SiteHeader({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`no-print sticky top-0 z-30 border-b border-rule/70 ${
        solid ? "bg-sheet" : "bg-paper/90 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-[0.18em] text-carbon">
            CHALLAN
          </span>
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-mute sm:inline">
            GST bill book
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-carbon">
          <Link href="/pricing" className="hover:text-stamp">
            Pricing
          </Link>
          <Link
            href="/make"
            className="bg-stamp px-3 py-1.5 text-sm font-medium text-white hover:bg-stamp/90"
          >
            Make an invoice
          </Link>
        </nav>
      </div>
    </header>
  );
}
