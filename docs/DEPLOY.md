# Deploy guide: Zee's Kitchen

## 1. Supabase
1. Create a project at supabase.com. In **SQL Editor**, run these files in order, once each: `supabase/schema.sql`, `batch3.sql`, `batch4.sql`, `batch5.sql`.
2. **Project Settings → API**: copy the Project URL, the `anon` key and the `service_role` key. The service key is secret and only goes in server env vars.

## 2. Payments (Korapay by default)
1. Create a Kora account at korapay.com and open **Settings → API Configuration**. Copy the **test** secret key first (`sk_test_…`).
2. Set `PAYMENT_PROVIDER=korapay` and `KORAPAY_SECRET_KEY` to that key. When Zee's is verified for live payments, switch to the live secret key.
3. In the same settings page, set the webhook URL to `https://YOUR-DOMAIN/api/korapay/webhook`.
4. Paystack still works: set `PAYMENT_PROVIDER=paystack` and `PAYSTACK_SECRET_KEY`, with webhook `https://YOUR-DOMAIN/api/paystack/webhook`.

## 3. Push to GitHub, then Vercel
1. `git add .`, `git commit -m "Zee's Kitchen"`, `git push`.
2. At vercel.com choose **Add New → Project**, import the repo, keep the Next.js defaults.
3. Add these **Environment Variables** (Production and Preview):

| Name | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | your live URL, e.g. `https://zeeskitchen.ng` (no trailing slash) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |
| `PAYMENT_PROVIDER` | `korapay` (or `paystack`) |
| `KORAPAY_SECRET_KEY` | Kora secret key (test first, then live) |
| `ADMIN_PASSWORD` | a strong password, at least 8 characters, for the kitchen login |
| `ADMIN_SESSION_SECRET` | a random string of 32+ characters |

4. Deploy. Add the custom domain under **Settings → Domains**, then redeploy once so `NEXT_PUBLIC_SITE_URL` is correct.

## 4. Before going live (checklist)
- [ ] Replace placeholder dish prices (or edit them at `/admin` → Menu & prices). Option and extra prices live in `src/lib/menu-data.ts`.
- [ ] Put dish photos in `public/menu/` and set `image` in `menu-data.ts`.
- [ ] Confirm phone numbers in `src/lib/site.ts` and the real delivery fees in `src/lib/zones.ts`.
- [ ] Place a test order end to end with the Kora test cards: pay, see the code, update it at `/admin`, watch `/track` change.
- [ ] Check the Kora dashboard shows the webhook delivered successfully.
- [ ] Switch to the live Kora key, then make one small real payment and refund it.
- [ ] Open the site on a phone and tap "Add to Home screen" to check the app icon.

## 5. Daily use
- Kitchen opens `https://YOUR-DOMAIN/admin` on a phone or tablet and keeps it open. New paid orders appear within 10 seconds with a beep (tap the page once after loading so the browser allows sound).
- Tap **Mark: …** to move an order along. For delivery, type the rider's name and phone, then mark **Out for delivery**. The customer's tracker updates by itself.
- Out of an ingredient? Open **Menu & prices** and tick **Sold out**. Customers can't order it until you untick it.
- Cancelling an order does **not** refund it. Refund in the Kora dashboard.
