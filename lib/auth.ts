import { createClient } from '@/lib/supabase/server';

export type AdminUser = {
  id: string;
  username: string;
  full_name: string | null;
};

export async function validateCredentials(
  username: string, 
  password: string
): Promise<AdminUser | null> {
  const supabase = await createClient();
  
  const { data: user, error } = await supabase
    .from('admin_users')
    .select('id, username, password, full_name')
    .eq('username', username)
    .single();

  if (error || !user) {
    return null;
  }

  if (password !== user.password) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name
  };
}

export async function getUserFromSession(sessionData: string): Promise<AdminUser | null> {
  try {
    const userData = JSON.parse(sessionData);
    return userData as AdminUser;
  } catch {
    return null;
  }
}
