import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://ctzacamygbfmbbukzieu.supabase.co";

// usa TU anon key (la misma que ya tienes)
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0emFjYW15Z2JmbWJidWt6aWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDkxOTAsImV4cCI6MjA4MjQyNTE5MH0.S8G718wpLJ5nHCYIZGu0FlP6GhFhhrQqK5A0JvoyP6I";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
