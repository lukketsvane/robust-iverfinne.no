import { createClient } from '@/lib/supabase/server';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  
  // Fetch all published articles
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at, created_at')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  const baseUrl = 'https://robust.iverfinne.no';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/om-oss`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/prosjekter`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/i-media`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ];

  // Dynamic article pages
  const articlePages = (articles || []).map((article) => ({
    url: `${baseUrl}/artikkel/${article.slug}`,
    lastModified: new Date(article.updated_at || article.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticPages, ...articlePages];
}
