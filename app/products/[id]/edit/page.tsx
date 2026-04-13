'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CATEGORIES = [
  'Muebles',
  'Electrónica',
  'Ropa',
  'Hogar',
  'Deportes',
  'Libros',
  'Juguetes',
  'Jardín',
  'Vehículos',
  'Otros',
]

const CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'como_nuevo', label: 'Como nuevo' },
  { value: 'buen_estado', label: 'Buen estado' },
  { value: 'usado', label: 'Usado' },
  { value: 'para_reparar', label: 'Para reparar' },
]

// Mock data - en producción vendría de la API
const MOCK_PRODUCT = {
  id: '1',
  title: 'Silla de Madera Rústica',
  description: 'Hermosa silla de madera maciza en excelente estado',
  category: 'Muebles',
  condition: 'buen_estado',
  price: '45000',
  location: 'CDMX',
  isDonation: false,
  images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop'],
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const [formData, setFormData] = useState(MOCK_PRODUCT)
  const [uploadedImages, setUploadedImages] = useState<string[]>(MOCK_PRODUCT.images)

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
      Array.from(files).forEach((file) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Producto actualizado:', { ...formData, images: uploadedImages })
    alert('¡Producto actualizado exitosamente!')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Back Button */}
        <Link
          href={`/products/${params.id}`}
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-6"
        >
          <ChevronLeft size={20} />
          Volver
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-green-900 mb-2">Editar Producto</h1>
          <p className="text-green-700 mb-8">Actualiza la información de tu producto</p>

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
                placeholder="Describe el estado, características..."
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                  <p className="text-green-700 font-medium">Sube más imágenes aquí</p>
                  <p className="text-gray-600 text-sm">o haz clic para seleccionar</p>
                </label>
              </div>

              {/* Imágenes */}
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
              >
                Guardar Cambios
              </Button>
              <Link href={`/products/${params.id}`} className="flex-1">
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
