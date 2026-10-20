import 'server-only';
import { unstable_noStore as noStore } from 'next/cache';
import { dishes } from './menu-data';
import { admin } from './server';
import type { Dish } from './types';

/** Menu from code, with prices and sold-out flags overridden from Supabase (edited in /admin). */
export async function getMenu(): Promise<Dish[]> {
  noStore();
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return dishes;
  try {
    const { data } = await admin().from('menu_overrides').select('dish_id, price, sold_out');
    const m = new Map((data ?? []).map((r) => [r.dish_id as string, r]));
    return dishes.map((d) => {
      const o = m.get(d.id);
      return o ? { ...d, price: o.price ?? d.price, soldOut: !!o.sold_out } : d;
    });
  } catch { return dishes; }
}
