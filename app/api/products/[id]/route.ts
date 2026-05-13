import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  console.log('🔍 API GET /api/products/[id] - Requested ID:', id)
  
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url,
          location,
          bio,
          phone
        ),
        categories (
          name,
          slug
        )
      `)
      .eq('id', id)
      .single()

    console.log('📊 Query result:', data?.title, '(ID:', data?.id, ')')

    if (error || !data) {
      console.error('❌ Query error:', error)
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Increment views
    await supabase
      .from('products')
      .update({ views_count: (data.views_count || 0) + 1 })
      .eq('id', id)

    console.log('✅ Returning product:', data.title)
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('❌ Error fetching product:', err)
    return new Response(JSON.stringify({ error: 'Error al cargar el producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
