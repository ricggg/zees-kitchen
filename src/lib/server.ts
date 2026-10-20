import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Dish } from './types';

export const admin = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  });

export interface PricedLine {
  dishId: string; name: string; qty: number; unit: number;
  options: string[]; note: string | null;
}
export interface IncomingLine { dishId: string; qty: number; choiceIds: string[]; note?: string }

/** Rebuilds every line from the server-side menu. Client prices are ignored. */
export function priceCart(input: IncomingLine[], menu: Dish[]): { lines: PricedLine[]; subtotal: number } | { error: string } {
  if (!Array.isArray(input) || input.length === 0 || input.length > 40) return { error: 'Your cart is empty.' };
  const lines: PricedLine[] = [];
  for (const raw of input) {
    const dish = menu.find((d) => d.id === raw.dishId);
    const qty = Math.floor(Number(raw.qty));
    if (!dish || !(qty >= 1 && qty <= 50)) return { error: 'An item in your cart is no longer available.' };
    const ids = Array.isArray(raw.choiceIds) ? raw.choiceIds : [];
    if (dish.soldOut) return { error: `${dish.name} is sold out today. Please remove it from your cart.` };
    let unit = dish.price;
    const labels: string[] = [];
    for (const g of dish.options ?? []) {
      const picked = g.choices.filter((c) => ids.includes(c.id));
      if (g.required && picked.length !== 1) return { error: `Please choose: ${g.label} (${dish.name}).` };
      if (g.type === 'single' && picked.length > 1) return { error: `Too many choices for ${g.label}.` };
      for (const c of picked) { unit += c.price; labels.push(c.label); }
    }
    const note = typeof raw.note === 'string' && raw.note.trim() ? raw.note.trim().slice(0, 200) : null;
    lines.push({ dishId: dish.id, name: dish.name, qty, unit, options: labels, note });
  }
  return { lines, subtotal: lines.reduce((n, l) => n + l.qty * l.unit, 0) };
}

export const newCode = () => 'ZK-' + String(Math.floor(1000 + Math.random() * 9000));

const PAYSTACK = 'https://api.paystack.co';
export const paystack = async (path: string, body?: unknown) => {
  const res = await fetch(PAYSTACK + path, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  return res.json();
};

// ---- Payments: Korapay (default) or Paystack, chosen with PAYMENT_PROVIDER ----
export const provider = () => (process.env.PAYMENT_PROVIDER === 'paystack' ? 'paystack' : 'korapay') as 'paystack' | 'korapay';
export const paymentsConfigured = () => !!(provider() === 'korapay' ? process.env.KORAPAY_SECRET_KEY : process.env.PAYSTACK_SECRET_KEY);

const KORA = 'https://api.korapay.com/merchant/api/v1';
const kora = async (path: string, body?: unknown) => {
  const res = await fetch(KORA + path, {
    method: body ? 'POST' : 'GET',
    headers: { Authorization: `Bearer ${process.env.KORAPAY_SECRET_KEY}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined, cache: 'no-store',
  });
  return res.json().catch(() => null);
};

/** Starts a hosted checkout and returns its URL (amount in naira), or null on failure. */
export async function startPayment(o: { ref: string; totalNaira: number; code: string; name: string; phone: string; origin: string }): Promise<string | null> {
  const email = `${o.phone.replace(/\D/g, '')}@orders.zeeskitchen.ng`;
  const redirect = `${o.origin}/order/${o.code}`;
  if (provider() === 'paystack') {
    const r = await paystack('/transaction/initialize', { email, amount: o.totalNaira * 100, currency: 'NGN', reference: o.ref, callback_url: redirect, metadata: { order_code: o.code } });
    return r?.status ? r.data.authorization_url : null;
  }
  const r = await kora('/charges/initialize', {
    reference: o.ref, amount: o.totalNaira, currency: 'NGN', redirect_url: redirect,
    notification_url: `${o.origin}/api/korapay/webhook`, customer: { name: o.name, email }, metadata: { order_code: o.code },
  });
  return r?.status && r.data?.checkout_url ? r.data.checkout_url : null;
}

/** Asks the provider directly whether this reference was paid in full. Never trust the browser. */
export async function confirmPayment(ref: string, totalNaira: number): Promise<boolean> {
  if (provider() === 'paystack') {
    const v = await paystack(`/transaction/verify/${ref}`);
    return v?.data?.status === 'success' && v.data.amount === totalNaira * 100;
  }
  const v = await kora(`/charges/${encodeURIComponent(ref)}`);
  return v?.data?.status === 'success' && Number(v.data.amount) >= totalNaira;
}
