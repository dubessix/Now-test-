import type { Metadata } from "next";
import { Maker } from "@/components/maker";

export const metadata: Metadata = {
  title: "Make a GST invoice",
  description:
    "Paste a WhatsApp quote and generate a GST tax invoice. First invoice is free.",
  alternates: { canonical: "/make" },
  robots: { index: false, follow: true },
};

export default function MakePage() {
  return <Maker />;
}
