-- =============================================================================
-- Migration : 20240101000004_brands_and_delivery.sql
-- Description : Table brands, brand_id sur products, options livraison sur merchants
--               Mise à jour RPC get_catalog pour inclure brands + livraison
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table : brands (par marchand, comme categories)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.brands (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id  uuid        NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  name         text        NOT NULL,
  slug         text        NOT NULL,
  position     int         NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (merchant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_brands_merchant_id ON public.brands (merchant_id);

-- ---------------------------------------------------------------------------
-- Colonne brand_id sur products
-- ---------------------------------------------------------------------------
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products (brand_id);

-- ---------------------------------------------------------------------------
-- Options livraison sur merchants
-- ---------------------------------------------------------------------------
ALTER TABLE public.merchants
  ADD COLUMN IF NOT EXISTS click_and_collect_enabled  boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS self_delivery_enabled       boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS self_delivery_city          text,
  ADD COLUMN IF NOT EXISTS self_delivery_price_cents   int,
  ADD COLUMN IF NOT EXISTS colissimo_enabled           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS colissimo_price_cents        int;

-- ---------------------------------------------------------------------------
-- Colonne delivery_method sur cart_submissions (tracking)
-- ---------------------------------------------------------------------------
ALTER TABLE public.cart_submissions
  ADD COLUMN IF NOT EXISTS delivery_method text
    CHECK (delivery_method IN ('click_and_collect', 'self_delivery', 'colissimo'));

-- ---------------------------------------------------------------------------
-- RLS : brands
-- ---------------------------------------------------------------------------
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "brands_select_own" ON public.brands;
CREATE POLICY "brands_select_own"
  ON public.brands
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = brands.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "brands_insert_own" ON public.brands;
CREATE POLICY "brands_insert_own"
  ON public.brands
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = brands.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "brands_update_own" ON public.brands;
CREATE POLICY "brands_update_own"
  ON public.brands
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = brands.merchant_id
        AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = brands.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "brands_delete_own" ON public.brands;
CREATE POLICY "brands_delete_own"
  ON public.brands
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = brands.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Mise à jour de get_catalog
-- Inclut maintenant : brands, brand_id sur produits, options livraison marchand
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_catalog(
  merchant_slug    text,
  p_session_token  text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_merchant    RECORD;
  v_session     RECORD;
  v_categories  jsonb;
  v_brands      jsonb;
  v_products    jsonb;
BEGIN
  -- 1. Vérifie que le token est valide et correspond au bon marchand
  SELECT
    s.id,
    s.merchant_id,
    s.expires_at
  INTO v_session
  FROM public.access_sessions s
  JOIN public.merchants m ON m.id = s.merchant_id
  WHERE s.session_token = p_session_token
    AND s.expires_at > now()
    AND m.slug = merchant_slug
    AND m.status = 'active'
    AND m.subscription_status IN ('trial', 'active');

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'session_invalid');
  END IF;

  -- 2. Récupère les infos du marchand (colonnes explicites, pas de SELECT *)
  SELECT
    id,
    slug,
    name,
    description,
    logo_url,
    whatsapp_number,
    telegram_username,
    message_template,
    click_and_collect_enabled,
    self_delivery_enabled,
    self_delivery_city,
    self_delivery_price_cents,
    colissimo_enabled,
    colissimo_price_cents
  INTO v_merchant
  FROM public.merchants
  WHERE id = v_session.merchant_id;

  -- 3. Construit le tableau de catégories avec product_count
  SELECT jsonb_agg(
    jsonb_build_object(
      'id',              c.id,
      'name',            c.name,
      'slug',            c.slug,
      'position',        c.position,
      'cover_image_url', c.cover_image_url,
      'product_count',   (
        SELECT count(*)
        FROM public.products p
        WHERE p.category_id = c.id
          AND p.merchant_id = v_session.merchant_id
          AND p.is_available = true
      )
    )
    ORDER BY c.position ASC
  )
  INTO v_categories
  FROM public.categories c
  WHERE c.merchant_id = v_session.merchant_id;

  -- 4. Construit le tableau de marques avec product_count
  SELECT jsonb_agg(
    jsonb_build_object(
      'id',            b.id,
      'name',          b.name,
      'slug',          b.slug,
      'position',      b.position,
      'product_count', (
        SELECT count(*)
        FROM public.products p
        WHERE p.brand_id = b.id
          AND p.merchant_id = v_session.merchant_id
          AND p.is_available = true
      )
    )
    ORDER BY b.position ASC
  )
  INTO v_brands
  FROM public.brands b
  WHERE b.merchant_id = v_session.merchant_id;

  -- 5. Construit le tableau de produits avec leurs images et brand_id
  SELECT jsonb_agg(
    jsonb_build_object(
      'id',           p.id,
      'category_id',  p.category_id,
      'brand_id',     p.brand_id,
      'name',         p.name,
      'description',  p.description,
      'price_cents',  p.price_cents,
      'reference',    p.reference,
      'is_available', p.is_available,
      'position',     p.position,
      'images',       COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id',           pi.id,
              'storage_path', pi.storage_path,
              'position',     pi.position,
              'is_primary',   pi.is_primary
            )
            ORDER BY pi.position ASC
          )
          FROM public.product_images pi
          WHERE pi.product_id = p.id
        ),
        '[]'::jsonb
      )
    )
    ORDER BY p.position ASC
  )
  INTO v_products
  FROM public.products p
  WHERE p.merchant_id = v_session.merchant_id;

  -- 6. Retourne l'objet complet
  RETURN jsonb_build_object(
    'merchant',   jsonb_build_object(
                    'id',                          v_merchant.id,
                    'slug',                        v_merchant.slug,
                    'name',                        v_merchant.name,
                    'description',                 v_merchant.description,
                    'logo_url',                    v_merchant.logo_url,
                    'whatsapp_number',             v_merchant.whatsapp_number,
                    'telegram_username',           v_merchant.telegram_username,
                    'message_template',            v_merchant.message_template,
                    'click_and_collect_enabled',   v_merchant.click_and_collect_enabled,
                    'self_delivery_enabled',        v_merchant.self_delivery_enabled,
                    'self_delivery_city',           v_merchant.self_delivery_city,
                    'self_delivery_price_cents',    v_merchant.self_delivery_price_cents,
                    'colissimo_enabled',            v_merchant.colissimo_enabled,
                    'colissimo_price_cents',        v_merchant.colissimo_price_cents
                  ),
    'categories', COALESCE(v_categories, '[]'::jsonb),
    'brands',     COALESCE(v_brands,     '[]'::jsonb),
    'products',   COALESCE(v_products,   '[]'::jsonb)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

REVOKE ALL ON FUNCTION public.get_catalog(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_catalog(text, text) TO anon, authenticated;
