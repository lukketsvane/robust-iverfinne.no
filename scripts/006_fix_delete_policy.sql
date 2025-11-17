-- Update RLS policies to work without auth
-- Since we removed Supabase auth, we need to allow authenticated users
-- (those accessing via the anon key from the admin panel) to delete any article

-- Drop the restrictive delete policy that checks author_id
drop policy if exists "articles_delete_own" on articles;

-- Create a new delete policy that allows authenticated role to delete any article
-- This is safe because only admins will have access to the admin panel
create policy "articles_delete_authenticated" 
on articles 
for delete 
to authenticated 
using (true);

-- Also update the update policy to allow any authenticated user to update
drop policy if exists "articles_update_own" on articles;

create policy "articles_update_authenticated" 
on articles 
for update 
to authenticated 
using (true)
with check (true);
