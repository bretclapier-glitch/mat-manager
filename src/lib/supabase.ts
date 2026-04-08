import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://ikhwsbyyqvmwambppiw.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra253c2J5eXF2bXdhbXVicHBpdyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc1NjgzMTA3LCJleHAiOjIwOTEyNTkxMDd9.en_GovBZlDPGQXGWbwXgQPEHADyl-nFA1OfHyEfUYco';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
