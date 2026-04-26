import { createClient } from "@supabase/supabase-js";

/**
 * Client admin (service_role) — uniquement côté serveur.
 * Ne jamais importer dans un composant client ou exposer au navigateur.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
