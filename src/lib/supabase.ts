import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? 'https://ikhwsbyyqvmwamubppiw.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra3dzYnl5cXZtd2FtdWJwcGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODMxMDcsImV4cCI6MjA5MTI1OTEwN30.en_GovBZlDPGQXGWbwXgQPEHADyl-nFA1OfHyEfUYco';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
