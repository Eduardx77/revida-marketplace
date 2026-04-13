'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MapPin, Package, ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getProducts, getCategories, toggleFavorite } from '@/lib/supabase/queries'
import { createClient } from '@/lib/supabase/client'

interface Category {
  id: string
  name: string
  slug: string
}

const DEFAULT_CATEGORY = { id: 'all', name: 'Todos' }

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    loadCategories()
    loadUser()
  }, [])

  useEffect(() => {
    loadProducts()
  }, [selectedCategory, searchQuery])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data ?? [])
    } catch (err) {
      console.error('Error loading categories:', err)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getProducts({
        category: selectedCategory,
        search: searchQuery,
      })
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error loading products:', err)
      setError('No se pudieron cargar los productos. Revisa la consola para más información.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const loadUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    } catch (err) {
      console.error('Error loading user:', err)
    }
  }

  const handleToggleFavorite = async (productId: string) => {
    if (!currentUser) return

    try {
      const isFavorited = await toggleFavorite(currentUser.id, productId)
      setFavorites((prev) =>
        isFavorited ? [...prev, productId] : prev.filter((id) => id !== productId)
      )
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const categoryButtons = [DEFAULT_CATEGORY, ...categories]

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4 sm:mb-0">
              <ArrowLeft size={18} />
              Volver al dashboard
            </Link>
            <h1 className="text-4xl font-bold text-green-900 mb-2">Marketplace Ecológico</h1>
            <p className="text-green-700 text-lg">Descubre productos reutilizados y dona lo que no uses</p>
          </div>
          <div className="flex gap-3">
            <Link href="/products/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus size={18} className="mr-2" />
                Publicar Producto
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                Ir a mi dashboard
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar productos o ubicación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-4 pr-4 bg-white border-2 border-green-300 rounded-lg focus:border-green-600"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex gap-3">
            {categoryButtons.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-5 py-2 rounded-full font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-green-700 border-2 border-green-300 hover:border-green-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-800 p-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-600">Cargando productos...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden hover:scale-105"
                >
                  <div className="relative h-48 bg-green-100 overflow-hidden">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <button
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        await handleToggleFavorite(product.id)
                      }}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Heart
                        size={20}
                        className={favorites.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}
                      />
                    </button>
                    {product.is_donation && (
                      <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Donación
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-green-900 mb-2 line-clamp-2">{product.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin size={16} className="text-green-600" />
                      {product.location}
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        {product.price > 0 ? (
                          <p className="text-2xl font-bold text-green-600">${product.price.toLocaleString()}</p>
                        ) : (
                          <p className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Gratis</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{product.condition}</p>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600 text-sm">
                        <Package size={14} />
                        {product.views_count ?? product.views}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">No se encontraron productos</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
