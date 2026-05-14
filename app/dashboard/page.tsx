'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Heart, Settings, LogOut, User, Package, MessageSquare, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductImage } from '@/components/product-image'
import { createClient } from '@/lib/supabase/client'
import { getUserProducts, getUserFavorites } from '@/lib/supabase/queries'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('products')
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string; user_metadata?: { full_name?: string } } | null>(null)
  const [userProfile, setUserProfile] = useState<{ full_name?: string; location?: string; bio?: string; phone?: string } | null>(null)
  const [userProducts, setUserProducts] = useState<any[]>([])
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('¿Eliminar este producto permanentemente?')) return
    setActionLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Error al eliminar el producto')
      }

      setUserProducts((current) => current.filter((product) => product.id !== productId))
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('No se pudo eliminar el producto. Intenta de nuevo.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleAvailability = async (productId: string, currentAvailability: boolean) => {
    setActionLoading(true)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ is_available: !currentAvailability }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload?.error || 'Error al cambiar la disponibilidad del producto')
      }

      setUserProducts((current) =>
        current.map((product) =>
          product.id === productId
            ? { ...product, is_available: !currentAvailability }
            : product
        )
      )
    } catch (error) {
      console.error('Error toggling availability:', error)
      alert('No se pudo cambiar la disponibilidad del producto. Intenta de nuevo.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveProfile = async (formData: FormData) => {
    setActionLoading(true)
    try {
      const supabase = createClient()
      const updates = {
        full_name: formData.get('fullName')?.toString().trim() || null,
        location: formData.get('location')?.toString().trim() || null,
        bio: formData.get('bio')?.toString().trim() || null,
        phone: formData.get('phone')?.toString().trim() || null,
      }

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: currentUser?.id,
          ...updates,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      // Reload profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser?.id)
        .single()

      if (profile) {
        setUserProfile(profile)
      }

      alert('Perfil actualizado correctamente')
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error al guardar el perfil. Intenta de nuevo.')
    } finally {
      setActionLoading(false)
    }
  }

  useEffect(() => {
    const supabase = createClient()

    const loadUser = async () => {
      const userResponse = await supabase.auth.getUser()
      const user = userResponse.data?.user
      const error = userResponse.error
      if (!error && user) {
        setCurrentUser(user)

        // Load user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!profileError && profile) {
          setUserProfile(profile)
        }

        await loadUserData(user.id)
      }
      setLoading(false)
    }

    loadUser()
  }, [])

  const loadUserData = async (userId: string) => {
    try {
      const [products, userFavorites] = await Promise.all([
        getUserProducts(userId),
        getUserFavorites(userId)
      ])
      setUserProducts(Array.isArray(products) ? products : [])
      setFavorites(Array.isArray(userFavorites) ? userFavorites : [])
    } catch (error) {
      console.error('Error loading user data:', error instanceof Error ? error.message : JSON.stringify(error))
      setUserProducts([])
      setFavorites([])
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Marketplace */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={20} />
          Volver al marketplace
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Mi Dashboard</h1>
            <p className="text-green-700">
              Bienvenido de vuelta, {userProfile?.full_name || currentUser?.user_metadata?.full_name || currentUser?.email || 'Usuario'}
            </p>
          </div>
          <Link href="/products/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus size={20} className="mr-2" />
              Publicar Producto
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Productos Activos</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? '...' : userProducts.filter(p => p.is_available).length}
                </p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </div>
          <Link href="/messages" className="bg-white rounded-lg p-6 shadow-md hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Mensajes sin Leer</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? '...' : '0'}
                </p>
              </div>
              <MessageSquare className="text-green-600" size={32} />
            </div>
          </Link>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Visualizaciones Totales</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {loading ? '...' : userProducts.reduce((total, p) => total + (p.views_count || 0), 0)}
                </p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'products'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Package size={18} className="inline mr-2" />
                Mis Productos
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'favorites'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Heart size={18} className="inline mr-2" />
                Mis Favoritos
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'profile'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User size={18} className="inline mr-2" />
                Perfil
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'products' && (
              <div className="space-y-4">
                {userProducts.length > 0 ? (
                  userProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <ProductImage
                        src={product.images?.[0] || 'https://via.placeholder.com/80x80?text=No+Image'}
                        alt={product.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600">${(product.price ?? 0).toLocaleString()} • {product.views_count ?? 0} vistas</p>
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                          {product.is_available ? 'Activo' : 'No disponible'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Link href={`/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">Editar</Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                          disabled={actionLoading}
                        >
                          Eliminar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-white bg-emerald-600 hover:bg-emerald-700 border-transparent"
                          onClick={() => handleToggleAvailability(product.id, product.is_available)}
                          disabled={actionLoading}
                        >
                          {product.is_available ? 'Marcar vendido' : 'Reactivar'}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 py-8">No tienes productos publicados</p>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="space-y-4">
                {favorites.length > 0 ? (
                  favorites.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <ProductImage
                        src={product.image}
                        alt={product.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{product.title}</h3>
                        <p className="text-sm text-gray-600">${product.price.toLocaleString()} • {product.location}</p>
                      </div>
                      <Heart className="text-red-500 fill-red-500" size={20} />
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 py-8">No tienes favoritos</p>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <form action={handleSaveProfile} className="space-y-6 max-w-2xl">
                <div>
                  <label htmlFor="profile-name" className="block text-sm font-medium text-gray-900 mb-2">Nombre Completo</label>
                  <input
                    id="profile-name"
                    name="fullName"
                    type="text"
                    defaultValue={userProfile?.full_name || currentUser?.user_metadata?.full_name || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="profile-email" className="block text-sm font-medium text-gray-900 mb-2">Email</label>
                  <input
                    id="profile-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={currentUser?.email || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="profile-location" className="block text-sm font-medium text-gray-900 mb-2">Ubicación</label>
                  <input
                    id="profile-location"
                    name="location"
                    type="text"
                    defaultValue={userProfile?.location || 'CDMX, México'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="profile-phone" className="block text-sm font-medium text-gray-900 mb-2">Teléfono</label>
                  <input
                    id="profile-phone"
                    name="phone"
                    type="tel"
                    defaultValue={userProfile?.phone || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div>
                  <label htmlFor="profile-bio" className="block text-sm font-medium text-gray-900 mb-2">Bio</label>
                  <textarea
                    id="profile-bio"
                    name="bio"
                    defaultValue={userProfile?.bio || ''}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={actionLoading}>
                    {actionLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-2 border-red-300 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} className="mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
