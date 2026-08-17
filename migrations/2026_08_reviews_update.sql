-- 2026_08_reviews_update.sql
-- Run this in your Supabase SQL Editor

ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS time_ago TEXT,
ADD COLUMN IF NOT EXISTS review_image_url TEXT;
