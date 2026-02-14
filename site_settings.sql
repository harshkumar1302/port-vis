-- Create a table for site-wide settings
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Allow Public Read Access"
ON public.site_settings FOR SELECT
USING (true);

-- Insert initial category_priorities setting if it doesn't exist
INSERT INTO public.site_settings (id, value)
VALUES ('category_priorities', '{}')
ON CONFLICT (id) DO NOTHING;
