import Link from 'next/link'
import { MapPin, MessageCircle, Share2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/product-image'

export async function generateStaticParams() {
  return []
}

interface Props {
  params: Promise<{
    id: string
  }>
}

export default async function ProductDetailPage(props: Props) {
  const params = await props.params
  const productId = params.id
  
  console.log('🔍 ProductDetailPage - Loading ID:', productId)

  // Usar URL del servidor para obtener el producto
  let product: any = null
  let error: string | null = null

  try {
    const apiUrl = `/api/products/${productId}`
    console.log('🌐 Fetching from:', apiUrl)
    
    const response = await fetch(apiUrl, {
      cache: 'no-store',
    })

    console.log('📊 Response status:', response.status)

    if (!response.ok) {
      error = 'Producto no encontrado'
    } else {
      product = await response.json()
      console.log('✅ Product loaded:', product?.title, '(ID:', product?.id, ')')
    }
  } catch (err) {
    console.error('❌ Error loading product:', err)
    error = 'No se pudo cargar el producto'
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-6">
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft size={20} />
          Volver al marketplace
        </Link>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {product && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl p-6 shadow-lg">
              {/* Images */}
              <div className="space-y-4">
                {product.images && product.images.length > 0 && (
                  <>
                    <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                      <ProductImage 
                        src={product.images[0]} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                        priority
                      />
                    </div>
                    {product.images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {product.images.map((img: string, idx: number) => (
                          <ProductImage
                            key={idx}
                            src={img}
                            alt={`View ${idx + 1}`}
                            className="w-full h-full object-cover rounded border border-gray-300"
                          />
                        ))}
                      </div>
                    )}
                  </>
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
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg font-bold text-lg">
                    <MessageCircle size={20} className="mr-2" />
                    Enviar Mensaje
                  </Button>
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
                    {product.profiles.avatar_url && (
                      <ProductImage
                        src={product.profiles.avatar_url}
                        alt={product.profiles.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{product.profiles.full_name}</h3>
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
          </>
        )}
      </div>
    </main>
  )
}
