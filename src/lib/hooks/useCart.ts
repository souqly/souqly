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
    if (!Array.isArray(parsed.items)) return { merchantSlug: slug, items: [] }
    // Rétro-compatibilité : cartKey absent sur les anciens paniers
    parsed.items = parsed.items.map((item) => ({
      ...item,
      cartKey: item.cartKey ?? item.productId,
      selectedVariants: item.selectedVariants ?? [],
    }))
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
  removeFromCart: (cartKey: string) => void
  updateQuantity: (cartKey: string, quantity: number) => void
  clearCart: () => void
}

export function useCart(merchantSlug: string): UseCartReturn {
  const [cart, setCart] = useState<Cart>(() => readCartFromStorage(merchantSlug))

  useEffect(() => {
    writeCartToStorage(cart)
  }, [cart])

  useEffect(() => {
    const timer = window.setTimeout(() => setCart(readCartFromStorage(merchantSlug)), 0)
    return () => window.clearTimeout(timer)
  }, [merchantSlug])

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
      const key = item.cartKey ?? item.productId
      const existing = prev.items.find((i) => (i.cartKey ?? i.productId) === key)
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            (i.cartKey ?? i.productId) === key
              ? { ...i, quantity: i.quantity + item.quantity }
              : i,
          ),
        }
      }
      return { ...prev, items: [...prev.items, item] }
    })
  }, [])

  const removeFromCart = useCallback((cartKey: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => (i.cartKey ?? i.productId) !== cartKey),
    }))
  }, [])

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity < 1) return
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        (i.cartKey ?? i.productId) === cartKey ? { ...i, quantity } : i,
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
