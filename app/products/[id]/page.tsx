import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, MessageCircle, Share2, ChevronLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/product-image'
import { getProduct } from '@/lib/supabase/server-queries'
import { createClient } from '@/lib/supabase/client'
import { toggleFavorite } from '@/lib/supabase/queries'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{
    id: string
  }>
}

interface ProductPageProps {
  product: any
  productId: string
}

function ProductPageContent({ product, productId }: ProductPageProps) {
  'use client'
  
  const { useEffect, useState } = require('react')
  
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setCurrentUser(user)
        
        // Check if product is in favorites
        const { data: favorites } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('product_id', productId)
          .single()
        
        setIsFavorite(!!favorites)
      }
    }
    
    checkFavoriteStatus()
  }, [productId])

  const handleToggleFavorite = async () => {
    if (!currentUser) return
    
    setFavoriteLoading(true)
    try {
      await toggleFavorite(currentUser.id, productId)
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setFavoriteLoading(false)
    }
  }

  const images = Array.isArray(product?.images)
    ? product.images.filter((img: unknown): img is string => typeof img === 'string' && img.trim().length > 0)
    : typeof product?.images === 'string' && product.images.trim().length > 0
    ? [product.images]
    : []

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft size={20} />
          Volver al marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl p-6 shadow-lg">
          {/* Images */}
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

          {/* Info */}
          <div className="space-y-6">
            <div>
              {product.categories?.name && (
                <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  {product.categories.name}
                </div>                  
              )}
              <h1 className="text-3xl font-bold text-green-900 mb-2">{product.title}</h1>
            </div>

            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <MapPin size={18} className="text-green-600" />
              {product.location}
            </div>

            <div className="border-t border-b py-4">
              {product.price && product.price > 0 ? (
                <p className="text-4xl font-bold text-green-600">${product.price.toLocaleString()}</p>
              ) : (
                <p className="text-2xl font-bold text-green-700 bg-green-100 inline-block px-4 py-2 rounded">Donación</p>
              )}
              <p className="text-sm text-gray-600 mt-2 capitalize">
                Condición: {product.condition?.replace('_', ' ')}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold text-green-900 mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
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
                      isFavorite 
                        ? 'border-red-300 text-red-600 hover:bg-red-50' 
                        : 'border-green-300 text-green-600 hover:bg-green-50'
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
                    {product.profiles.full_name?.charAt(0) || 'V'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{product.profiles.full_name || 'Vendedor'}</h3>
                  <p className="text-sm text-gray-500">{product.profiles.location || 'Sin ubicación'}</p>
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

export default async function ProductDetailPage(props: Props) {
  const { id: rawId } = await props.params
  const productId = Array.isArray(rawId) ? rawId[0] : rawId
  const invalidId = !productId || productId === 'undefined' || productId === 'null'

  console.log('🔍 ProductDetailPage - Loading ID:', productId)

  if (invalidId) {
    console.error('❌ Product detail page missing or invalid id parameter:', rawId)
    notFound()
  }

  let product: any = null

  try {
    product = await getProduct(productId)
    console.log('✅ Product loaded:', product?.title, '(ID:', product?.id, ')')
  } catch (err) {
    console.error('❌ Error loading product:', err)
    notFound()
  }

  return <ProductPageContent product={product} productId={productId} />
}
