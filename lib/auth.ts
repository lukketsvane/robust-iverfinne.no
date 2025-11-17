import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';

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
    .select('id, username, password_hash, full_name')
    .eq('username', username)
    .single();

  if (error || !user) {
    return null;
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  
  if (!isValid) {
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
