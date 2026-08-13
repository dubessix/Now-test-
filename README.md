# Challan

WhatsApp quote → GST tax invoice. First rupee this week on **₹0 budget**. No Razorpay.

## How money + admin works

```
Customer                    Your UPI app                 /admin desk
   |                              |                           |
   |-- pays ₹1,999 -------------->|                           |
   |-- submits name/phone/UTR -------------------------------->| Waiting
   |                              |-- you see the credit      |
   |                              |                           | type action password
   |                              |                           | Approve
   |<-- Check my payment -------------------------------------| paid + unlock code
   |-- /make unlocked
```

1. Customer pays **your UPI** (GPay / PhonePe). No Razorpay, no card fee.
2. They send name, email, phone, UTR on `/founding`.
3. You open `/admin`, see the user, confirm the rupees in your UPI app.
4. Type `ADMIN_ACTION_PASSWORD`, click **Approve**.
5. They tap **Check my payment**. The invoice pad unlocks.

Login uses `ADMIN_EMAIL` + `ADMIN_PASSWORD` from env.  
Approve / reject uses `ADMIN_ACTION_PASSWORD` from env.  
Session is an **httpOnly, SameSite=strict** cookie signed with `ADMIN_SECRET`.  
`/admin` is noindex and not in the sitemap.

## Run

```bash
cp .env.example .env.local
# set UPI + admin email/password/secret
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and [http://localhost:3000/admin](http://localhost:3000/admin).

## Vercel env

| Env | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical + sitemap URL |
| `NEXT_PUBLIC_UPI_ID` | Your collect UPI |
| `NEXT_PUBLIC_UPI_NAME` | Name on the UPI QR |
| `NEXT_PUBLIC_WHATSAPP` | Optional WhatsApp |
| `NEXT_PUBLIC_FOUNDING_PRICE` | `1999` |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD` | Admin login password |
| `ADMIN_SECRET` | 32+ random chars, signs the cookie |
| `ADMIN_ACTION_PASSWORD` | Required to approve/reject |
| `STORE_GITHUB_REPO` | Optional: `dubessix/Now-test-` so claims persist on Vercel |
| `STORE_GITHUB_TOKEN` | Optional: GitHub token with `contents:write` |

Locally, claims save to `data/challan.json` (gitignored). On Vercel the disk is empty each deploy — set the GitHub store env so the desk remembers users.

## Pages

| Path | Job |
| --- | --- |
| `/` | Landing |
| `/make` | Invoice pad |
| `/founding` | UPI + claim form |
| `/pricing` | Prices |
| `/admin` | Watch users, approve after payment |

Not a GST return filer. Your CA still files.
