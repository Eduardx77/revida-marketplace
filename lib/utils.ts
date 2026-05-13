import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fileToDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Error al convertir archivo a Data URL'))
    reader.readAsDataURL(file)
  })
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(',')
  const mimeMatch = meta.match(/data:(.*?);base64/)
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'

  const byteCharacters = atob(base64)
  const byteNumbers = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i += 1) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }

  return new Blob([byteNumbers], { type: mimeType })
}

export async function compressImageFile(file: File): Promise<File> {
  const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024
  const COMPRESSION_MIN_QUALITY = 0.65
  const COMPRESSION_STEP = 0.08
  const MAX_DIMENSION = 1920

  const imageBitmap = await createImageBitmap(file)
  const ratio = Math.min(1, MAX_DIMENSION / imageBitmap.width, MAX_DIMENSION / imageBitmap.height)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(imageBitmap.width * ratio)
  canvas.height = Math.round(imageBitmap.height * ratio)
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('Canvas no soportado en este navegador')
  }

  context.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

  const outputType = file.type === 'image/png' || file.type === 'image/gif' ? 'image/jpeg' : file.type
  let quality = 0.92
  let blob: Blob | null = null

  while (quality >= COMPRESSION_MIN_QUALITY) {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, outputType, quality))
    if (!blob) {
      throw new Error('No se pudo comprimir la imagen')
    }
    if (blob.size <= MAX_IMAGE_SIZE_BYTES) {
      break
    }
    quality -= COMPRESSION_STEP
  }

  if (!blob || blob.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error('La imagen sigue siendo demasiado grande después de la compresión')
  }

  const extension = outputType === 'image/jpeg' ? '.jpg' : file.name.match(/\.[^.]+$/)?.[0] ?? ''
  const filename = file.name.replace(/\.[^.]+$/, extension)
  return new File([blob], filename, { type: blob.type })
}
