'use client'

import { createContext, useContext } from 'react'
import type { CatalogData } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const CatalogContext = createContext<CatalogData | null>(null)

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface CatalogProviderProps {
  data: CatalogData
  children: React.ReactNode
}

/**
 * CatalogProvider — wraps les pages du groupe (catalogue) pour exposer
 * les données de catalogue (merchant, categories, products) aux composants
 * enfants sans prop drilling.
 *
 * Utilisé par le layout `src/app/[slug]/(catalogue)/layout.tsx`.
 */
export function CatalogProvider({ data, children }: CatalogProviderProps) {
  return <CatalogContext.Provider value={data}>{children}</CatalogContext.Provider>
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useCatalog — accède aux données du catalogue depuis n'importe quel composant
 * enfant du CatalogProvider.
 *
 * @throws Si utilisé en dehors d'un CatalogProvider.
 */
export function useCatalog(): CatalogData {
  const ctx = useContext(CatalogContext)
  if (ctx === null) {
    throw new Error(
      'useCatalog doit être utilisé à l\'intérieur d\'un <CatalogProvider>. ' +
      'Vérifiez que le layout (catalogue) est bien en place.',
    )
  }
  return ctx
}
