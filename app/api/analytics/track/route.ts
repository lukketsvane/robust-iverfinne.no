import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { path, referrer, userAgent } = await request.json()
    const supabase = await createClient()

    // Generate a simple visitor ID based on user agent and some random data
    const visitorId = `${userAgent?.slice(0, 50)}_${Date.now()}`

    // Track article views if it's an article page
    if (path.startsWith('/artikkel/')) {
      const slug = path.split('/artikkel/')[1]
      
      await supabase.from('article_views').insert({
        article_slug: slug,
        visitor_id: visitorId,
        referrer: referrer || null,
        user_agent: userAgent || null,
      })
    }

    // Track general page view
    const today = new Date().toISOString().split('T')[0]
    
    const { data: existing } = await supabase
      .from('site_analytics')
      .select('*')
      .eq('date', today)
      .eq('page_path', path)
      .maybeSingle()

    if (existing) {
      // Update existing entry
      await supabase
        .from('site_analytics')
        .update({
          page_views: existing.page_views + 1,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      // Create new entry
      await supabase.from('site_analytics').insert({
        date: today,
        page_path: path,
        page_views: 1,
        unique_visitors: 1,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Analytics tracking error:', error)
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}
