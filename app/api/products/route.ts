import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const STORAGE_BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'products'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY

function parseBoolean(value: FormDataEntryValue | null): boolean {
  return value?.toString() === 'true'
}

export async function POST(request: Request) {
  if (!SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Missing Supabase service role key' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const cookieStore = await cookies()
  const authClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // ignore when running in contexts where cookies cannot be updated
          }
        },
      },
    },
  )

  const { data: userData, error: userError } = await authClient.auth.getUser()
  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const formData = await request.formData()
  const title = formData.get('title')?.toString().trim() || ''
  const description = formData.get('description')?.toString().trim() || ''
  const categoryId = formData.get('category')?.toString().trim() || ''
  const condition = formData.get('condition')?.toString().trim() || ''
  const location = formData.get('location')?.toString().trim() || ''
  const priceString = formData.get('price')?.toString() || ''
  const isDonation = parseBoolean(formData.get('isDonation'))
  const price = isDonation ? null : priceString ? parseFloat(priceString) : null

  if (!title || !description || !categoryId || !condition || !location) {
    return new Response(JSON.stringify({ error: 'Missing required product fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const files = formData.getAll('images').filter((item): item is File => item instanceof File)
  if (files.length === 0) {
    return new Response(JSON.stringify({ error: 'Debe subir al menos una imagen' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const storageClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    SERVICE_ROLE_KEY,
  )

  const uploadedImageUrls: string[] = []
  for (const file of files) {
    const extension = file.name.match(/\.[^.]+$/)?.[0] || '.jpg'
    const fileName = `product-${userData.user.id}-${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`

    const { data: uploadData, error: uploadError } = await storageClient.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError || !uploadData) {
      console.error(`Error uploading image to bucket ${STORAGE_BUCKET}:`, uploadError)
      return new Response(JSON.stringify({ error: 'Error al subir imagen' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const publicUrlData = storageClient.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(fileName)

    if (!publicUrlData?.data?.publicUrl) {
      console.error(`Error getting public URL for ${fileName}`)
      return new Response(JSON.stringify({ error: 'Error al obtener la URL de la imagen' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    uploadedImageUrls.push(publicUrlData.data.publicUrl)
  }

  const { data, error } = await authClient
    .from('products')
    .insert({
      title,
      description,
      price,
      condition,
      location,
      images: uploadedImageUrls,
      category_id: categoryId,
      is_donation: isDonation,
      user_id: userData.user.id,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Error inserting product:', error)
    return new Response(JSON.stringify({ error: 'Error al guardar el producto' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ product: data }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}
