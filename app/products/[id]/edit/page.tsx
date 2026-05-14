'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCategories } from '@/lib/supabase/queries'

const FALLBACK_CATEGORIES = [
  { name: 'Muebles', slug: 'muebles' },
  { name: 'Electrónica', slug: 'electronica' },
  { name: 'Ropa', slug: 'ropa' },
  { name: 'Hogar', slug: 'hogar' },
  { name: 'Deportes', slug: 'deportes' },
  { name: 'Libros', slug: 'libros' },
  { name: 'Juguetes', slug: 'juguetes' },
  { name: 'Jardín', slug: 'jardin' },
  { name: 'Vehículos', slug: 'vehiculos' },
  { name: 'Otros', slug: 'otros' },
]

const CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'como_nuevo', label: 'Como nuevo' },
  { value: 'buen_estado', label: 'Buen estado' },
  { value: 'usado', label: 'Usado' },
  { value: 'para_reparar', label: 'Para reparar' },
]

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [productId, setProductId] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    condition: '',
    price: '',
    location: '',
    isDonation: false,
  })
  const [images, setImages] = useState<string[]>([])
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const loadData = async () => {
      const { id } = await params
      setProductId(id)
      setLoading(true)
      try {
        const [categoriesData, productRes] = await Promise.all([
          getCategories(),
          fetch(`/api/products/${id}`),
        ])

        if (!productRes.ok) {
          throw new Error('No se pudo cargar el producto')
        }

        const productData = await productRes.json()
        setCategories(Array.isArray(categoriesData) && categoriesData.length > 0 ? categoriesData : FALLBACK_CATEGORIES)

        setFormData({
          title: productData.title || '',
          description: productData.description || '',
          category_id: productData.category_id || '',
          condition: productData.condition || '',
          price: productData.price ? String(productData.price) : '',
          location: productData.location || '',
          isDonation: Boolean(productData.is_donation),
        })
        setImages(Array.isArray(productData.images) ? productData.images : [])
      } catch (error) {
        console.error('Error cargando producto para editar:', error)
        setErrorMessage('No se pudo cargar la información del producto.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target
    const inputElement = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? inputElement.checked : value,
    }))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setErrorMessage('')

    try {
      const payload: any = {
        title: formData.title,
        description: formData.description,
        category_id: formData.category_id,
        condition: formData.condition,
        location: formData.location,
        is_donation: formData.isDonation,
        images,
      }

      if (!formData.isDonation) {
        payload.price = Number(formData.price)
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'No se pudo actualizar el producto.')
      }

      router.push(`/products/${productId}`)
    } catch (error) {
      console.error('Error actualizando el producto:', error)
      setErrorMessage('Hubo un problema al guardar los cambios. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center text-green-700">
          Cargando producto...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href={`/products/${productId}`}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ChevronLeft size={20} />
          Volver
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Editar Producto</h1>
          <p className="text-green-700 mb-8">Actualiza la información de tu producto</p>
          {errorMessage ? (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label htmlFor="product-title" className="block text-sm font-bold text-gray-900 mb-2">
                Título del Producto *
              </label>
              <Input
                id="product-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Silla de madera rústica"
                required
                className="w-full"
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="product-description" className="block text-sm font-bold text-gray-900 mb-2">
                Descripción *
              </label>
              <textarea
                id="product-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el estado, características..."
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Categoría y Condición */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="product-category" className="block text-sm font-bold text-gray-900 mb-2">
                  Categoría *
                </label>
                <select
                  id="product-category"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="product-condition" className="block text-sm font-bold text-gray-900 mb-2">
                  Condición *
                </label>
                <select
                  id="product-condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                >
                  <option value="">Seleccionar condición</option>
                  {CONDITIONS.map((cond) => (
                    <option key={cond.value} value={cond.value}>
                      {cond.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Precio */}
            <div>
              <div className="flex items-center gap-4 mb-3">
                <label htmlFor="product-price" className="block text-sm font-bold text-gray-900">
                  Precio
                </label>
                <label htmlFor="donation-checkbox" className="flex items-center gap-2 cursor-pointer">
                  <input
                    id="donation-checkbox"
                    type="checkbox"
                    name="isDonation"
                    checked={formData.isDonation}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Es una donación (Gratis)</span>
                </label>
              </div>
              {!formData.isDonation && (
                <Input
                  id="product-price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ej: 45000"
                  className="w-full"
                />
              )}
            </div>

            {/* Ubicación */}
            <div>
              <label htmlFor="product-location" className="block text-sm font-bold text-gray-900 mb-2">
                Ubicación *
              </label>
              <Input
                id="product-location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: CDMX, México"
                required
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Fotos del Producto
              </label>
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {images.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={image}
                        alt={`Imagen ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">No hay imágenes disponibles para este producto.</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 font-bold text-lg rounded-lg"
              >
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Link href={`/products/${productId}`} className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-2 border-green-300 h-12 font-bold text-lg rounded-lg"
                >
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
