'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Cart, CartItem } from '@/lib/types/catalog'

// ---------------------------------------------------------------------------
// Helpers localStorage
// ---------------------------------------------------------------------------

function getStorageKey(slug: string): string {
  return `cart_${slug}`
}

function readCartFromStorage(slug: string): Cart {
  if (typeof window === 'undefined') {
    return { merchantSlug: slug, items: [] }
  }
  try {
    const raw = window.localStorage.getItem(getStorageKey(slug))
    if (!raw) return { merchantSlug: slug, items: [] }
    const parsed = JSON.parse(raw) as Cart
    // Guard basique : s'assurer que items est bien un tableau
    if (!Array.isArray(parsed.items)) return { merchantSlug: slug, items: [] }
    return parsed
  } catch {
    return { merchantSlug: slug, items: [] }
  }
}

function writeCartToStorage(cart: Cart): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(getStorageKey(cart.merchantSlug), JSON.stringify(cart))
  } catch {
    // Quota dépassé ou mode privé — silencieux
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

interface UseCartReturn {
  cart: Cart
  totalCents: number
  itemCount: number
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

/**
 * useCart — gestion du panier persisté en localStorage.
 *
 * La clé de stockage est `cart_[merchantSlug]` pour isoler les paniers
 * entre les différents marchands.
 */
export function useCart(merchantSlug: string): UseCartReturn {
  const [cart, setCart] = useState<Cart>(() => readCartFromStorage(merchantSlug))

  // Synchronise le state avec localStorage à chaque changement
  useEffect(() => {
    writeCartToStorage(cart)
  }, [cart])

  // Re-lit depuis localStorage au montage (SSR safety)
  useEffect(() => {
    const timer = window.setTimeout(() => setCart(readCartFromStorage(merchantSlug)), 0)
    return () => window.clearTimeout(timer)
  }, [merchantSlug])

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const existing = prev.items.find((i) => i.productId === item.productId)
      if (existing) {
        // Incrémente la quantité si le produit est déjà dans le panier
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        }
      }
      return { ...prev, items: [...prev.items, item] }
    })
  }, [])

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    }))
  }, [])

  const clearCart = useCallback(() => {
    setCart({ merchantSlug, items: [] })
  }, [merchantSlug])

  // -------------------------------------------------------------------------
  // Computed
  // -------------------------------------------------------------------------

  const totalCents = cart.items.reduce(
    (acc, item) => acc + item.price_cents * item.quantity,
    0,
  )

  const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0)

  return {
    cart,
    totalCents,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  }
}
