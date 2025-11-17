import { NextRequest, NextResponse } from 'next/server';
import { validateCredentials } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = await validateCredentials(username, password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Ugyldig brukernavn eller passord' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    cookieStore.set('admin-session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { error: 'En feil oppstod' },
      { status: 500 }
    );
  }
}
