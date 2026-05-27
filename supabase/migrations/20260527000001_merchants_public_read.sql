-- =============================================================================
-- Migration : 20260527000001_merchants_public_read.sql
-- Fix : les visiteurs anonymes ne pouvaient pas voir les infos publiques
--       d'un marchand actif → page "Catalogue indisponible" au lieu du
--       formulaire de code d'accès.
--
-- SÉCURITÉ : on n'accorde PAS de SELECT sur la table merchants à anon
-- (qui exposerait access_code_hash, stripe_customer_id, is_super_admin…).
-- On crée à la place une vue restreinte aux seules colonnes publiques.
-- =============================================================================

-- Vue publique : uniquement les colonnes non-sensibles des marchands actifs.
-- access_code_hash, stripe_*, is_super_admin, user_id, message_template
-- ne sont JAMAIS inclus.
CREATE OR REPLACE VIEW public.merchants_public AS
  SELECT
    id,
    slug,
    name,
    description,
    logo_url,
    status,
    subscription_status,
    whatsapp_number,
    telegram_username,
    catalog_theme,
    activity_type
  FROM public.merchants
  WHERE status = 'active';

-- Accorder SELECT sur la vue uniquement (pas sur la table)
GRANT SELECT ON public.merchants_public TO anon, authenticated;
