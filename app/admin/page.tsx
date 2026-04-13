'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart3, Users, Package, AlertTriangle, TrendingUp, Check, X, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState([
    { label: 'Usuarios Totales', value: '0', icon: Users, change: '0%' },
    { label: 'Productos Listados', value: '0', icon: Package, change: '0%' },
    { label: 'Reportes Pendientes', value: '0', icon: AlertTriangle, change: '0' },
    { label: 'Ingresos (Mes)', value: '$0', icon: TrendingUp, change: '0%' },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      const supabase = createClient()

      try {
        // Get user count
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Get product count
        const { count: productCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })

        // Get available products count
        const { count: availableProducts } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('is_available', true)

        setStats([
          { label: 'Usuarios Totales', value: userCount?.toString() || '0', icon: Users, change: 'N/A' },
          { label: 'Productos Listados', value: productCount?.toString() || '0', icon: Package, change: 'N/A' },
          { label: 'Productos Disponibles', value: availableProducts?.toString() || '0', icon: AlertTriangle, change: 'N/A' },
          { label: 'Ingresos (Mes)', value: '$0', icon: TrendingUp, change: 'N/A' },
        ])
      } catch (error) {
        console.error('Error loading admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const flaggedProducts = [
    {
      id: '1',
      title: 'Producto Sospechoso',
      seller: 'Usuario123',
      reason: 'Imágenes de baja calidad',
      reports: 5,
      status: 'pending',
    },
    {
      id: '2',
      title: 'Artículo Prohibido',
      seller: 'BadSeller99',
      reason: 'Posible contenido ilegal',
      reports: 12,
      status: 'reviewing',
    },
  ]

  const pendingUsers = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
      signupDate: '2024-03-18',
      products: 0,
    },
    {
      id: '2',
      name: 'María García',
      email: 'maria@example.com',
      signupDate: '2024-03-19',
      products: 1,
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Dashboard */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ArrowLeft size={20} />
          Volver al dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Panel de Administración</h1>
          <p className="text-green-700">Gestiona la plataforma, usuarios y contenido</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600 font-medium text-sm">{stat.label}</p>
                <stat.icon className="text-green-600" size={24} />
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stat.value}
              </p>
              <p className="text-green-600 text-sm mt-2 font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'overview'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Resumen
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'products'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Productos Reportados
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'users'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Usuarios
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-6 py-4 font-medium text-center transition-colors ${
                  activeTab === 'settings'
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Configuración
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Actividad Reciente</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">5 nuevos usuarios se registraron</span>
                      <span className="text-gray-500 text-sm">Hace 2h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">3 productos denunciados</span>
                      <span className="text-gray-500 text-sm">Hace 4h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">1 usuario suspendido</span>
                      <span className="text-gray-500 text-sm">Ayer</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Productos Reportados</h2>
                <div className="space-y-3">
                  {flaggedProducts.map((product) => (
                    <div key={product.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-gray-900">{product.title}</h3>
                          <p className="text-sm text-gray-600">Vendedor: {product.seller}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            product.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {product.status === 'pending' ? 'Pendiente' : 'En revisión'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{product.reason}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{product.reports} reportes</span>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check size={16} className="mr-1" />
                            Aprobar
                          </Button>
                          <Button size="sm" variant="outline" className="border-red-300 text-red-600">
                            <X size={16} className="mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Usuarios Registrados Recientemente</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Nombre</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Fecha</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Productos</th>
                        <th className="px-4 py-3 text-left text-sm font-bold text-gray-900">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingUsers.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-gray-900 font-medium">{user.name}</td>
                          <td className="px-4 py-3 text-gray-600">{user.email}</td>
                          <td className="px-4 py-3 text-gray-600">{user.signupDate}</td>
                          <td className="px-4 py-3 text-gray-600">{user.products}</td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="outline">
                              Ver Perfil
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Configuración de la Plataforma</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Nombre de la Plataforma
                      </label>
                      <input
                        type="text"
                        defaultValue="ReVida"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Email de Contacto
                      </label>
                      <input
                        type="email"
                        defaultValue="support@revida.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Descripción de la Plataforma
                      </label>
                      <textarea
                        defaultValue="Marketplace ecológico para la reutilización de objetos"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">Guardar Cambios</Button>
                      <Button variant="outline">Cancelar</Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
