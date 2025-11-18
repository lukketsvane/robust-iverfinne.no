import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Ugyldig e-postadresse' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        ip_address: ip,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      // Check if email already exists
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Denne e-postadressen er allerede registrert' },
          { status: 409 }
        );
      }
      console.error('Newsletter subscription error:', error);
      return NextResponse.json(
        { error: 'Kunne ikke registrere e-postadresse' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json(
      { error: 'Intern serverfeil' },
      { status: 500 }
    );
  }
}
