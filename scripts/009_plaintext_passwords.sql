-- Delete existing users and recreate with plaintext passwords
delete from public.admin_users;

-- Rename password_hash column to just password
alter table public.admin_users 
  drop column if exists password_hash,
  add column if not exists password text not null default '';

-- Insert users with plaintext passwords
insert into public.admin_users (username, password, full_name) values
  ('iver', 'theodore kaczynski', 'Iver'),
  ('anna', 'arne næss', 'Anna'),
  ('sigrid', 'greta thunberg', 'Sigrid')
on conflict (username) do update 
  set password = excluded.password,
      full_name = excluded.full_name;
