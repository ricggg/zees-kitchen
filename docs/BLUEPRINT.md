# Zee's Kitchen — Blueprint

Online ordering site for Zee's Kitchen, Asaba. Local + continental dishes. Pickup (with code) or home delivery (with live progress bar).

## Stack (same conventions as AVSPro)
Next.js 14 App Router · TypeScript · Tailwind CSS 3 · Supabase (Postgres, RLS, Realtime) · Paystack (payments, NGN). Hosted on Vercel.
*Assumption: AVSPro conventions = this stack minus fal.ai. Swap anything that differs.*

## Brand (from the banner)
- Palette: Forest `#0E3B1F`, Leaf `#2F9A3F`, Lime `#7CC94B`, Cream `#FAF8F1`, Gold `#C8A24A` (sparingly).
- Type: Fraunces (heavy display, echoes the chunky "Zee's" wordmark) + DM Sans (body).
- Signature element: the banner's slanted green tagline ribbon ("Try Dey Chop!").
- Mobile-first, `dvh`, safe-area insets, 44px tap targets, reduced-motion respected.

## Customer flow
Browse menu → dish page (options + extras + qty) → cart → checkout (pickup | delivery) → pay → order code `ZK-####` → pickup: show code / delivery: tracking bar (Received → Preparing → Ready → Out for delivery → Delivered).

## Data model
`menu_categories`, `dishes` (options as JSON groups), `delivery_zones` (Asaba areas + fee + ETA), `orders` (code, fulfilment, status, totals, rider), `order_items`, `order_events`. See `supabase/schema.sql`.

## Batches
| # | Scope | Status |
|---|-------|--------|
| 1 | Blueprint, scaffold, design system, schema, seed menu, header/footer, homepage | **Done** |
| 2 | Menu page (category filter, search), dish page with options/extras, cart (context + localStorage), cart drawer | **Done** |
| 3 | Checkout: pickup/delivery, Asaba zones + fees, Paystack, order API, code generation, confirmation page | **Done** |
| 4 | Tracking: progress bar, Supabase Realtime, track-by-code, pickup-code card, rider details | |
| 5 | Kitchen/admin dashboard (orders, status updates, assign rider, edit menu/prices), PWA, SEO, polish, deploy guide | |

## Setup
1. `cp .env.example .env.local`, fill Supabase keys. 2. Run `supabase/schema.sql`. 3. `npm i && npm run dev`.
4. Put dish photos in `public/menu/` and set `image` in `src/lib/menu-data.ts`.
5. Confirm phone numbers in `src/lib/site.ts` and replace placeholder prices.

## Batch 2 notes
- Cart: `src/lib/cart.tsx` (React context, persisted to localStorage key `zk-cart-v1`). Lines are keyed by dish + chosen options + note, so the same dish with different choices stays separate.
- Menu: `/menu` (search, category chips, local/continental filter, `?cat=` deep links). Dish page `/menu/[slug]` handles required/optional/multi options, qty, kitchen note, live price.
- Cart UI: slide-over drawer (opens on add, Esc/backdrop closes) + full `/cart` page.
- Prices are recalculated server-side from the menu in batch 3 — never trust cart totals.

## Batch 3 notes
- `POST /api/orders` validates, **rebuilds prices from `menu-data.ts` + `zones.ts`**, inserts order/items/event, creates a Paystack transaction and returns its URL. Order code `ZK-####` (retries on collision).
- Paystack redirects back to `/order/ZK-####`, which polls `GET /api/orders/[code]`; that route verifies with Paystack as a fallback. `POST /api/paystack/webhook` (HMAC-SHA512 checked) also marks orders paid. Set the webhook URL in the Paystack dashboard to `https://YOUR-DOMAIN/api/paystack/webhook`.
- Menu + zones still live in code, so `supabase/batch3.sql` changes `order_items.dish_id` to text and swaps `zone_id` for `zone_name`.
- Order lookups return no phone or address. Batch 4 adds tracking and tighter code lookups.

## Batch 4 notes
- `/track` (code + last 4 phone digits) and the tracker on `/order/[code]` call `GET /api/track`, which checks the code, paid status and phone, then returns status, event times and rider details (only while out for delivery). Phone and address are never returned.
- Updates arrive by polling every 8 seconds (paused when the tab is hidden, stopped when finished). Chosen over Supabase Realtime because Realtime would need a public read policy on `orders`, which would expose customer phones.
- `supabase/batch4.sql` adds a trigger that logs each status change to `order_events`. Until the batch 5 dashboard, change status with SQL (examples in the file).

## Batch 5 notes
- `/admin` (password login, signed httpOnly cookie, 12h): live orders board (polls every 10s, beeps on new orders), status buttons, rider assignment, cancel; **Menu & prices** edits base price and sold-out. All admin API routes check the cookie.
- Menu edits live in `menu_overrides` (`supabase/batch5.sql`) and are merged over `menu-data.ts` by `getMenu()`. The order API prices from the same merged menu; if a customer's cart is stale it replies 409 with the new prices and the cart updates.
- Option/extra prices, descriptions and new dishes are still edited in `src/lib/menu-data.ts`.
- PWA manifest and icons (installable), `robots.ts`, `sitemap.ts`, Restaurant JSON-LD, noindex on admin/checkout/track/order, security headers, 404 and error pages. No offline service worker.
- Deploy steps: `docs/DEPLOY.md`.

## Korapay
- `PAYMENT_PROVIDER=korapay` (default) uses Kora hosted checkout: `startPayment()` calls `/charges/initialize`, `confirmPayment()` calls `/charges/{reference}`. Webhook: `/api/korapay/webhook` (HMAC-SHA256 of the `data` object, then re-verified with Kora's API). Paystack remains available by switching the env var.
