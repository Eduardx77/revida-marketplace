import { createClient } from './server'

// Helper para asegurar que las URLs de Supabase sean absolutas
function ensureAbsoluteUrl(url: string, supabaseUrl?: string): string {
  if (!url) return url
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('/')) {
    // URL relativa - construir URL absoluta
    const baseUrl = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!baseUrl) return url
    
    return baseUrl.replace(/\/$/, '') + url
  }
  
  return url
}

export async function getProduct(id: string) {
  const supabase = await createClient()

  const { data: product, error: productError } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('id', id)
    .single()

  if (productError) throw productError
  if (!product) throw new Error('Producto no encontrado')

  let profile = null
  if (product.user_id) {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, avatar_url, location, bio, phone')
      .eq('id', product.user_id)
      .single()

    if (profileError) {
      console.warn('getProduct profile lookup failed:', profileError)
    } else {
      profile = profileData
    }
  }

  // Increment views
  await supabase
    .from('products')
    .update({ views_count: (product.views_count || 0) + 1 })
    .eq('id', id)

  return { ...product, profiles: profile }
}
