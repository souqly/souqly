'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Cart, CartItem } from '@/lib/types/catalog'

const CART_KEY_PREFIX = 'souqly_cart_'

function getCartKey(merchantSlug: string): string {
  return `${CART_KEY_PREFIX}${merchantSlug}`
}

function loadCart(merchantSlug: string): Cart {
  if (typeof window === 'undefined') {
    return { merchantSlug, items: [] }
  }
  try {
    const raw = localStorage.getItem(getCartKey(merchantSlug))
    if (!raw) return { merchantSlug, items: [] }
    const parsed = JSON.parse(raw) as Cart
    if (!Array.isArray(parsed.items)) return { merchantSlug, items: [] }
    return parsed
  } catch {
    return { merchantSlug, items: [] }
  }
}

function saveCart(cart: Cart): void {
  try {
    localStorage.setItem(getCartKey(cart.merchantSlug), JSON.stringify(cart))
  } catch {
    // Storage plein ou indisponible — silencieux
  }
}

export function useCart(merchantSlug: string) {
  const [cart, setCart] = useState<Cart>(() => loadCart(merchantSlug))

  // Synchronise l'état si le slug change (cas rare)
  useEffect(() => {
    const timer = window.setTimeout(() => setCart(loadCart(merchantSlug)), 0)
    return () => window.clearTimeout(timer)
  }, [merchantSlug])

  // Persiste à chaque changement
  useEffect(() => {
    saveCart(cart)
  }, [cart])

  const addItem = useCallback(
    (item: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
      setCart((prev) => {
        const existing = prev.items.find((i) => i.productId === item.productId)
        const items = existing
          ? prev.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          : [...prev.items, { ...item, quantity }]
        return { ...prev, items }
      })
    },
    [],
  )

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i,
      ),
    }))
  }, [])

  const removeItem = useCallback((productId: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter((i) => i.productId !== productId),
    }))
  }, [])

  const clearCart = useCallback(() => {
    setCart((prev) => ({ ...prev, items: [] }))
  }, [])

  const totalCents = cart.items.reduce(
    (sum, item) => sum + item.price_cents * item.quantity,
    0,
  )

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    cart,
    items: cart.items,
    totalCents,
    itemCount,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
