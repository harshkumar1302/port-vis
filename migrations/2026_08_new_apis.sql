-- Contact form submissions
create table if not exists public.contact_enquiries (
  id uuid not null default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint contact_enquiries_pkey primary key (id)
);

alter table public.contact_enquiries enable row level security;

-- Newsletter waitlist
create table if not exists public.newsletter_subscribers (
  id uuid not null default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint newsletter_subscribers_pkey primary key (id),
  constraint newsletter_subscribers_email_key unique (email)
);

alter table public.newsletter_subscribers enable row level security;

-- Cart / checkout order intents
create table if not exists public.cart_enquiries (
  id uuid not null default gen_random_uuid(),
  name text null,
  contact_info text null,
  items jsonb not null default '[]'::jsonb,
  total numeric null,
  notes text null,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  constraint cart_enquiries_pkey primary key (id)
);

alter table public.cart_enquiries enable row level security;
