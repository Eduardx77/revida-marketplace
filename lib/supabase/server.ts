import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(_: Array<{ name: string; value: string; options?: any }>) {
          // Request cookies are read-only in a Server Component.
          // Supabase may attempt to refresh a session, but we cannot persist
          // new cookies from this server-only context.
        },
      },
    },
  )
}
