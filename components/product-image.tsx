'use client'

import { useState } from 'react'

interface ImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  onError?: () => void
}

/**
 * Component for displaying product images with proper URL handling
 * Ensures URLs are absolute and adds fallback for loading errors
 */
export function ProductImage({ src, alt, className = '', priority = false, onError }: ImageProps) {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Ensure URL is absolute
  const absoluteUrl = ensureAbsoluteImageUrl(src)

  const handleError = () => {
    console.error(`Failed to load image: ${src}`)
    setHasError(true)
    onError?.()
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-100 flex items-center justify-center`}>
        <span className="text-gray-400 text-sm">Imagen no disponible</span>
      </div>
    )
  }

  return (
    <img
      src={absoluteUrl}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      onError={handleError}
      onLoad={handleLoad}
      crossOrigin="anonymous"
    />
  )
}

/**
 * Ensures an image URL is absolute
 * If relative, constructs absolute URL using Supabase URL
 */
export function ensureAbsoluteImageUrl(url: string): string {
  if (!url) return url

  // Already absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Relative URL - construct absolute URL
  if (url.startsWith('/')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      console.warn('NEXT_PUBLIC_SUPABASE_URL not configured, cannot construct absolute URL')
      return url
    }

    return supabaseUrl.replace(/\/$/, '') + url
  }

  return url
}
