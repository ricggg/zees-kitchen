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
| 3 | Checkout: pickup/delivery, Asaba zones + fees, Paystack, order API, code generation, confirmation page | Next |
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
