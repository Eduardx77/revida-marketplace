'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, MessageCircle, Share2, ChevronLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/product-image'
import { createClient } from '@/lib/supabase/client'
import { toggleFavorite } from '@/lib/supabase/queries'

interface ProductPageProps {
  product: any
  productId: string
}

export default function ProductPageContent({ product, productId }: ProductPageProps) {
  if (!product || typeof product !== 'object') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 py-16">
          <div className="rounded-3xl bg-white p-10 shadow-xl border border-red-100 text-center">
            <p className="text-sm uppercase tracking-[0.24em] text-red-600 font-semibold mb-4">Producto no disponible</p>
            <h1 className="text-3xl font-bold text-green-900 mb-4">No se pudo cargar el producto</h1>
            <p className="text-gray-600 mb-6">Por favor regresa al marketplace e intenta con otro producto.</p>
            <div className="flex justify-center gap-3">
              <a href="/marketplace" className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition">
                Ir al marketplace
              </a>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const supabase = createClient()
        const userResponse = await supabase.auth.getUser()
        if (userResponse.error || !userResponse.data?.user) return

        const user = userResponse.data.user
        setCurrentUser(user)

        const { data: favorites, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single()

        if (!error) {
          setIsFavorite(!!favorites)
        }
      } catch {
        // Ignorar errores de auth/ fetch para no romper la vista de producto.
      }
    }

    checkFavoriteStatus()
  }, [productId])

  const handleToggleFavorite = async () => {
    if (!currentUser) return

    setFavoriteLoading(true)
    try {
      await toggleFavorite(currentUser.id, productId)
      setIsFavorite((prev) => !prev)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const images = Array.isArray(product.images)
    ? product.images.filter((img: unknown): img is string => typeof img === 'string' && img.trim().length > 0)
    : typeof product.images === 'string' && product.images.trim().length > 0
    ? [product.images]
    : []

  const title = product.title || 'Producto ecológico'
  const location = product.location || 'Ubicación no disponible'
  const description = product.description || 'No hay descripción disponible para este producto.'
  const categoryName = product.categories?.name || 'Sin categoría'
  const price = product.price !== null && product.price !== undefined ? product.price : 0
  const condition = product.condition || 'Desconocida'
  const profileName = product.profiles?.full_name || 'Vendedor'
  const profileLocation = product.profiles?.location || 'Ubicación no disponible'

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft size={20} />
          Volver al marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="space-y-4">
            {images.length > 0 ? (
              <>
                <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                  <ProductImage
                    src={images[0]}
                    alt={product.title || 'Producto'}
                    className="w-full h-full object-cover"
                    priority
                  />
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img: string, idx: number) => (
                      <ProductImage
                        key={idx}
                        src={img}
                        alt={`Vista ${idx + 1}`}
                        className="w-full h-full object-cover rounded border border-gray-300"
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center text-gray-500">
                Sin imagen disponible
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              {categoryName && (
                <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {categoryName}
                </div>
              )}
              <h1 className="text-3xl font-bold text-green-900 mb-2">{title}</h1>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin size={18} className="text-green-600" />
              {location}
            </div>

            <div className="border-t border-b py-4">
              {price > 0 ? (
                <p className="text-4xl font-bold text-green-600">${price.toLocaleString()}</p>
              ) : (
                <p className="text-2xl font-bold text-green-700 bg-green-100 inline-block px-4 py-2 rounded">Donación</p>
              )}
              <p className="text-sm text-gray-600 mt-2 capitalize">
                Condición: {condition.replace('_', ' ')}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-green-900 mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg font-bold text-lg">
                  <MessageCircle size={20} className="mr-2" />
                  Enviar Mensaje
                </Button>
                {currentUser && (
                  <Button
                    variant="outline"
                    onClick={handleToggleFavorite}
                    disabled={favoriteLoading}
                    className={`h-12 px-4 rounded-lg font-bold border-2 ${
                      isFavorite ? 'border-red-300 text-red-600 hover:bg-red-50' : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                  </Button>
                )}
              </div>
              <Button variant="outline" className="w-full border-2 border-green-300 h-12 rounded-lg font-bold">
                <Share2 size={18} className="mr-2" />
                Compartir
              </Button>
            </div>
          </div>
        </div>

        {product.profiles && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-green-900 mb-4">Sobre el vendedor</h2>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {product.profiles.avatar_url ? (
                  <ProductImage
                    src={product.profiles.avatar_url}
                    alt={product.profiles.full_name || 'Vendedor'}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-green-100 grid place-items-center text-green-600 text-sm font-semibold">
                    {profileName.charAt(0) || 'V'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{profileName}</h3>
                  <p className="text-sm text-gray-500">{profileLocation}</p>
                </div>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
                <MessageCircle size={18} className="mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
