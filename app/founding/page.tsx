import type { Metadata } from "next";
import { FoundingDesk } from "@/components/founding-desk";
import { site } from "@/lib/config";

export const metadata: Metadata = {
  title: "Founding year",
  description: `Lock Challan for ₹${site.foundingPrice} for the first year. First ${site.foundingSeats} seats. Pay on UPI. Zero ad budget.`,
  alternates: { canonical: "/founding" },
};

export default function FoundingPage() {
  return <FoundingDesk />;
}
