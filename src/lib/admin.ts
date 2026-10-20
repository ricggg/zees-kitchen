import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

const sign = (v: string) => createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '').update(v).digest('hex');
export const COOKIE = 'zk_admin';
export const makeSession = () => { const exp = String(Date.now() + 12 * 3600_000); return `${exp}.${sign(exp)}`; };

export function isAdmin(): boolean {
  if ((process.env.ADMIN_SESSION_SECRET || '').length < 16) return false;
  const [exp, sig] = (cookies().get(COOKIE)?.value ?? '').split('.');
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
export function passwordOk(p: string): boolean {
  const w = process.env.ADMIN_PASSWORD || '';
  const h = (s: string) => createHmac('sha256', 'zk-pw').update(s).digest();
  return w.length >= 8 && timingSafeEqual(h(p), h(w));
}
