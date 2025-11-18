import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    return {
      title: 'Artikkel ikke funnet',
    };
  }

  const baseUrl = 'https://robust.iverfinne.no';
  const articleUrl = `${baseUrl}/artikkel/${article.slug}`;

  return {
    title: `${article.title} | Foreningen ROBUST`,
    description: article.excerpt || article.content?.substring(0, 160) || 'Les mer om degrowth og post-kapitalistiske fremtider',
    keywords: ['degrowth', 'post-kapitalisme', 'bærekraft', 'ROBUST', article.category, 'Norge'].filter(Boolean),
    authors: article.last_modified_by_username ? [{ name: article.last_modified_by_username }] : undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.content?.substring(0, 160),
      url: articleUrl,
      siteName: 'Foreningen ROBUST',
      images: article.featured_image_url ? [
        {
          url: article.featured_image_url,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : [],
      locale: 'no_NO',
      type: 'article',
      publishedTime: article.created_at,
      modifiedTime: article.updated_at,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.content?.substring(0, 160),
      images: article.featured_image_url ? [article.featured_image_url] : [],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) {
    notFound();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.featured_image_url,
    datePublished: article.created_at,
    dateModified: article.updated_at,
    author: article.last_modified_by_username ? {
      '@type': 'Person',
      name: article.last_modified_by_username,
    } : {
      '@type': 'Organization',
      name: 'Foreningen ROBUST',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Foreningen ROBUST',
      logo: {
        '@type': 'ImageObject',
        url: 'https://robust.iverfinne.no/robust-logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://robust.iverfinne.no/artikkel/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-[#ffc2c2]">
        <header className="bg-[#e3160b] py-6 px-6">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <Link 
              href="/" 
              className="flex items-center gap-3 text-white hover:text-[#ffc2c2] transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-['JetBrains_Mono',monospace] text-lg">Tilbake</span>
            </Link>
            <div className="w-12 h-12">
              <Image
                src="/robust-logo.png"
                alt="ROBUST Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
          </div>
        </header>

        <article className="max-w-[900px] mx-auto px-6 py-12">
          <div className="bg-white overflow-hidden shadow-sm">
            {article.featured_image_url && (
              <div className="aspect-video relative">
                <Image
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <h1 className="font-['JetBrains_Mono',monospace] text-[#e3160b] text-3xl md:text-4xl font-bold mb-6">
                {article.title}
              </h1>
              
              {article.excerpt && (
                <p className="font-['JetBrains_Mono',monospace] text-gray-600 text-lg mb-8 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
              
              <div className="font-['JetBrains_Mono',monospace] text-gray-800 prose prose-lg max-w-none">
                <ReactMarkdown>{article.content || ""}</ReactMarkdown>
              </div>
              
              <div className="mt-12 pt-6 border-t border-gray-200">
                <p className="font-['JetBrains_Mono',monospace] text-gray-500 text-sm">
                  Publisert: {new Date(article.created_at).toLocaleDateString('no-NO', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
