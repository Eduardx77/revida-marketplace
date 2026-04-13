'use client'

import { X } from 'lucide-react'
import { Button } from './ui/button'

interface FiltersPanelProps {
  isOpen: boolean
  onClose: () => void
  priceRange: { min: number; max: number }
  onPriceChange: (range: { min: number; max: number }) => void
  selectedConditions: string[]
  onConditionChange: (condition: string) => void
}

const CONDITIONS = [
  { value: 'nuevo', label: 'Nuevo' },
  { value: 'como_nuevo', label: 'Como nuevo' },
  { value: 'buen_estado', label: 'Buen estado' },
  { value: 'usado', label: 'Usado' },
  { value: 'para_reparar', label: 'Para reparar' },
]

export function FiltersPanel({
  isOpen,
  onClose,
  priceRange,
  onPriceChange,
  selectedConditions,
  onConditionChange,
}: FiltersPanelProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 md:relative md:z-0">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-80 bg-white shadow-lg md:relative md:shadow-none md:w-auto overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b md:hidden">
          <h2 className="text-lg font-bold">Filtros</h2>
          <button onClick={onClose} className="p-2">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Precio */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Rango de Precio</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Mínimo</label>
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) =>
                    onPriceChange({
                      ...priceRange,
                      min: Math.min(Number(e.target.value), priceRange.max),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Máximo</label>
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) =>
                    onPriceChange({
                      ...priceRange,
                      max: Math.max(Number(e.target.value), priceRange.min),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600"
                />
              </div>
            </div>
          </div>

          {/* Condición */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Condición</h3>
            <div className="space-y-2">
              {CONDITIONS.map((condition) => (
                <label key={condition.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedConditions.includes(condition.value)}
                    onChange={() => onConditionChange(condition.value)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-gray-700">{condition.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tipo de Listado */}
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Tipo</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-gray-700">Con Precio</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                <span className="text-gray-700">Donaciones</span>
              </label>
            </div>
          </div>

          {/* Botón de limpiar filtros */}
          <Button
            onClick={() => {
              onPriceChange({ min: 0, max: 500000 })
              selectedConditions.forEach((cond) => onConditionChange(cond))
            }}
            variant="outline"
            className="w-full border-green-300"
          >
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
