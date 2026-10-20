// Delivery zones in Asaba. Fees are in naira — placeholders, confirm real fees with Zee's.
export interface Zone { id: string; name: string; fee: number; eta: number } // eta in minutes

export const zones: Zone[] = [
  { id: 'okpanam-road', name: 'Okpanam Road', fee: 1000, eta: 35 },
  { id: 'nnebisi-road', name: 'Nnebisi Road', fee: 1000, eta: 35 },
  { id: 'ibusa-road', name: 'Ibusa Road / Cable Point', fee: 1200, eta: 40 },
  { id: 'summit-road', name: 'Summit Road / Ogbeogonogo', fee: 1200, eta: 40 },
  { id: 'jeremi-road', name: 'Jeremi / Anwai Road', fee: 1500, eta: 45 },
  { id: 'dls', name: 'DLA / Asaba GRA', fee: 1500, eta: 45 },
  { id: 'other', name: 'Other Asaba area (we will confirm)', fee: 2000, eta: 55 },
];
export const getZone = (id: string) => zones.find((z) => z.id === id);
