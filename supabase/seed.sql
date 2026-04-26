-- =============================================================================
-- Seed : supabase/seed.sql
-- Description : Données de test pour l'environnement de développement local
--
-- IMPORTANT : Les utilisateurs auth.users ne sont PAS créés ici.
-- En développement local, créer le user via Supabase Studio ou CLI :
--   supabase auth create --email admin@test.com --password test1234
-- Puis noter le UUID généré et remplacer TEST_USER_ID ci-dessous si besoin.
--
-- Le merchant de test utilise un UUID fixe pour la reproductibilité.
-- Le code d'accès en clair est : test1234
-- =============================================================================

-- Nettoyage idempotent (ordre inverse des FK)
DELETE FROM public.product_images   WHERE product_id IN (
  SELECT id FROM public.products WHERE merchant_id = '11111111-1111-1111-1111-111111111111'
);
DELETE FROM public.products          WHERE merchant_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.categories        WHERE merchant_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.access_sessions   WHERE merchant_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.catalog_visits    WHERE merchant_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.cart_submissions  WHERE merchant_id = '11111111-1111-1111-1111-111111111111';
DELETE FROM public.merchants         WHERE id          = '11111111-1111-1111-1111-111111111111';

-- ---------------------------------------------------------------------------
-- Marchand de test
-- user_id NULL : en local, sera lié manuellement via Studio.
-- code d'accès "test1234" hashé avec bcrypt (gen_salt par défaut = bf, 8 rounds)
-- ---------------------------------------------------------------------------
INSERT INTO public.merchants (
  id,
  user_id,
  slug,
  name,
  description,
  status,
  access_code_hash,
  whatsapp_number,
  telegram_username,
  subscription_status,
  trial_ends_at,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  NULL,
  'boutique-test',
  'Boutique Test Mode',
  'Catalogue de démonstration — vêtements, chaussures et accessoires tendance.',
  'active',
  crypt('test1234', gen_salt('bf')),
  '+33600000000',
  'souqly_demo',
  'trial',
  now() + interval '14 days',
  false,
  now(),
  now()
);

-- ---------------------------------------------------------------------------
-- Catégories (3)
-- ---------------------------------------------------------------------------
INSERT INTO public.categories (id, merchant_id, name, slug, position) VALUES
  ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Vêtements',   'vetements',   0),
  ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Chaussures',  'chaussures',  1),
  ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Accessoires', 'accessoires', 2);

-- ---------------------------------------------------------------------------
-- Produits (10) — 8 disponibles, 2 indisponibles
-- Prix en centimes (EUR)
-- ---------------------------------------------------------------------------
INSERT INTO public.products (
  id, merchant_id, category_id, name, description,
  price_cents, reference, is_available, position
) VALUES

-- Vêtements (4 produits)
(
  'aaaa0001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Veste Satin Noir',
  'Veste oversize en satin brillant, coupe droite, col V. Idéale pour les soirées.',
  8900, 'VET-001', true, 0
),
(
  'aaaa0001-0000-0000-0000-000000000002',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Pantalon Large Camel',
  'Pantalon taille haute, coupe palazzo, tissu fluide. Disponible en XS au XL.',
  6500, 'VET-002', true, 1
),
(
  'aaaa0001-0000-0000-0000-000000000003',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Chemise Lin Blanc Cassé',
  'Chemise en lin lavé, manches longues retroussables, col officier.',
  4900, 'VET-003', true, 2
),
(
  'aaaa0001-0000-0000-0000-000000000004',
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  'Robe Midi Imprimé Fleuri',
  'Robe mi-longue à imprimé floral, bretelles fines, dos nu. Rupture de stock.',
  7200, 'VET-004', false, 3  -- indisponible
),

-- Chaussures (3 produits)
(
  'aaaa0001-0000-0000-0000-000000000005',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'Sneakers Plateforme Blanche',
  'Sneakers chunky avec semelle épaisse 5 cm, cuir synthétique, lacets plats.',
  9500, 'CHA-001', true, 0
),
(
  'aaaa0001-0000-0000-0000-000000000006',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'Mules Mules Cuir Cognac',
  'Mules en cuir véritable couleur cognac, semelle liège, bout carré.',
  11500, 'CHA-002', true, 1
),
(
  'aaaa0001-0000-0000-0000-000000000007',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'Bottines Chelsea Noires',
  'Bottines élastiquées style Chelsea, talon bloc 4 cm, semelle crantée. Dernières pièces.',
  13900, 'CHA-003', false, 2  -- indisponible
),

-- Accessoires (3 produits)
(
  'aaaa0001-0000-0000-0000-000000000008',
  '11111111-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  'Sac Bandoulière Mini Beige',
  'Mini sac en cuir PU, bandoulière réglable, fermeture dorée, 3 compartiments.',
  5500, 'ACC-001', true, 0
),
(
  'aaaa0001-0000-0000-0000-000000000009',
  '11111111-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  'Ceinture Large Tressée',
  'Ceinture tressée en cuir végétal, largeur 4 cm, boucle argentée. Tailles S-M-L.',
  3200, 'ACC-002', true, 1
),
(
  'aaaa0001-0000-0000-0000-000000000010',
  '11111111-1111-1111-1111-111111111111',
  '44444444-4444-4444-4444-444444444444',
  'Chapeau Bob Paille Naturelle',
  'Bob en paille naturelle tressée, bord large 6 cm, ruban satiné noir.',
  2800, 'ACC-003', true, 2
);

-- ---------------------------------------------------------------------------
-- Vérification rapide (affiché lors du seed)
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  v_merchant_count int;
  v_product_count  int;
  v_cat_count      int;
BEGIN
  SELECT count(*) INTO v_merchant_count FROM public.merchants  WHERE id = '11111111-1111-1111-1111-111111111111';
  SELECT count(*) INTO v_product_count  FROM public.products   WHERE merchant_id = '11111111-1111-1111-1111-111111111111';
  SELECT count(*) INTO v_cat_count      FROM public.categories WHERE merchant_id = '11111111-1111-1111-1111-111111111111';

  RAISE NOTICE 'Seed OK — merchants: %, categories: %, products: %',
    v_merchant_count, v_cat_count, v_product_count;
END;
$$;
