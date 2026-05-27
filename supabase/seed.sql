-- =============================================================================
-- Seed Souqly — 1 marchand complet pour le développement
-- Marchand : boutique-test · Code d'accès : demo1234
-- À exécuter dans Supabase Dashboard → SQL Editor
-- =============================================================================

-- ─── 0. NETTOYAGE ─────────────────────────────────────────────────────────────
DELETE FROM public.cart_submissions;
DELETE FROM public.catalog_visits;
DELETE FROM public.access_sessions;
DELETE FROM public.product_images;
DELETE FROM public.products;
DELETE FROM public.brands;
DELETE FROM public.categories;
DELETE FROM public.merchant_applications;
DELETE FROM public.merchants;

-- ─── 1. MARCHAND ──────────────────────────────────────────────────────────────
INSERT INTO public.merchants (
  id, user_id, slug, name, description,
  status, access_code_hash,
  whatsapp_number, telegram_username,
  message_template,
  subscription_status, trial_ends_at, is_super_admin,
  click_and_collect_enabled,
  self_delivery_enabled, self_delivery_city, self_delivery_price_cents,
  colissimo_enabled, colissimo_price_cents,
  activity_type, catalog_theme,
  created_at, updated_at
) VALUES (
  'aaaa0001-0000-0000-0000-000000000000',
  NULL,
  'boutique-test',
  'Boutique Test Mode',
  'Catalogue de démonstration — mode femme, accessoires et chaussures tendance. Nouvelles collections chaque saison.',
  'active',
  crypt('demo1234', gen_salt('bf')),
  '+33600000001',
  'boutique_test',
  E'Bonjour, je souhaite commander :\n\n{{products}}\n\nTotal : {{total}} €\nNom : {{client_name}}\nRemarque : {{notes}}',
  'active',
  now() + interval '365 days',
  false,
  true,
  true, 'Paris 75', 499,
  true, 699,
  'mode-femme',
  'indigo-pro',
  now(), now()
);

-- ─── 2. CATÉGORIES (6) ────────────────────────────────────────────────────────
INSERT INTO public.categories (id, merchant_id, name, slug, position) VALUES
  ('bbbb0001-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Vêtements',            'vetements',           0),
  ('bbbb0002-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Chaussures',           'chaussures',          1),
  ('bbbb0003-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Sacs & Accessoires',   'sacs-accessoires',    2),
  ('bbbb0004-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Robes & Combinaisons', 'robes-combinaisons',  3),
  ('bbbb0005-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Manteaux & Vestes',    'manteaux-vestes',     4),
  ('bbbb0006-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Lingerie & Homewear',  'lingerie-homewear',   5);

