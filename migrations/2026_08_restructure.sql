-- Visheshkala restructure migration
-- Run in Supabase SQL Editor

-----------------------------------------------------------
-- 1. ARTWORKS TABLE — marketplace fields
-----------------------------------------------------------

ALTER TABLE public.artworks
  ADD COLUMN IF NOT EXISTS price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS is_bestseller BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sub_category TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER,
  ADD COLUMN IF NOT EXISTS stock INTEGER,
  ADD COLUMN IF NOT EXISTS listing_type TEXT;

-- Backfill: priced items → shop, everything else → gallery
UPDATE public.artworks
SET listing_type = 'shop'
WHERE (listing_type IS NULL OR listing_type = 'gallery')
  AND price IS NOT NULL
  AND price > 0;

UPDATE public.artworks
SET listing_type = 'gallery'
WHERE listing_type IS NULL;

-- Backfill is_featured from legacy string tags
UPDATE public.artworks
SET is_featured = true
WHERE is_featured = false
  AND (
    description ILIKE '%[FEATURED]%' OR
    title ILIKE '%[FEATURED]%' OR
    category ILIKE 'featured'
  );

-- Backfill sub_category from legacy [SubCategory: X] tags
UPDATE public.artworks
SET sub_category = (regexp_match(description, '\[SubCategory:\s*(.*?)\]'))[1]
WHERE sub_category IS NULL
  AND description ~ '\[SubCategory:\s*(.*?)\]';

-----------------------------------------------------------
-- 2. REVIEWS TABLE
-----------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT,
  verified BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Public Read Access" ON public.reviews;
CREATE POLICY "Allow Public Read Access"
  ON public.reviews FOR SELECT
  USING (true);

-- No public INSERT/UPDATE/DELETE — backend uses service role

-----------------------------------------------------------
-- 3. SITE SETTINGS — new rows
-----------------------------------------------------------

INSERT INTO public.site_settings (id, value)
VALUES (
  'announcement_bar',
  '{
    "enabled": true,
    "items": [
      { "icon": "🎁", "text": "Free Gift on Every Order" },
      { "icon": "🚚", "text": "Free Shipping Above ₹799" },
      { "icon": "✨", "text": "Handmade with Love — Limited Editions" }
    ]
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, value)
VALUES (
  'contact_channels',
  '{
    "instagram_url": "https://www.instagram.com/visheshkalaa/",
    "whatsapp_number": "917310956254",
    "whatsapp_message_template": "Hi! I am interested in {title}. Could you share more details?"
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.site_settings (id, value)
VALUES (
  'hero_stats',
  '{
    "handmade_pct": 100,
    "happy_homes": 500,
    "rating": 5
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;
