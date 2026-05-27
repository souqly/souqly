-- =============================================================================
-- Migration : 20240101000005_product_variants.sql
-- Description : Tables de variantes produit (type + options), RLS,
--               Mise à jour de get_catalog pour inclure les variantes
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Table : product_variant_types (ex: "Taille", "Couleur")
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variant_types (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name       text        NOT NULL CHECK (char_length(name) BETWEEN 1 AND 50),
  position   int         NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variant_types_product_id
  ON public.product_variant_types (product_id);

-- ---------------------------------------------------------------------------
-- Table : product_variant_options (ex: "S", "M", "L", "Rouge")
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variant_options (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_type_id uuid        NOT NULL REFERENCES public.product_variant_types(id) ON DELETE CASCADE,
  label           text        NOT NULL CHECK (char_length(label) BETWEEN 1 AND 100),
  position        int         NOT NULL DEFAULT 0,
  is_available    boolean     NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_variant_options_type_id
  ON public.product_variant_options (variant_type_id);

-- ---------------------------------------------------------------------------
-- RLS : product_variant_types
-- ---------------------------------------------------------------------------
ALTER TABLE public.product_variant_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "variant_types_select_own" ON public.product_variant_types;
CREATE POLICY "variant_types_select_own"
  ON public.product_variant_types
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_variant_types.product_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "variant_types_insert_own" ON public.product_variant_types;
CREATE POLICY "variant_types_insert_own"
  ON public.product_variant_types
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_variant_types.product_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "variant_types_update_own" ON public.product_variant_types;
CREATE POLICY "variant_types_update_own"
  ON public.product_variant_types
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_variant_types.product_id
        AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_variant_types.product_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "variant_types_delete_own" ON public.product_variant_types;
CREATE POLICY "variant_types_delete_own"
  ON public.product_variant_types
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_variant_types.product_id
        AND m.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- RLS : product_variant_options
-- ---------------------------------------------------------------------------
ALTER TABLE public.product_variant_options ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "variant_options_select_own" ON public.product_variant_options;
CREATE POLICY "variant_options_select_own"
  ON public.product_variant_options
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.product_variant_types vt
      JOIN public.products p ON p.id = vt.product_id
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE vt.id = product_variant_options.variant_type_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "variant_options_insert_own" ON public.product_variant_options;
CREATE POLICY "variant_options_insert_own"
  ON public.product_variant_options
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.product_variant_types vt
      JOIN public.products p ON p.id = vt.product_id
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE vt.id = product_variant_options.variant_type_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "variant_options_update_own" ON public.product_variant_options;
CREATE POLICY "variant_options_update_own"
  ON public.product_variant_options
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.product_variant_types vt
      JOIN public.products p ON p.id = vt.product_id
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE vt.id = product_variant_options.variant_type_id
        AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.product_variant_types vt
      JOIN public.products p ON p.id = vt.product_id
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE vt.id = product_variant_options.variant_type_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "variant_options_delete_own" ON public.product_variant_options;
CREATE POLICY "variant_options_delete_own"
  ON public.product_variant_options
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.product_variant_types vt
      JOIN public.products p ON p.id = vt.product_id
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE vt.id = product_variant_options.variant_type_id
        AND m.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Mise à jour de get_catalog
-- Inclut maintenant les variantes (types + options) pour chaque produit
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

  -- 2. Récupère les infos du marchand
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

  -- 5. Construit le tableau de produits avec images et variantes
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
      ),
      'variants',     COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id',       vt.id,
              'name',     vt.name,
              'position', vt.position,
              'options',  COALESCE(
                (
                  SELECT jsonb_agg(
                    jsonb_build_object(
                      'id',           vo.id,
                      'label',        vo.label,
                      'position',     vo.position,
                      'is_available', vo.is_available
                    )
                    ORDER BY vo.position ASC
                  )
                  FROM public.product_variant_options vo
                  WHERE vo.variant_type_id = vt.id
                ),
                '[]'::jsonb
              )
            )
            ORDER BY vt.position ASC
          )
          FROM public.product_variant_types vt
          WHERE vt.product_id = p.id
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