-- ─── 3. MARQUES (4) ───────────────────────────────────────────────────────────
INSERT INTO public.brands (id, merchant_id, name, slug, position) VALUES
  ('cccc0001-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Zara',  'zara',  0),
  ('cccc0002-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'H&M',   'hm',    1),
  ('cccc0003-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Mango', 'mango', 2),
  ('cccc0004-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'Only',  'only',  3);

-- ─── 4. PRODUITS (48) ─────────────────────────────────────────────────────────
-- Colonnes : id, merchant_id, category_id, brand_id, name, description, price_cents, reference, is_available, position

-- VÊTEMENTS (cat 1) ─────────────────────────────────────────────────────────
INSERT INTO public.products (id, merchant_id, category_id, brand_id, name, description, price_cents, reference, is_available, position) VALUES

('dddd0001-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Veste Satin Noir', 'Veste oversize en satin brillant, coupe droite, col V. Idéale pour les soirées.', 8900, 'VET-001', true, 0),

('dddd0002-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Pantalon Large Camel', 'Pantalon taille haute, coupe palazzo, tissu fluide. Disponible en XS au XL.', 6500, 'VET-002', true, 1),

('dddd0003-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Chemise Lin Blanc Cassé', 'Chemise en lin lavé, manches longues retroussables, col officier.', 4900, 'VET-003', true, 2),

('dddd0004-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Blazer Oversize Taupe', 'Blazer à épaulettes, double boutonnage, doublure satinée. Coupe boyfriend.', 9500, 'VET-004', true, 3),

('dddd0005-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Sweat Crop Écru', 'Sweat court en coton brossé, col rond, poignets côtelés. Léger et confortable.', 3900, 'VET-005', true, 4),

('dddd0006-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Top Bustier Corset Noir', 'Top bustier avec baleinage doux, bretelles réglables, fermeture zip dos.', 5500, 'VET-006', true, 5),

('dddd0007-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Jean Taille Haute Délavé', 'Jean coupe droite, taille haute, délavé clair. Fermeture boutons métal.', 7200, 'VET-007', true, 6),

('dddd0008-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0001-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'T-Shirt Oversize Graphique', 'T-shirt large à imprimé sérigraphié, col rond, coton 100 %. Unisexe.', 2900, 'VET-008', false, 7),

-- CHAUSSURES (cat 2) ─────────────────────────────────────────────────────────
('dddd0009-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Sneakers Plateforme Blanche', 'Sneakers chunky avec semelle épaisse 5 cm, cuir synthétique, lacets plats.', 9500, 'CHA-001', true, 0),

('dddd0010-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Mules Cuir Cognac', 'Mules en cuir véritable couleur cognac, semelle liège, bout carré.', 11500, 'CHA-002', true, 1),

('dddd0011-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Bottines Chelsea Noires', 'Bottines élastiquées style Chelsea, talon bloc 4 cm, semelle crantée.', 13900, 'CHA-003', true, 2),

('dddd0012-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Sandales Talon Bloc Nude', 'Sandales à bride cheville, talon bloc 7 cm, bout ouvert. Coloris nude mat.', 7900, 'CHA-004', true, 3),

('dddd0013-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Baskets Chunky Beige', 'Baskets style années 90, semelle crantée surélevée, matière mixte.', 8500, 'CHA-005', true, 4),

('dddd0014-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Escarpins Pointus Bordeaux', 'Escarpins à bout pointu, talon aiguille 9 cm, cuir verni bordeaux.', 10900, 'CHA-006', true, 5),

('dddd0015-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Mocassins Loafer Noirs', 'Mocassins à chaîne dorée, cuir grainé, semelle cuir. Classique chic.', 8900, 'CHA-007', false, 6),

('dddd0016-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0002-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Bottes Cavalières Cognac', 'Bottes hautes à zippage intérieur, cuir lisse cognac, talon 3 cm.', 18900, 'CHA-008', true, 7),

-- SACS & ACCESSOIRES (cat 3) ──────────────────────────────────────────────────
('dddd0017-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Sac Bandoulière Mini Beige', 'Mini sac en cuir PU, bandoulière réglable, fermeture dorée, 3 compartiments.', 5500, 'ACC-001', true, 0),

('dddd0018-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Sac Tote Cuir Cognac', 'Grand sac cabas en cuir PU souple, anses doubles, fermeture magnétique.', 12900, 'ACC-002', true, 1),

('dddd0019-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Ceinture Large Tressée', 'Ceinture tressée en cuir végétal, largeur 4 cm, boucle argentée. Tailles S-M-L.', 3200, 'ACC-003', true, 2),

('dddd0020-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Chapeau Bob Paille Naturelle', 'Bob en paille naturelle tressée, bord large 6 cm, ruban satiné noir.', 2800, 'ACC-004', true, 3),

('dddd0021-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Lunettes Soleil Carrées Noires', 'Montures oversize carrées, verres miroir fumé, branches acétate.', 2500, 'ACC-005', true, 4),

('dddd0022-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Foulard Satin Imprimé', 'Carré en satin polyester 90×90 cm, imprimé baroque, bords roulottés.', 1900, 'ACC-006', true, 5),

('dddd0023-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Sac Clutch Doré Soirée', 'Pochette soirée en tissu métallisé doré, fermoir clic-clac, chaîne amovible.', 3900, 'ACC-007', true, 6),

('dddd0024-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0003-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Collier Perles d''Eau Douce', 'Collier ras de cou, perles semi-rondes 6mm, fermoir argent 925.', 4900, 'ACC-008', true, 7),

-- ROBES & COMBINAISONS (cat 4) ────────────────────────────────────────────────
('dddd0025-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Robe Midi Imprimé Fleuri', 'Robe mi-longue à imprimé floral, bretelles fines, dos nu, taille élastiquée.', 7200, 'ROB-001', true, 0),

('dddd0026-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Combinaison Palazzo Noir', 'Combinaison à jambes larges, bustier drapé, dos croisé. Effet pantalon palazzo.', 8900, 'ROB-002', true, 1),

('dddd0027-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Robe Courte Plumetis Blanc', 'Robe courte en plumetis brodé, col Claudine, manches courtes bouffantes.', 5500, 'ROB-003', true, 2),

('dddd0028-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Robe Longue Bohème Écru', 'Robe maxi à fines bretelles, imprimé bohème, volant bas de jupe. Légère.', 9900, 'ROB-004', true, 3),

('dddd0029-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Robe Maille Côtelée Camel', 'Robe en maille côtelée extensible, col roulé, manches longues, mi-longue.', 6500, 'ROB-005', true, 4),

('dddd0030-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Robe Slip Satin Taupe', 'Robe nuisette en satin, fines bretelles, dentelle à l''encolure. Effet lingerie chic.', 7900, 'ROB-006', true, 5),

('dddd0031-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Combinaison Short Rayée', 'Combinaison courte à rayures marine, bretelles larges, poches latérales.', 4900, 'ROB-007', false, 6),

('dddd0032-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0004-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Robe Portefeuille Fleurie', 'Robe portefeuille à fleurs, cache-cœur, ceinture nouée, jambes croisées.', 6200, 'ROB-008', true, 7),

-- MANTEAUX & VESTES (cat 5) ───────────────────────────────────────────────────
('dddd0033-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Trench Coat Camel Ceinturé', 'Trench classique double boutonnage, ceinture, col cranté. Coton sergé.', 15900, 'MAN-001', true, 0),

('dddd0034-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Veste Jean Délavé Clair', 'Veste en denim délavé, poches plaquées, coupe droite. Tendance casual.', 7900, 'MAN-002', true, 1),

('dddd0035-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Manteau Laine Crème', 'Manteau long en laine mélangée, col châle, fermeture boutons écaille.', 19900, 'MAN-003', true, 2),

('dddd0036-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Perfecto Simili Cuir Noir', 'Veste motard en simili cuir premium, zip YKK, empiècements matelassés.', 12500, 'MAN-004', true, 3),

('dddd0037-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Veste Tweed Rose Poudré', 'Veste courte en tweed chiné rose, boutons dorés, doublure satinée.', 13900, 'MAN-005', true, 4),

('dddd0038-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Manteau Carreaux Prince de Galles', 'Manteau mi-long à carreaux bicolores, col revers, boutonnage simple.', 17900, 'MAN-006', true, 5),

('dddd0039-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Blouson Teddy Sherpa Noir', 'Blouson teddy avec col et poignets sherpa, fermeture zip, coupe cintrée.', 9900, 'MAN-007', true, 6),

('dddd0040-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0005-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Imperméable Court Transparent', 'Imper court vinyle transparent, col droit, boutonnage pression, doublure légère.', 8900, 'MAN-008', false, 7),

-- LINGERIE & HOMEWEAR (cat 6) ─────────────────────────────────────────────────
('dddd0041-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Ensemble Satin Ivoire', 'Set brassière + shorty satin doux, dentelle écosse, bretelles fines. XS-XL.', 4900, 'LIN-001', true, 0),

('dddd0042-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Body Dentelle Noir', 'Body string en dentelle fine, bretelles réglables, fermeture pression entrejambe.', 3900, 'LIN-002', true, 1),

('dddd0043-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Pyjama Long Flanelle Rose', 'Pyjama deux pièces en flanelle douce, imprimé à carreaux, élastique taille.', 5500, 'LIN-003', true, 2),

('dddd0044-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Nuisette Soie Lavande', 'Nuisette courte en soie naturelle, fines bretelles, bordure dentelle, légère.', 6900, 'LIN-004', true, 3),

('dddd0045-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0002-0000-0000-0000-000000000000',
 'Robe de Chambre Polaire Blush', 'Peignoir long en polaire douce, ceinture, poches, col châle. Ultra cosy.', 4200, 'LIN-005', true, 4),

('dddd0046-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0001-0000-0000-0000-000000000000',
 'Bralette Brodée Terracotta', 'Bralette sans armatures, broderies florales, bretelles croisées dos. S-L.', 2900, 'LIN-006', true, 5),

('dddd0047-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0003-0000-0000-0000-000000000000',
 'Ensemble Coton Bio Côtelé', 'Brassière + legging court côtelés en coton bio, confortables pour la maison.', 3500, 'LIN-007', true, 6),

('dddd0048-0000-0000-0000-000000000000', 'aaaa0001-0000-0000-0000-000000000000', 'bbbb0006-0000-0000-0000-000000000000', 'cccc0004-0000-0000-0000-000000000000',
 'Short + Crop Homewear Beige', 'Set loungewear, crop top manches courtes + short taille élastiquée. Coton.', 2800, 'LIN-008', false, 7);

-- ─── 5. SESSION D'ACCÈS (token valide 30 jours) ───────────────────────────────
-- Token de test : demo-session-boutique-test-valid-token-00000001
INSERT INTO public.access_sessions (merchant_id, session_token, expires_at)
VALUES (
  'aaaa0001-0000-0000-0000-000000000000',
  'demo-session-boutique-test-valid-token-00000001',
  now() + interval '30 days'
);

-- ─── 6. ANALYTICS — catalog_visits (300 visites sur 90 jours) ─────────────────
DO $$
DECLARE i int;
BEGIN
  FOR i IN 1..300 LOOP
    INSERT INTO public.catalog_visits (merchant_id, visited_at, has_unlocked)
    VALUES (
      'aaaa0001-0000-0000-0000-000000000000',
      now() - (floor(random() * 90)::int || ' days')::interval
            - (floor(random() * 86400)::int || ' seconds')::interval,
      random() > 0.35
    );
  END LOOP;
END;
$$;

-- ─── 7. ANALYTICS — cart_submissions (60 commandes sur 90 jours) ──────────────
DO $$
DECLARE
  i            int;
  channels     text[] := ARRAY['whatsapp','telegram'];
  deliveries   text[] := ARRAY['click_and_collect','self_delivery','colissimo','colissimo','click_and_collect'];
BEGIN
  FOR i IN 1..60 LOOP
    INSERT INTO public.cart_submissions (
      merchant_id, product_count, total_cents, channel, submitted_at, delivery_method
    ) VALUES (
      'aaaa0001-0000-0000-0000-000000000000',
      floor(random() * 5 + 1)::int,
      floor(random() * 60000 + 1500)::int,
      channels[floor(random() * 2 + 1)::int],
      now() - (floor(random() * 90)::int || ' days')::interval
            - (floor(random() * 86400)::int || ' seconds')::interval,
      deliveries[floor(random() * 5 + 1)::int]
    );
  END LOOP;
END;
$$;

-- ─── 8. CANDIDATURES MARCHANDS (5 exemples) ───────────────────────────────────
INSERT INTO public.merchant_applications (email, business_name, phone, message, status) VALUES
  ('camille.dubois@exemple.fr',   'La Belle Boutique',     '+33611223344', 'Je vends des créations artisanales locales depuis 3 ans. Souqly est la plateforme idéale.', 'pending'),
  ('thomas.martin@exemple.fr',    'Mode & Style Paris',    '+33622334455', 'Revendeur de marques mode femme. Stock important, livraison rapide.', 'pending'),
  ('sofia.garcia@exemple.fr',     'Bijoux Artisanaux',     '+33633445566', 'Créatrice de bijoux faits main, matières naturelles et pierres semi-précieuses.', 'pending'),
  ('marc.lefebvre@exemple.fr',    'Sneakers Palace',       '+33644556677', 'Spécialiste sneakers neuves et occasion. Authentification garantie.', 'approved'),
  ('amina.benali@exemple.fr',     'Couture Traditionnelle','+33655667788', 'Tenues traditionnelles et modernes sur mesure. Vente en ligne souhaitée.', 'rejected');

-- ─── 9. VÉRIFICATION ──────────────────────────────────────────────────────────
DO $$
DECLARE
  v_merchants  int; v_cats int; v_brands int;
  v_products   int; v_visits int; v_carts int;
BEGIN
  SELECT count(*) INTO v_merchants FROM public.merchants;
  SELECT count(*) INTO v_cats      FROM public.categories;
  SELECT count(*) INTO v_brands    FROM public.brands;
  SELECT count(*) INTO v_products  FROM public.products;
  SELECT count(*) INTO v_visits    FROM public.catalog_visits;
  SELECT count(*) INTO v_carts     FROM public.cart_submissions;

  RAISE NOTICE '✓ Seed OK — marchands: % · catégories: % · marques: % · produits: % · visites: % · commandes: %',
    v_merchants, v_cats, v_brands, v_products, v_visits, v_carts;
END;
$$;
