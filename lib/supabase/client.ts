import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

let supabaseClient: SupabaseClient | null = null

/**
 * Get singleton Supabase browser client.
 * This ensures only ONE GoTrueClient instance exists in the browser.
 */
export function getSupabaseClient(): SupabaseClient {
  if (supabaseClient) {
    return supabaseClient
  }

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    },
  )

  return supabaseClient
}

/**
 * Legacy export for backward compatibility.
 * Use getSupabaseClient() instead.
 */
export function createClient(): SupabaseClient {
  return getSupabaseClient()
}
