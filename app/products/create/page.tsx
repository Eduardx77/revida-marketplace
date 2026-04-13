'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { createProduct, getCategories } from '@/lib/supabase/queries'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

const CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'como_nuevo', label: 'Como nuevo' },
  { value: 'buen_estado', label: 'Buen estado' },
  { value: 'usado', label: 'Usado' },
  { value: 'para_reparar', label: 'Para reparar' },
]

export default function CreateProductPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    location: '',
    isDonation: false,
    images: [] as string[],
  })

  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error loading categories:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Limit to 5 images
      const filesToProcess = Array.from(files).slice(0, 5)
      setUploadedImages([]) // Clear previous images

      filesToProcess.forEach((file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Solo se permiten archivos de imagen')
          return
        }

        // Validate file size (max 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
          alert('Cada imagen debe ser menor a 5MB')
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            setUploadedImages((prev) => [...prev, event.target!.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        alert('El título es obligatorio')
        return
      }
      if (!formData.description.trim()) {
        alert('La descripción es obligatoria')
        return
      }
      if (!formData.category) {
        alert('Debes seleccionar una categoría')
        return
      }
      if (!formData.condition) {
        alert('Debes seleccionar el estado del producto')
        return
      }
      if (!formData.location.trim()) {
        alert('La ubicación es obligatoria')
        return
      }
      if (!formData.isDonation && (!formData.price || parseFloat(formData.price) <= 0)) {
        alert('Debes ingresar un precio válido o marcar como donación')
        return
      }
      if (uploadedImages.length === 0) {
        alert('Debes subir al menos una imagen')
        return
      }

      // Get category ID (formData.category now contains the category ID)
      const categoryId = formData.category
      if (!categoryId) {
        alert('Debes seleccionar una categoría')
        return
      }

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.isDonation ? null : parseFloat(formData.price),
        condition: formData.condition,
        location: formData.location.trim(),
        images: uploadedImages,
        category_id: categoryId,
        is_donation: formData.isDonation,
      }

      console.log('Creating product with data:', productData)
      await createProduct(productData)
      alert('¡Producto publicado exitosamente!')
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating product:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      alert(`Error al publicar el producto: ${errorMessage}. Inténtalo de nuevo.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link href="/marketplace" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6">
          <ChevronLeft size={20} />
          Volver
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Publicar Nuevo Producto</h1>
          <p className="text-green-700 mb-8">
            Comparte tus artículos y ayuda a otros a encontrar lo que necesitan
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Título del Producto *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Ej: Silla de madera rústica"
                required
                className="w-full"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Descripción *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe el estado, características, por qué lo vendes..."
                required
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>

            {/* Categoría y Condición */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={loadingCategories}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                >
                  <option value="">
                    {loadingCategories ? 'Cargando categorías...' : 'Seleccionar categoría'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Condición *
                </label>
                <select
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
                <label className="block text-sm font-bold text-gray-900">
                  Precio
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
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
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Ej: 45000"
                  className="w-full"
                />
              )}
            </div>

            {/* Ubicación */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Ubicación *
              </label>
              <Input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: CDMX, México"
                required
                className="w-full"
              />
            </div>

            {/* Imágenes */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Fotos del Producto
              </label>
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center hover:border-green-600 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <Upload size={32} className="text-green-600 mb-2" />
                  <p className="text-green-700 font-medium">Sube tus imágenes aquí</p>
                  <p className="text-gray-600 text-sm">o haz clic para seleccionar</p>
                </label>
              </div>

              {/* Imágenes subidas */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {uploadedImages.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={image}
                        alt={`Uploaded ${idx}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-4 pt-6 border-t">
              <Button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white h-12 font-bold text-lg rounded-lg"
                disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar Producto'}
              </Button>
              <Link href="/marketplace" className="flex-1">
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
