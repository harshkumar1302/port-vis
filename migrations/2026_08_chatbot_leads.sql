create table if not exists
  public.chatbot_leads (
    id uuid not null default gen_random_uuid (),
    name text null,
    contact_info text null,
    message text not null,
    status text not null default 'new'::text,
    created_at timestamp with time zone not null default now(),
    constraint chatbot_leads_pkey primary key (id)
  );

-- Enable RLS
alter table public.chatbot_leads enable row level security;

-- Policies for anon
create policy "Allow anonymous inserts to chatbot_leads" on public.chatbot_leads for insert to anon with check (true);

-- Policies for authenticated
create policy "Allow auth users full access to chatbot_leads" on public.chatbot_leads for all to authenticated using (true);
