-- SECURITY FIX: Enable RLS and set proper policies
-- Run this in your Supabase SQL Editor

-----------------------------------------------------------
-- 1. ARTWORKS TABLE
-----------------------------------------------------------

-- Enable RLS
alter table public.artworks enable row level security;

-- Drop existing unsafe "Always True" policies if they exist
-- (Replace 'Anyone can insert art' and 'Anyone can delete art' with whatever names you see in Supabase)
drop policy if exists "Anyone can insert art" on public.artworks;
drop policy if exists "Anyone can delete art" on public.artworks;
drop policy if exists "Public Access" on public.artworks;

-- Create a policy to allow ANYONE to view artworks (Public Read)
create policy "Allow Public Read Access"
on public.artworks for select
using (true);

-- No public INSERT/UPDATE/DELETE policies are needed 
-- because our backend API uses the Service Role Key which bypasses RLS.


-----------------------------------------------------------
-- 2. ADMIN AUTH TABLE
-----------------------------------------------------------

-- Enable RLS
alter table public.admin_auth enable row level security;

-- Ensure NO public access (backend only via Service Role)
drop policy if exists "Allow Public select" on public.admin_auth;


-----------------------------------------------------------
-- 3. PASSWORD RESET TOKENS TABLE
-----------------------------------------------------------

-- Enable RLS
alter table public.password_reset_tokens enable row level security;

-- Ensure NO public access (backend only via Service Role)
drop policy if exists "Allow Public select" on public.password_reset_tokens;


-----------------------------------------------------------
-- FINAL STEP: Verify
-----------------------------------------------------------
-- After running this, the "Security Advisor" warnings for 
-- "RLS Policy Always True" and "RLS Disabled" should disappear.
