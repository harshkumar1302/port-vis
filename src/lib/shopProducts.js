import { supabase } from './supabaseClient';

const MISSING_TABLE = 'PGRST205';

/** Fetch shop merchandise; returns [] if shop_products table is not migrated yet. */
export async function fetchShopProducts({ activeOnly = false } = {}) {
  let query = supabase.from('shop_products').select('*').order('created_at', { ascending: false });
  if (activeOnly) query = query.eq('is_active', true);

  const { data, error } = await query;
  if (error) {
    if (error.code === MISSING_TABLE) return [];
    throw error;
  }
  return data || [];
}
