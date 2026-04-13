'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MapPin, User, MessageCircle, Share2, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock data for product detail
const PRODUCT_DETAIL = {
  id: '1',
  title: 'Silla de Madera Rústica',
  price: 45000,
  condition: 'buen_estado',
  location: 'CDMX, México',
  description: 'Hermosa silla de madera maciza en excelente estado. Muy cómoda, perfecta para comedor o sala de estar. Tiene pequeñas marcas naturales de uso pero está estructuralmente perfecta.',
  images: [
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567538096051-b6c36370b63e?w=600&h=600&fit=crop',
  ],
  category: 'Muebles',
  seller: {
    id: '1',
    name: 'Juan García',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    rating: 4.8,
    reviews: 12,
    responseTime: 'Responde en 2 horas',
  },
  isDonation: false,
  views: 234,
  postedAt: 'Hace 3 días',
  tags: ['Madera', 'Rústico', 'Vintage', 'Segunda Mano'],
}

export default function ProductDetailPage() {
  const [mainImage, setMainImage] = useState(PRODUCT_DETAIL.images[0])
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft size={20} />
          Volver al marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl p-6 shadow-lg">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-square">
              <img src={mainImage} alt={PRODUCT_DETAIL.title} className="w-full h-full object-cover" />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <Heart
                  size={24}
                  className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {PRODUCT_DETAIL.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(image)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage === image ? 'border-green-600' : 'border-gray-300'
                  }`}
                >
                  <img src={image} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {PRODUCT_DETAIL.category}
                  </div>
                  <h1 className="text-3xl font-bold text-green-900 mb-2">{PRODUCT_DETAIL.title}</h1>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <MapPin size={18} className="text-green-600" />
                {PRODUCT_DETAIL.location}
              </div>
              <div className="text-gray-500 text-sm">{PRODUCT_DETAIL.postedAt}</div>
            </div>

            {/* Price */}
            <div className="border-t border-b py-4">
              {PRODUCT_DETAIL.price > 0 ? (
                <p className="text-4xl font-bold text-green-600">${PRODUCT_DETAIL.price.toLocaleString()}</p>
              ) : (
                <p className="text-2xl font-bold text-green-700 bg-green-100 inline-block px-4 py-2 rounded">Donación</p>
              )}
              <p className="text-sm text-gray-600 mt-2 capitalize">
                Condición: {PRODUCT_DETAIL.condition.replace('_', ' ')}
              </p>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-bold text-green-900 mb-3">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">{PRODUCT_DETAIL.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {PRODUCT_DETAIL.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-lg font-bold text-lg">
                <MessageCircle size={20} className="mr-2" />
                Enviar Mensaje
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-2 border-green-300 h-12 rounded-lg font-bold"
                >
                  <Share2 size={18} className="mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Section */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-green-900 mb-4">Sobre el vendedor</h2>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img
                src={PRODUCT_DETAIL.seller.avatar}
                alt={PRODUCT_DETAIL.seller.name}
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900">{PRODUCT_DETAIL.seller.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-yellow-500">★</span>
                  {PRODUCT_DETAIL.seller.rating} ({PRODUCT_DETAIL.seller.reviews} reseñas)
                </div>
                <p className="text-sm text-gray-500">{PRODUCT_DETAIL.seller.responseTime}</p>
              </div>
            </div>
            <Button className="bg-green-600 hover:bg-green-700 text-white rounded-lg">
              <MessageCircle size={18} className="mr-2" />
              Contactar
            </Button>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Productos similares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Link
                key={i}
                href={`/products/${i}`}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="h-40 bg-gray-100"></div>
                <div className="p-4">
                  <p className="font-bold text-green-900">Producto similar {i}</p>
                  <p className="text-green-600 font-bold">$25000</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
