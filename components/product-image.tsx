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

  // Ensure URL is absolute and valid
  const absoluteUrl = ensureAbsoluteImageUrl(src)

  const handleError = () => {
    console.error(`Failed to load image: ${src}`)
    setHasError(true)
    onError?.()
  }

  if (!src || hasError) {
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
    />
  )
}

/**
 * Ensures an image URL is absolute
 * If relative, constructs absolute URL using Supabase URL
 */
export function ensureAbsoluteImageUrl(url: string): string {
  if (!url) return ''

  const trimmedUrl = url.trim()
  if (trimmedUrl.length === 0) return ''

  if (/^(data:|blob:)/i.test(trimmedUrl)) {
    return trimmedUrl
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  if (!supabaseUrl) {
    console.warn('NEXT_PUBLIC_SUPABASE_URL not configured, using raw image path as fallback:', trimmedUrl)
    return trimmedUrl.startsWith('/') ? trimmedUrl : `/${trimmedUrl}`
  }

  if (trimmedUrl.startsWith('/')) {
    return `${supabaseUrl}${trimmedUrl}`
  }

  return `${supabaseUrl}/${trimmedUrl}`
}
