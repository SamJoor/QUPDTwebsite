import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function getServerEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    url,
    key: serviceRoleKey ?? anonKey ?? ''
  };
}

export function createServerSupabaseClient(): SupabaseClient | null {
  const { url, key } = getServerEnv();

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export function hasSupabaseServerAccess() {
  const { url, key } = getServerEnv();
  return Boolean(url && key);
}
