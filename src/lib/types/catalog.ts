// Types dérivés de la réponse RPC get_catalog

export type ProductImage = {
  id: string
  storage_path: string
  position: number
  is_primary: boolean
}

export type VariantOption = {
  id: string
  label: string
  position: number
  is_available: boolean
}

export type VariantType = {
  id: string
  name: string
  position: number
  options: VariantOption[]
}

export type Product = {
  id: string
  category_id: string | null
  brand_id: string | null
  name: string
  description: string | null
  price_cents: number
  reference: string | null
  is_available: boolean
  position: number
  images: ProductImage[]
  variants: VariantType[]
}

export type Category = {
  id: string
  name: string
  slug: string
  position: number
  cover_image_url: string | null
  product_count: number
}

export type Brand = {
  id: string
  name: string
  slug: string
  position: number
  product_count: number
}

export type DeliveryMethod = 'click_and_collect' | 'self_delivery' | 'colissimo'

export type CatalogMerchant = {
  id: string
  slug: string
  name: string
  description: string | null
  logo_url: string | null
  whatsapp_number: string | null
  telegram_username: string | null
  message_template: string
  click_and_collect_enabled: boolean
  self_delivery_enabled: boolean
  self_delivery_city: string | null
  self_delivery_price_cents: number | null
  colissimo_enabled: boolean
  colissimo_price_cents: number | null
  activity_type: string | null
  catalog_theme: string
}

export type CatalogData = {
  merchant: CatalogMerchant
  categories: Category[]
  brands: Brand[]
  products: Product[]
}

// Panier (persisté en localStorage)
export type SelectedVariant = {
  typeName: string
  optionLabel: string
}

export type CartItem = {
  productId: string
  // Clé unique : productId pour les produits sans variantes,
  // productId::typeId:optionId|... pour les produits avec variantes sélectionnées
  cartKey: string
  name: string
  reference: string | null
  price_cents: number
  quantity: number
  image_url: string | null
  selectedVariants: SelectedVariant[]
}

export type Cart = {
  merchantSlug: string
  items: CartItem[]
}

// Résultats RPC
export type UnlockResult =
  | { session_token: string; expires_at: string }
  | { error: string }

export type CatalogResult = CatalogData | { error: string }
