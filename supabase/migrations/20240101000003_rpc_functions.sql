-- =============================================================================
-- Migration : 20240101000003_rpc_functions.sql
-- Description : 4 fonctions RPC critiques de la plateforme Souqly
-- Toutes SECURITY DEFINER (justification par fonction ci-dessous)
-- search_path forcé à public,extensions pour éviter les injections de schema
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. unlock_catalog
--
-- SECURITY DEFINER justifié :
--   - Doit lire access_code_hash depuis merchants (protégé par RLS pour anon)
--   - Doit insérer dans access_sessions (aucune policy d'insertion pour anon)
--   - L'appelant est forcément anonyme (client final non connecté)
--   - La fonction implémente elle-même la validation (bcrypt + réponse générique)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unlock_catalog(
  merchant_slug   text,
  code_attempt    text,
  p_ip            inet    DEFAULT NULL,
  p_user_agent    text    DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_merchant     RECORD;
  v_session_token text;
  v_expires_at   timestamptz;
BEGIN
  -- 1. Récupère le marchand par slug, actif et abonnement valide
  SELECT id, access_code_hash
  INTO v_merchant
  FROM public.merchants
  WHERE slug = merchant_slug
    AND status = 'active'
    AND subscription_status IN ('trial', 'active');

  -- 2. Réponse générique si marchand inexistant OU code invalide
  --    On ne révèle jamais quelle condition a échoué (sécurité)
  IF NOT FOUND OR v_merchant.access_code_hash = '' THEN
    -- Exécuter quand même un crypt pour éviter le timing oracle
    PERFORM crypt(code_attempt, gen_salt('bf'));
    RETURN jsonb_build_object('error', 'invalid_credentials');
  END IF;

  -- 3. Vérification bcrypt — crypt() retourne le hash attendu si code correct
  IF crypt(code_attempt, v_merchant.access_code_hash) <> v_merchant.access_code_hash THEN
    RETURN jsonb_build_object('error', 'invalid_credentials');
  END IF;

  -- 4. Génère un token aléatoire 32 bytes encodé hex
  v_session_token := encode(gen_random_bytes(32), 'hex');
  v_expires_at    := now() + interval '24 hours';

  -- 5. Insère la session
  INSERT INTO public.access_sessions (
    merchant_id,
    session_token,
    ip_address,
    user_agent,
    expires_at
  ) VALUES (
    v_merchant.id,
    v_session_token,
    p_ip,
    p_user_agent,
    v_expires_at
  );

  -- 6. Retourne le token et l'expiration
  RETURN jsonb_build_object(
    'session_token', v_session_token,
    'expires_at',    v_expires_at
  );

EXCEPTION
  WHEN OTHERS THEN
    -- Ne jamais laisser remonter un détail d'erreur interne
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

-- Révocation : seul le rôle postgres (service_role) exécute en DEFINER context.
-- Les rôles anon et authenticated peuvent appeler la fonction.
REVOKE ALL ON FUNCTION public.unlock_catalog(text, text, inet, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.unlock_catalog(text, text, inet, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 2. get_catalog
--
-- SECURITY DEFINER justifié :
--   - Doit lire merchants, categories, products, product_images sans que
--     l'appelant (anon) soit le propriétaire de ces données
--   - La session valide constitue le seul mécanisme d'autorisation
--   - Le contenu n'est jamais exposé sans token valide et non expiré
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
    message_template
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

  -- 4. Construit le tableau de produits avec leurs images
  SELECT jsonb_agg(
    jsonb_build_object(
      'id',           p.id,
      'category_id',  p.category_id,
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

  -- 5. Retourne l'objet complet
  RETURN jsonb_build_object(
    'merchant',   jsonb_build_object(
                    'id',                v_merchant.id,
                    'slug',              v_merchant.slug,
                    'name',              v_merchant.name,
                    'description',       v_merchant.description,
                    'logo_url',          v_merchant.logo_url,
                    'whatsapp_number',   v_merchant.whatsapp_number,
                    'telegram_username', v_merchant.telegram_username,
                    'message_template',  v_merchant.message_template
                  ),
    'categories', COALESCE(v_categories, '[]'::jsonb),
    'products',   COALESCE(v_products,   '[]'::jsonb)
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

REVOKE ALL ON FUNCTION public.get_catalog(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_catalog(text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. submit_merchant_application
--
-- SECURITY DEFINER justifié :
--   - L'appelant est anonyme (anon) et n'a pas de droit d'INSERT direct sur
--     merchant_applications hors RLS (la policy RLS INSERT anon est présente,
--     mais la fonction offre en plus la validation email + déduplication spam).
--   - La RLS policy d'INSERT anon reste en place comme filet de sécurité.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_merchant_application(
  p_email         text,
  p_business_name text,
  p_phone         text,
  p_message       text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_new_id uuid;
BEGIN
  -- 1. Validation de l'email (non vide, contient @)
  IF p_email IS NULL OR trim(p_email) = '' OR position('@' IN p_email) = 0 THEN
    RETURN jsonb_build_object('error', 'invalid_email');
  END IF;

  -- 2. Vérifie qu'il n'existe pas déjà une demande 'pending' avec ce même email
  IF EXISTS (
    SELECT 1 FROM public.merchant_applications
    WHERE lower(email) = lower(trim(p_email))
      AND status = 'pending'
  ) THEN
    RETURN jsonb_build_object('error', 'already_applied');
  END IF;

  -- 3. Insertion
  INSERT INTO public.merchant_applications (
    email,
    business_name,
    phone,
    message,
    status
  ) VALUES (
    lower(trim(p_email)),
    trim(p_business_name),
    trim(p_phone),
    trim(p_message),
    'pending'
  )
  RETURNING id INTO v_new_id;

  RETURN jsonb_build_object(
    'success', true,
    'id',      v_new_id
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

REVOKE ALL ON FUNCTION public.submit_merchant_application(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_merchant_application(text, text, text, text) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. approve_merchant
--
-- SECURITY DEFINER justifié :
--   - Doit créer un utilisateur dans auth.users (schéma auth, inaccessible
--     aux rôles applicatifs)
--   - Doit vérifier is_super_admin (donnée sensible)
--   - Réservé aux super-admins via vérification en début de fonction
--
-- NOTE IMPORTANTE sur la création du user auth :
--   PostgreSQL ne peut pas appeler directement l'API Supabase Auth Admin.
--   La méthode supportée en SQL pur est d'insérer dans auth.users (Supabase
--   l'autorise depuis les fonctions SECURITY DEFINER avec le rôle postgres).
--   Pour la production, il est recommandé de déclencher cette fonction via
--   un Server Action (Next.js) avec le client supabase-admin (service_role)
--   qui appelle auth.admin.createUser() avant d'appeler cette RPC.
--   Cette fonction prend en paramètre le user_id déjà créé.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.approve_merchant(
  p_application_id  uuid,
  p_temp_password   text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_app          RECORD;
  v_merchant_id  uuid;
  v_user_id      uuid;
  v_slug         text;
  v_slug_base    text;
  v_slug_counter int := 0;
BEGIN
  -- 1. Vérifie que l'appelant est super_admin
  IF NOT EXISTS (
    SELECT 1 FROM public.merchants
    WHERE user_id = auth.uid()
      AND is_super_admin = true
  ) THEN
    RETURN jsonb_build_object('error', 'unauthorized');
  END IF;

  -- 2. Récupère la demande (doit être 'pending')
  SELECT id, email, business_name, phone
  INTO v_app
  FROM public.merchant_applications
  WHERE id = p_application_id
    AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'application_not_found');
  END IF;

  -- 3. Crée le user dans auth.users
  --    Supabase autorise l'insertion directe dans auth.users depuis une
  --    fonction SECURITY DEFINER exécutée par le rôle postgres (service_role).
  --    Le mot de passe est hashé par la fonction auth.crypt de Supabase.
  --
  --    Si cela échoue dans votre version de Supabase, utilisez le flow
  --    alternatif côté application (voir commentaire en en-tête).
  v_user_id := gen_random_uuid();

  INSERT INTO auth.users (
    id,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    role,
    aud,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    v_app.email,
    crypt(p_temp_password, gen_salt('bf')),
    now(),                                          -- email confirmé par défaut (admin a validé)
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('business_name', v_app.business_name),
    'authenticated',
    'authenticated',
    now(),
    now()
  );

  -- 4. Génère un slug unique depuis le nom du commerce
  v_slug_base := lower(
    regexp_replace(
      regexp_replace(
        unaccent_if_available(coalesce(v_app.business_name, v_app.email)),
        '[^a-z0-9\s-]', '', 'g'
      ),
      '[\s-]+', '-', 'g'
    )
  );

  -- Fallback si slug_base est vide
  IF v_slug_base = '' OR v_slug_base IS NULL THEN
    v_slug_base := 'boutique';
  END IF;

  -- Tronquer à 40 caractères max
  v_slug_base := left(v_slug_base, 40);

  -- Déduplication : ajoute un suffixe numérique si le slug existe déjà
  v_slug := v_slug_base;
  WHILE EXISTS (SELECT 1 FROM public.merchants WHERE slug = v_slug) LOOP
    v_slug_counter := v_slug_counter + 1;
    v_slug := v_slug_base || '-' || v_slug_counter;
  END LOOP;

  -- 5. Crée le merchant
  INSERT INTO public.merchants (
    user_id,
    slug,
    name,
    status,
    subscription_status,
    trial_ends_at,
    access_code_hash
  ) VALUES (
    v_user_id,
    v_slug,
    coalesce(v_app.business_name, v_app.email),
    'active',
    'trial',
    now() + interval '14 days',
    ''                           -- le marchand définira son code via dashboard
  )
  RETURNING id INTO v_merchant_id;

  -- 6. Met à jour la demande
  UPDATE public.merchant_applications
  SET
    status      = 'approved',
    reviewed_at = now(),
    reviewed_by = auth.uid()
  WHERE id = p_application_id;

  RETURN jsonb_build_object(
    'success',     true,
    'merchant_id', v_merchant_id,
    'user_id',     v_user_id,
    'slug',        v_slug
  );

EXCEPTION
  WHEN unique_violation THEN
    RETURN jsonb_build_object('error', 'email_already_exists');
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error', 'detail', SQLERRM);
END;
$$;

-- approve_merchant est réservé aux super-admins (vérification interne),
-- mais accessible aux authenticated pour que la fonction puisse appeler auth.uid().
REVOKE ALL ON FUNCTION public.approve_merchant(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.approve_merchant(uuid, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Fonction helper : unaccent_if_available
-- Supprime les accents si l'extension unaccent est disponible, sinon no-op.
-- Utilisée par approve_merchant pour générer des slugs propres.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unaccent_if_available(input text)
RETURNS text
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN unaccent(input);
EXCEPTION
  WHEN undefined_function THEN
    RETURN input;
END;
$$;

-- Active l'extension unaccent si disponible (sinon silencieusement ignoré)
CREATE EXTENSION IF NOT EXISTS unaccent;

-- ---------------------------------------------------------------------------
-- Fonction utilitaire : set_access_code
-- Permet à un marchand de définir/changer son code d'accès depuis le dashboard.
-- SECURITY INVOKER : l'appelant doit être authentifié et posséder le merchant.
-- La RLS sur merchants garantit que seul le propriétaire peut UPDATE.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_access_code(
  p_merchant_id  uuid,
  p_new_code     text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, extensions
AS $$
DECLARE
  v_hash text;
BEGIN
  -- Validation : code entre 4 et 20 caractères alphanumériques
  IF p_new_code IS NULL
     OR length(p_new_code) < 4
     OR length(p_new_code) > 20
     OR p_new_code !~ '^[a-zA-Z0-9]+$'
  THEN
    RETURN jsonb_build_object('error', 'invalid_code_format');
  END IF;

  -- Hash bcrypt
  v_hash := crypt(p_new_code, gen_salt('bf'));

  -- UPDATE (protégé par RLS : seul le propriétaire peut modifier)
  UPDATE public.merchants
  SET access_code_hash = v_hash
  WHERE id = p_merchant_id
    AND user_id = auth.uid();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'merchant_not_found_or_unauthorized');
  END IF;

  RETURN jsonb_build_object('success', true);

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

REVOKE ALL ON FUNCTION public.set_access_code(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.set_access_code(uuid, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- Fonction utilitaire : invalidate_all_sessions
-- Permet au marchand d'invalider toutes ses sessions actives (en cas de fuite).
-- SECURITY INVOKER : le marchand doit être authentifié et posséder le merchant.
-- SECURITY DEFINER non requis ici car on DELETE sur access_sessions via
-- service_role path — mais puisque RLS bloque l'accès anon/authenticated,
-- on utilise SECURITY DEFINER uniquement pour cet accès à access_sessions.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.invalidate_all_sessions(
  p_merchant_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_deleted_count int;
BEGIN
  -- Vérifie que le marchand appartient à l'appelant
  IF NOT EXISTS (
    SELECT 1 FROM public.merchants
    WHERE id = p_merchant_id
      AND user_id = auth.uid()
  ) THEN
    RETURN jsonb_build_object('error', 'unauthorized');
  END IF;

  DELETE FROM public.access_sessions
  WHERE merchant_id = p_merchant_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  RETURN jsonb_build_object(
    'success',         true,
    'sessions_deleted', v_deleted_count
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('error', 'internal_error');
END;
$$;

REVOKE ALL ON FUNCTION public.invalidate_all_sessions(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.invalidate_all_sessions(uuid) TO authenticated;
