import { NextResponse } from 'next/server';
import { COOKIE, makeSession, passwordOk } from '@/lib/admin';

export const runtime = 'nodejs';
const tries = new Map<string, { n: number; t: number }>();

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'local', now = Date.now(), h = tries.get(ip);
  if (h && now - h.t < 10 * 60_000 && h.n >= 8) return NextResponse.json({ error: 'Too many tries. Wait 10 minutes.' }, { status: 429 });
  tries.set(ip, !h || now - h.t >= 10 * 60_000 ? { n: 1, t: now } : { n: h.n + 1, t: h.t });

  const { password } = await req.json().catch(() => ({ password: '' }));
  if (!passwordOk(String(password ?? ''))) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, makeSession(), { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 12 * 3600 });
  return res;
}
