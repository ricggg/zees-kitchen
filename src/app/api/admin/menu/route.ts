import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/admin';
import { getMenu } from '@/lib/menu';
import { admin } from '@/lib/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const no = () => NextResponse.json({ error: 'Unauthorised' }, { status: 401 });

export async function GET() {
  if (!isAdmin()) return no();
  return NextResponse.json({ dishes: (await getMenu()).map(({ id, name, category, price, soldOut }) => ({ id, name, category, price, soldOut: !!soldOut })) });
}

export async function PUT(req: Request) {
  if (!isAdmin()) return no();
  const b = await req.json().catch(() => ({}));
  const price = Math.round(Number(b.price));
  const exists = (await getMenu()).some((d) => d.id === b.id);
  if (!exists || !(price >= 0 && price <= 1_000_000)) return NextResponse.json({ error: 'Invalid dish or price.' }, { status: 400 });
  const { error } = await admin().from('menu_overrides').upsert({ dish_id: b.id, price, sold_out: !!b.soldOut, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: 'Could not save. Did you run batch5.sql?' }, { status: 500 });
  return NextResponse.json({ ok: true });
}
