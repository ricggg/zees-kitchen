import { createClient } from '@supabase/supabase-js';
// Browser client (anon key). Used from batch 4 for realtime order tracking.
export const supabase = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
