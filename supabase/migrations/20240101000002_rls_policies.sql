-- =============================================================================
-- Migration : 20240101000002_rls_policies.sql
-- Description : Activation RLS + toutes les policies d'accès
-- Idempotent : DROP POLICY IF EXISTS avant chaque CREATE POLICY
-- =============================================================================

-- ---------------------------------------------------------------------------
-- MERCHANTS
-- ---------------------------------------------------------------------------
ALTER TABLE public.merchants ENABLE ROW LEVEL SECURITY;

-- Un marchand lit uniquement sa propre ligne
DROP POLICY IF EXISTS "merchants_select_own" ON public.merchants;
CREATE POLICY "merchants_select_own"
  ON public.merchants
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Un marchand peut créer sa propre ligne (user_id doit correspondre à auth.uid())
DROP POLICY IF EXISTS "merchants_insert_own" ON public.merchants;
CREATE POLICY "merchants_insert_own"
  ON public.merchants
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Un marchand peut modifier uniquement sa propre ligne
DROP POLICY IF EXISTS "merchants_update_own" ON public.merchants;
CREATE POLICY "merchants_update_own"
  ON public.merchants
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- DELETE désactivé pour les utilisateurs (service_role uniquement via backend)
-- Pas de policy DELETE → aucun rôle public/authenticated ne peut supprimer

-- ---------------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Helper : le merchant_id appartient à l'utilisateur connecté
-- Utilisé en SELECT, INSERT, UPDATE, DELETE

DROP POLICY IF EXISTS "categories_select_own" ON public.categories;
CREATE POLICY "categories_select_own"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = categories.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "categories_insert_own" ON public.categories;
CREATE POLICY "categories_insert_own"
  ON public.categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = categories.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "categories_update_own" ON public.categories;
CREATE POLICY "categories_update_own"
  ON public.categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = categories.merchant_id
        AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = categories.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "categories_delete_own" ON public.categories;
CREATE POLICY "categories_delete_own"
  ON public.categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = categories.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------------
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products_select_own" ON public.products;
CREATE POLICY "products_select_own"
  ON public.products
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = products.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "products_insert_own" ON public.products;
CREATE POLICY "products_insert_own"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = products.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "products_update_own" ON public.products;
CREATE POLICY "products_update_own"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = products.merchant_id
        AND merchants.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = products.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "products_delete_own" ON public.products;
CREATE POLICY "products_delete_own"
  ON public.products
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.merchants
      WHERE merchants.id = products.merchant_id
        AND merchants.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- PRODUCT_IMAGES
-- Accès via JOIN products → merchants → auth.uid()
-- ---------------------------------------------------------------------------
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "product_images_select_own" ON public.product_images;
CREATE POLICY "product_images_select_own"
  ON public.product_images
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_images.product_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "product_images_insert_own" ON public.product_images;
CREATE POLICY "product_images_insert_own"
  ON public.product_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_images.product_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "product_images_update_own" ON public.product_images;
CREATE POLICY "product_images_update_own"
  ON public.product_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_images.product_id
        AND m.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_images.product_id
        AND m.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "product_images_delete_own" ON public.product_images;
CREATE POLICY "product_images_delete_own"
  ON public.product_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.products p
      JOIN public.merchants m ON m.id = p.merchant_id
      WHERE p.id = product_images.product_id
        AND m.user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- ACCESS_SESSIONS
-- Aucun accès direct utilisateur — tout passe par les RPC SECURITY DEFINER.
-- Une policy restrictive est maintenue pour bloquer tout accès direct,
-- y compris en lecture (le token ne doit jamais être exposé directement).
-- ---------------------------------------------------------------------------
ALTER TABLE public.access_sessions ENABLE ROW LEVEL SECURITY;

-- Aucune policy créée = aucun rôle (anon, authenticated) ne peut
-- lire/écrire directement. Seul service_role (et les fonctions SECURITY
-- DEFINER) contournent le RLS.

-- ---------------------------------------------------------------------------
-- MERCHANT_APPLICATIONS
-- INSERT public anonyme autorisé.
-- SELECT / UPDATE / DELETE : réservés au service_role (backend admin).
-- ---------------------------------------------------------------------------
ALTER TABLE public.merchant_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "merchant_applications_insert_anon" ON public.merchant_applications;
CREATE POLICY "merchant_applications_insert_anon"
  ON public.merchant_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Pas de policy SELECT/UPDATE/DELETE → uniquement service_role peut lire/modifier.

-- ---------------------------------------------------------------------------
-- CATALOG_VISITS
-- INSERT : public (anon + authenticated) pour tracker les vues.
-- SELECT : marchand voit ses propres visites.
-- ---------------------------------------------------------------------------
ALTER TABLE public.catalog_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "catalog_visits_insert_public" ON public.catalog_visits;
CREATE POLICY "catalog_visits_insert_public"
  ON public.catalog_visits
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "catalog_visits_select_own" ON public.catalog_visits;
CREATE POLICY "catalog_visits_select_own"
  ON public.catalog_visits
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants
      WHERE user_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- CART_SUBMISSIONS
-- INSERT : public (anon + authenticated) pour les stats de panier.
-- SELECT : marchand voit ses propres soumissions.
-- ---------------------------------------------------------------------------
ALTER TABLE public.cart_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cart_submissions_insert_public" ON public.cart_submissions;
CREATE POLICY "cart_submissions_insert_public"
  ON public.cart_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "cart_submissions_select_own" ON public.cart_submissions;
CREATE POLICY "cart_submissions_select_own"
  ON public.cart_submissions
  FOR SELECT
  TO authenticated
  USING (
    merchant_id IN (
      SELECT id FROM public.merchants
      WHERE user_id = auth.uid()
    )
  );
