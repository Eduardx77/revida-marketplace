import { notFound } from 'next/navigation'
import { getProduct } from '@/lib/supabase/server-queries'
import ProductPageContent from '@/components/product-page-content'

export const dynamic = 'force-dynamic'

interface Props {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const productIdRaw = Array.isArray(params.id) ? params.id[0] : params.id
  const productId = String(productIdRaw ?? '').trim()
  const invalidId =
    !productId ||
    ['undefined', 'null', 'desconocido'].includes(productId.toLowerCase())

  console.log('🔍 ProductDetailPage - Loading ID:', productId)

  if (invalidId) {
    console.warn('⚠️ Product detail page missing or invalid id parameter:', params.id)
    return notFound()
  }

  let product: any = null

  try {
    product = await getProduct(productId)
    product = JSON.parse(JSON.stringify(product))
    console.log('✅ Product loaded:', product?.title, '(ID:', product?.id, ')')
  } catch (err) {
    console.error('❌ Error loading product:', err)
    return <ProductLoadErrorPage productId={productId} message="No se pudo cargar este producto en este momento." />
  }

  if (!product || typeof product !== 'object') {
    console.warn('⚠️ Product detail page received no product or invalid payload for ID:', productId, product)
    return notFound()
  }

  return <ProductPageContent product={product} productId={productId} />
}

function ProductLoadErrorPage({ productId, message }: { productId: string; message: string }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-3xl bg-white p-10 shadow-xl border border-red-100 text-center">
          <p className="text-sm uppercase tracking-[0.24em] text-red-600 font-semibold mb-4">Error al cargar producto</p>
          <h1 className="text-3xl font-bold text-green-900 mb-4">{message}</h1>
          <p className="text-gray-600 mb-6">El producto con ID <span className="font-mono text-sm text-gray-800">{productId}</span> no se puede mostrar actualmente.</p>
          <div className="flex justify-center gap-3">
            <a href="/marketplace" className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition">
              Volver al marketplace
            </a>
            <a href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-green-300 px-6 py-3 text-green-700 font-semibold hover:bg-green-50 transition">
              Ir al dashboard
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
