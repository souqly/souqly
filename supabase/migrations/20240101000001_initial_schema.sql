-- =============================================================================
-- Migration : 20240101000001_initial_schema.sql
-- Description : Schéma initial — tables, extensions, triggers
-- Idempotent : utilise CREATE IF NOT EXISTS / DROP POLICY IF EXISTS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Extension pgcrypto (requise pour crypt(), gen_random_bytes())
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Fonction trigger updated_at (partagée par merchants et products)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- Table : merchants
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.merchants (
  id                    uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid        UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  slug                  text        UNIQUE NOT NULL,
  name                  text        NOT NULL,
  description           text,
  logo_url              text,
  status                text        NOT NULL DEFAULT 'pending'
                                    CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  access_code_hash      text        NOT NULL DEFAULT '',
  whatsapp_number       text,
  telegram_username     text,
  message_template      text        DEFAULT 'Bonjour, je souhaite commander :

{{products}}

Total : {{total}} €
Nom : {{client_name}}
Remarque : {{notes}}',
  subscription_status   text        NOT NULL DEFAULT 'trial'
                                    CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled')),
  stripe_customer_id    text,
  stripe_subscription_id text,
  trial_ends_at         timestamptz,
  is_super_admin        boolean     NOT NULL DEFAULT false,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- Trigger updated_at sur merchants
DROP TRIGGER IF EXISTS trg_merchants_updated_at ON public.merchants;
CREATE TRIGGER trg_merchants_updated_at
  BEFORE UPDATE ON public.merchants
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Index recommandés (demande performance-optimizer)
CREATE INDEX IF NOT EXISTS idx_merchants_slug       ON public.merchants (slug);
CREATE INDEX IF NOT EXISTS idx_merchants_user_id    ON public.merchants (user_id);
CREATE INDEX IF NOT EXISTS idx_merchants_status     ON public.merchants (status);

-- ---------------------------------------------------------------------------
-- Table : categories
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id      uuid        NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  slug             text        NOT NULL,
  position         int         NOT NULL DEFAULT 0,
  cover_image_url  text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (merchant_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_categories_merchant_id ON public.categories (merchant_id);

-- ---------------------------------------------------------------------------
-- Table : products
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id   uuid        NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  category_id   uuid        REFERENCES public.categories(id) ON DELETE SET NULL,
  name          text        NOT NULL,
  description   text,
  price_cents   int         NOT NULL DEFAULT 0,
  reference     text,
  is_available  boolean     NOT NULL DEFAULT true,
  position      int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Trigger updated_at sur products
DROP TRIGGER IF EXISTS trg_products_updated_at ON public.products;
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX IF NOT EXISTS idx_products_merchant_id  ON public.products (merchant_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id  ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_available ON public.products (merchant_id, is_available);

-- ---------------------------------------------------------------------------
-- Table : product_images
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid        NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path  text        NOT NULL,
  position      int         NOT NULL DEFAULT 0,
  is_primary    boolean     NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON public.product_images (product_id);

-- ---------------------------------------------------------------------------
-- Table : access_sessions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.access_sessions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id    uuid        NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  session_token  text        UNIQUE NOT NULL,
  ip_address     inet,
  user_agent     text,
  expires_at     timestamptz NOT NULL,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Index critique pour la validation des sessions (get_catalog)
CREATE INDEX IF NOT EXISTS idx_access_sessions_token      ON public.access_sessions (session_token);
CREATE INDEX IF NOT EXISTS idx_access_sessions_merchant   ON public.access_sessions (merchant_id);
CREATE INDEX IF NOT EXISTS idx_access_sessions_expires_at ON public.access_sessions (expires_at);

-- ---------------------------------------------------------------------------
-- Table : merchant_applications
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.merchant_applications (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        text        NOT NULL,
  business_name text,
  phone        text,
  message      text,
  status       text        NOT NULL DEFAULT 'pending'
                           CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at  timestamptz,
  reviewed_by  uuid,
  created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_merchant_applications_email  ON public.merchant_applications (email);
CREATE INDEX IF NOT EXISTS idx_merchant_applications_status ON public.merchant_applications (status);

-- ---------------------------------------------------------------------------
-- Table : catalog_visits
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.catalog_visits (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id  uuid        NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  visited_at   timestamptz NOT NULL DEFAULT now(),
  has_unlocked boolean     NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_catalog_visits_merchant_id ON public.catalog_visits (merchant_id);
CREATE INDEX IF NOT EXISTS idx_catalog_visits_visited_at  ON public.catalog_visits (merchant_id, visited_at);

-- ---------------------------------------------------------------------------
-- Table : cart_submissions
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cart_submissions (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id   uuid        NOT NULL REFERENCES public.merchants(id) ON DELETE CASCADE,
  product_count int         NOT NULL DEFAULT 0,
  total_cents   int         NOT NULL DEFAULT 0,
  channel       text        NOT NULL CHECK (channel IN ('whatsapp', 'telegram')),
  submitted_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_submissions_merchant_id  ON public.cart_submissions (merchant_id);
CREATE INDEX IF NOT EXISTS idx_cart_submissions_submitted_at ON public.cart_submissions (merchant_id, submitted_at);
