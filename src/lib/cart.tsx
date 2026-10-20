'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export interface CartLine {
  key: string; dishId: string; slug: string; name: string;
  qty: number; unit: number;          // unit price in naira incl. chosen options
  options: string[];                  // human labels, e.g. ["Pounded yam", "Chicken"]
  choiceIds: string[]; note?: string;
}
interface CartCtx {
  lines: CartLine[]; count: number; subtotal: number;
  open: boolean; setOpen: (v: boolean) => void;
  add: (l: Omit<CartLine, 'key'>) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void; clear: () => void;
  reprice: (units: number[]) => void;
}
const Ctx = createContext<CartCtx | null>(null);
const STORE = 'zk-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORE); if (raw) setLines(JSON.parse(raw)); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORE, JSON.stringify(lines)); } catch {}
  }, [lines, ready]);

  const add = useCallback((l: Omit<CartLine, 'key'>) => {
    const key = [l.dishId, [...l.choiceIds].sort().join('+'), l.note ?? ''].join('|');
    setLines((prev) => {
      const hit = prev.find((p) => p.key === key);
      return hit ? prev.map((p) => (p.key === key ? { ...p, qty: Math.min(p.qty + l.qty, 50) } : p)) : [...prev, { ...l, key }];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((key: string, qty: number) =>
    setLines((p) => (qty <= 0 ? p.filter((x) => x.key !== key) : p.map((x) => (x.key === key ? { ...x, qty: Math.min(qty, 50) } : x)))), []);
  const remove = useCallback((key: string) => setLines((p) => p.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);
  const reprice = useCallback((units: number[]) => setLines((p) => p.map((l, i) => (units[i] > 0 ? { ...l, unit: units[i] } : l))), []);

  const value = useMemo<CartCtx>(() => ({
    lines, open, setOpen, add, setQty, remove, clear, reprice,
    count: lines.reduce((n, l) => n + l.qty, 0),
    subtotal: lines.reduce((n, l) => n + l.qty * l.unit, 0),
  }), [lines, open, add, setQty, remove, clear, reprice]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useCart must be used inside CartProvider');
  return c;
};
