import { createClient } from '@/lib/supabase/server'

function parseBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return false
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  
  console.log('🔍 API GET /api/products/[id] - Requested ID:', id)
  
  if (!id) {
    console.error('❌ API GET missing product id')
    return new Response(JSON.stringify({ error: 'ID de producto inválido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = await createClient()

  try {
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

    if (productError || !product) {
      console.error('❌ Product query error:', productError)
      return new Response(JSON.stringify({ error: 'Producto no encontrado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    let profile = null
    if (product.user_id) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, location, bio, phone')
        .eq('id', product.user_id)
        .single()

      if (profileError) {
        console.warn('API GET profile lookup failed:', profileError)
      } else {
        profile = profileData
      }
    }

    // Increment views
    await supabase
      .from('products')
      .update({ views_count: (product.views_count || 0) + 1 })
      .eq('id', id)

    const responsePayload = { ...product, profiles: profile }

    console.log('✅ Returning product:', product.title)
    
    return new Response(JSON.stringify(responsePayload), {
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Usuario no autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body = await request.json()
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (body.title) updates.title = String(body.title).trim()
    if (body.description) updates.description = String(body.description).trim()
    if (body.category_id) updates.category_id = String(body.category_id).trim()
    if (body.condition) updates.condition = String(body.condition).trim()
    if (body.location) updates.location = String(body.location).trim()
    if (body.price !== undefined && body.price !== null && body.price !== '') updates.price = Number(body.price)
    if (body.images && Array.isArray(body.images)) {
      updates.images = body.images.filter((img: unknown) => typeof img === 'string')
    }
    if (Object.prototype.hasOwnProperty.call(body, 'is_donation')) {
      updates.is_donation = parseBoolean(body.is_donation)
    }
    if (body.is_available !== undefined) updates.is_available = parseBoolean(body.is_available)

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating product:', error)
      return new Response(JSON.stringify({ error: 'Error al actualizar el producto' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!data) {
      return new Response(JSON.stringify({ error: 'Producto no encontrado o no autorizado' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('❌ Error parsing PATCH body:', err)
    return new Response(JSON.stringify({ error: 'Datos inválidos para actualizar el producto' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: userData, error: userError } = await supabase.auth.getUser()

  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'Usuario no autenticado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const deleteResult = await supabase
    .from('products')
    .delete()
    .eq('id', id)
    .eq('user_id', userData.user.id)

  const data = deleteResult.data as any
  const error = deleteResult.error

  if (error) {
    console.error('❌ Error deleting product:', error)
    return new Response(JSON.stringify({ error: 'Error al eliminar el producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const isEmptyResult =
    data == null || (Array.isArray(data) ? data.length === 0 : false)

  if (isEmptyResult) {
    return new Response(JSON.stringify({ error: 'Producto no encontrado o no autorizado' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
