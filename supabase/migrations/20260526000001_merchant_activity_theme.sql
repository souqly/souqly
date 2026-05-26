-- =============================================================================
-- Migration : 20260526000001_merchant_activity_theme.sql
-- Description : Ajout des colonnes activity_type et catalog_theme sur merchants,
--               mise à jour de la RPC get_catalog pour les exposer au catalogue.
-- =============================================================================

-- 1. Nouvelles colonnes
ALTER TABLE public.merchants
  ADD COLUMN IF NOT EXISTS activity_type  text,
  ADD COLUMN IF NOT EXISTS catalog_theme  text NOT NULL DEFAULT 'indigo-pro';

-- 2. Mise à jour de get_catalog pour exposer activity_type et catalog_theme
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
    colissimo_price_cents,
    activity_type,
    catalog_theme
  INTO v_merchant
  FROM public.merchants
  WHERE id = v_session.merchant_id;

  -- 3. Catégories avec product_count
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

  -- 4. Marques
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

  -- 5. Produits avec images
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
                    'click_and_collect_enabled',   COALESCE(v_merchant.click_and_collect_enabled, false),
                    'self_delivery_enabled',       COALESCE(v_merchant.self_delivery_enabled, false),
                    'self_delivery_city',          v_merchant.self_delivery_city,
                    'self_delivery_price_cents',   v_merchant.self_delivery_price_cents,
                    'colissimo_enabled',           COALESCE(v_merchant.colissimo_enabled, false),
                    'colissimo_price_cents',       v_merchant.colissimo_price_cents,
                    'activity_type',               v_merchant.activity_type,
                    'catalog_theme',               COALESCE(v_merchant.catalog_theme, 'indigo-pro')
                  ),
    'categories', COALESCE(v_categories, '[]'::jsonb),
    'brands',     COALESCE(v_brands, '[]'::jsonb),
    'products',   COALESCE(v_products, '[]'::jsonb)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

REVOKE ALL ON FUNCTION public.get_catalog(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_catalog(text, text) TO anon, authenticated;
