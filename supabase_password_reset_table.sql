-- Password Reset Tokens Table
-- Run this SQL in your Supabase SQL Editor

create table if not exists password_reset_tokens (
  id bigint primary key generated always as identity,
  email text not null,
  token text unique not null,
  expires_at timestamp with time zone not null,
  used boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for faster lookups
create index if not exists idx_password_reset_tokens_token on password_reset_tokens(token);
create index if not exists idx_password_reset_tokens_email on password_reset_tokens(email);

-- Optional: Add RLS (Row Level Security) policies if needed
-- alter table password_reset_tokens enable row level security;
