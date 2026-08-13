import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Chrome } from "@/components/chrome";
import { plexMono, plexSans, plexSerif } from "@/lib/fonts";
import { site } from "@/lib/config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Challan — WhatsApp quote to GST invoice",
    template: "%s | Challan",
  },
  description:
    "Paste a WhatsApp quote and download a GST tax invoice. Free first bill. Founding year ₹1,999 on UPI.",
  keywords: [
    "GST invoice generator",
    "WhatsApp invoice India",
    "tax invoice PDF",
    "quotation to GST invoice",
    "GST billing for small business",
  ],
  authors: [{ name: "Challan", url: site.url }],
  creator: "Challan",
  category: "business",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: "Challan",
    title: "Challan — WhatsApp quote to GST invoice",
    description:
      "Paste the chat. Get a GST invoice. First one is free. Founding year ₹1,999.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Challan — WhatsApp quote to GST invoice",
    description: "Paste the chat. Get a GST invoice.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1E3A5F",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper font-sans text-ink">
        <Suspense>
          <Chrome>
            <main className="flex-1">{children}</main>
          </Chrome>
        </Suspense>
      </body>
    </html>
  );
}
