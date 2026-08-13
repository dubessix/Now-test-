# Challan

WhatsApp quote → GST tax invoice. Built to take the first rupee this week on **₹0 budget**.

## Zero-budget stack

- Next.js + Tailwind v4 (Vercel free)
- Parser + invoice pad run in the browser
- Pay on UPI (no Stripe, no Razorpay fee to start)
- Data stays in `localStorage`

## Run

```bash
cp .env.example .env.local
# put your UPI and WhatsApp number
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Vercel (free host)

Import this GitHub repo in Vercel. Framework: Next.js. Set:

| Env | Example |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_UPI_ID` | `yourname@oksbi` |
| `NEXT_PUBLIC_UPI_NAME` | `Challan` |
| `NEXT_PUBLIC_WHATSAPP` | `91XXXXXXXXXX` |
| `NEXT_PUBLIC_FOUNDING_PRICE` | `1999` |

SEO is on from the first deploy: `sitemap.xml`, `robots.txt`, canonical URLs, Open Graph image, JSON-LD (`SoftwareApplication` + `FAQPage` + `Organization`), and `manifest.webmanifest`. After go-live, paste the production URL into Google Search Console.

## Earn this week

1. Put your UPI on `/founding` (or in `.env.local`).
2. Make one sample invoice on `/make`.
3. Follow `SALES.md` — 30 WhatsApp / walk-ins a day.
4. First 50 founding seats at ₹1,999 = up to ₹99,950 before you pay for anything.

## Pages

| Path | Job |
| --- | --- |
| `/` | Landing + sample GST pad |
| `/make` | Paste chat → invoice → print/PDF / WhatsApp |
| `/founding` | UPI QR + unlock |
| `/pricing` | Free / founding / public |

Not a GST return filer. Your CA still files.
