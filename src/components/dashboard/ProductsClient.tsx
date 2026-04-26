'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { ProductsTable } from './ProductsTable'
import { ProductFormModal } from './ProductFormModal'
import type { ProductRow, CategoryOption } from './ProductsTable'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ProductsClientProps {
  products: ProductRow[]
  categories: CategoryOption[]
  merchantId: string
}

// ---------------------------------------------------------------------------
// Composant
// ---------------------------------------------------------------------------

export function ProductsClient({
  products,
  categories,
  merchantId,
}: ProductsClientProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<ProductRow | null>(null)

  function handleEdit(product: ProductRow) {
    setEditProduct(product)
    setModalOpen(true)
  }

  function handleNew() {
    setEditProduct(null)
    setModalOpen(true)
  }

  function handleClose() {
    setModalOpen(false)
    setEditProduct(null)
  }

  return (
    <>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Produits</h1>
          <p className="text-sm text-neutral-400 mt-1">
            {products.length} produit{products.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau produit
        </button>
      </div>

      {/* Tableau */}
      <ProductsTable
        products={products}
        categories={categories}
        merchantId={merchantId}
        onEdit={handleEdit}
      />

      {/* Modal */}
      <ProductFormModal
        open={modalOpen}
        onClose={handleClose}
        categories={categories}
        merchantId={merchantId}
        editProduct={editProduct}
      />
    </>
  )
}
