-- Shop merchandise table (studio products separate from portfolio artworks)
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.shop_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Merchandise',
  image_url TEXT,
  user_id UUID,
  price NUMERIC(10, 2),
  original_price NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  stock INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shop_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Read Access" ON public.shop_products;
CREATE POLICY "Allow Public Read Access"
  ON public.shop_products FOR SELECT
  USING (true);

-- Writes go through /api/manage-shop with service role
