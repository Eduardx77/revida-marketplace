import { createClient } from './client'

// Products
export async function getProducts(filters?: {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  condition?: string[]
}) {
  try {
    const supabase = createClient()

    // Most basic query possible - just get all products
    const { data, error, status } = await supabase
      .from('products')
      .select('*')

    if (error) {
      console.error('getProducts error - status:', status, 'message:', error.message, 'details:', error)
      return []
    }

    if (!data) {
      console.warn('getProducts returned no data')
      return []
    }

    // Apply filters client-side
    let filtered = data

    if (filters?.search) {
      filtered = filtered.filter((p: any) =>
        p.title?.toLowerCase().includes(filters.search!.toLowerCase()) ||
        p.description?.toLowerCase().includes(filters.search!.toLowerCase())
      )
    }

    if (filters?.minPrice !== undefined) {
      filtered = filtered.filter((p: any) => p.price >= filters.minPrice!)
    }

    if (filters?.maxPrice !== undefined) {
      filtered = filtered.filter((p: any) => p.price <= filters.maxPrice!)
    }

    if (filters?.condition && filters.condition.length > 0) {
      filtered = filtered.filter((p: any) => filters.condition!.includes(p.condition))
    }

    if (filters?.category && filters.category !== 'all') {
      filtered = filtered.filter((p: any) => p.category_id === filters.category)
    }

    // Only show available products and not donations by default
    filtered = filtered.filter((p: any) => p.is_available !== false)

    return filtered.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } catch (err) {
    console.error('getProducts exception:', err instanceof Error ? err.message : err)
    return []
  }
}

export async function getUserProducts(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (
        name,
        slug
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getUserProducts error:', error)
    return []
  }

  return data ?? []
}

export async function getProduct(id: string) {
  const supabase = createClient()

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

  if (error) throw error

  // Increment views
  await supabase
    .from('products')
    .update({ views_count: (data.views_count || 0) + 1 })
    .eq('id', id)

  return data
}

export async function createProduct(productData: {
  title: string
  description: string
  price?: number | null
  condition: string
  location: string
  images: string[]
  category_id: string
  is_donation: boolean
}) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Upload images to Supabase Storage
  const uploadedImageUrls: string[] = []
  for (const imageBase64 of productData.images) {
    try {
      // Convert base64 to blob
      const base64Data = imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/jpeg' })

      // Generate unique filename
      const fileName = `product-${user.id}-${Date.now()}-${Math.random().toString(36).substring(2)}.jpg`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      uploadedImageUrls.push(publicUrl)
    } catch (error) {
      console.error('Error processing image:', error)
      throw new Error('Error al subir imagen')
    }
  }

  const { data, error } = await supabase
    .from('products')
    .insert({
      ...productData,
      images: uploadedImageUrls, // Use uploaded URLs instead of base64
      user_id: user.id,
      is_available: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Favorites
export async function getUserFavorites(userId: string) {
  const supabase = createClient()

  // Primero recabar los product_id favoritos
  const { data: favoriteRows, error: favoritesError } = await supabase
    .from('favorites')
    .select('product_id')
    .eq('user_id', userId)

  if (favoritesError) {
    console.error('getUserFavorites error (favorites query):', favoritesError)
    return []
  }

  const productIds = (favoriteRows ?? [])
    .map((row) => row.product_id)
    .filter((id) => !!id)

  if (productIds.length === 0) {
    return []
  }

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      profiles:user_id (
        full_name,
        avatar_url,
        location
      ),
      categories (
        name,
        slug
      )
    `)
    .in('id', productIds)

  if (productsError) {
    console.error('getUserFavorites error (products query):', productsError)
    return []
  }

  return products ?? []
}

export async function toggleFavorite(userId: string, productId: string) {
  const supabase = createClient()

  // Check if favorite exists
  const { data: existing } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId)

    if (error) throw error
    return false // removed
  } else {
    // Add favorite
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId })

    if (error) throw error
    return true // added
  }
}

// Messages
export async function getUserConversations(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!sender_id (
        full_name,
        avatar_url
      ),
      receiver:profiles!receiver_id (
        full_name,
        avatar_url
      ),
      products (
        title
      )
    `)
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getUserConversations error:', error)
    throw error
  }

  console.log('getUserConversations data:', data) // Debug log

  // Group by conversation (other user + product)
  const conversations = new Map()

  data.forEach(message => {
    const otherUserId = message.sender_id === userId ? message.receiver_id : message.sender_id
    const otherUser = message.sender_id === userId ? message.receiver : message.sender
    const key = `${otherUserId}-${message.product_id || 'general'}`

    if (!conversations.has(key)) {
      conversations.set(key, {
        id: key,
        userId: otherUserId,
        userName: otherUser.full_name || 'Usuario',
        userAvatar: otherUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
        lastMessage: message.content,
        lastMessageTime: formatTime(message.created_at),
        unreadCount: message.sender_id !== userId && !message.is_read ? 1 : 0,
        productId: message.product_id,
        productTitle: message.products?.title,
        messages: []
      })
    }

    conversations.get(key).messages.push({
      id: message.id,
      senderId: message.sender_id,
      senderName: message.sender_id === userId ? 'Tú' : otherUser.full_name || 'Usuario',
      senderAvatar: message.sender_id === userId
        ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`
        : otherUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUserId}`,
      content: message.content,
      timestamp: formatTime(message.created_at),
      isRead: message.is_read
    })
  })

  return Array.from(conversations.values()).map(conv => ({
    ...conv,
    messages: conv.messages.reverse() // Most recent first
  }))
}

export async function sendMessage(senderId: string, receiverId: string, content: string, productId?: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      content,
      product_id: productId
    })
    .select()
    .single()

  if (error) throw error
  return data
}

const DEFAULT_CATEGORIES = [
  { name: 'Muebles', slug: 'muebles', icon: 'Sofa', description: 'Todo para el hogar y mobiliario' },
  { name: 'Electrónica', slug: 'electronica', icon: 'Smartphone', description: 'Aparatos, gadgets y tecnología' },
  { name: 'Ropa', slug: 'ropa', icon: 'Shirt', description: 'Prendas de vestir y accesorios' },
  { name: 'Hogar', slug: 'hogar', icon: 'Home', description: 'Artículos para el hogar y cocina' },
  { name: 'Deportes', slug: 'deportes', icon: 'Dumbbell', description: 'Equipamiento deportivo y fitness' },
  { name: 'Libros', slug: 'libros', icon: 'BookOpen', description: 'Lectura, libros y revistas' },
  { name: 'Jardín', slug: 'jardin', icon: 'Flower2', description: 'Plantas, jardinería y exteriores' },
]

// Categories
export async function getCategories() {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('getCategories error:', error)
    return []
  }

  if (!data || data.length === 0) {
    try {
      const { data: inserted, error: insertError } = await supabase
        .from('categories')
        .insert(DEFAULT_CATEGORIES)
        .select()

      if (insertError) {
        console.error('getCategories seed error:', insertError)
      }

      return inserted ?? []
    } catch (seedError) {
      console.error('getCategories seed exception:', seedError)
      return []
    }
  }

  return data
}

// Profiles
export async function getProfile(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: any) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// Utils
export function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Ahora'
  if (minutes < 60) return `Hace ${minutes}m`
  if (hours < 24) return `Hace ${hours}h`
  if (days < 7) return `Hace ${days}d`

  return date.toLocaleDateString()
}