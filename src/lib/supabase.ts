import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ikhwsbyyqvmwambppiw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra' +
  'ndzYnl5cXZtd2FtdWJwcGl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2ODMxMDcsImV4cCI6MjA5MTI1OTEwN30' +
  '.en_GovBZlDPGQXGWbwXgQPEHADyl-nFA1OfHyEfUYco';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Database = {
  public: {
    Tables: {
      clubs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          tagline: string | null;
          logo_url: string | null;
          created_at: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'admin' | 'coach' | 'parent';
          club_id: string | null;
          created_at: string;
        };
      };
      wrestlers: {
        Row: {
          id: string;
          full_name: string;
          date_of_birth: string;
          weight_class: string | null;
          program: string;
          status: 'active' | 'inactive';
          parent_id: string;
          club_id: string;
          created_at: string;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          event_type: 'practice' | 'tournament' | 'meeting' | 'event';
          start_time: string;
          end_time: string;
          location: string | null;
          club_id: string;
          created_at: string;
        };
      };
      messages: {
        Row: {
          id: string;
          subject: string;
          body: string;
          sender_id: string;
          club_id: string;
          recipient_type: 'all' | 'parents' | 'coaches';
          created_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          description: string;
          amount: number;
          status: 'paid' | 'pending' | 'failed';
          parent_id: string;
          club_id: string;
          due_date: string | null;
          paid_at: string | null;
          created_at: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          message: string;
          priority: 'high' | 'normal' | 'low';
          club_id: string;
          created_at: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          wrestler_id: string;
          program: string;
          status: 'pending' | 'complete' | 'cancelled';
          club_id: string;
          created_at: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          wrestler_id: string;
          event_id: string;
          status: 'present' | 'absent' | 'excused';
          created_at: string;
        };
      };
    };
  };
};
