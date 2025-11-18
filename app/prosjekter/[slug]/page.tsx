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
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) {
    return {
      title: 'Prosjekt ikke funnet',
    };
  }

  const baseUrl = 'https://robust.iverfinne.no';
  const projectUrl = `${baseUrl}/prosjekter/${project.slug}`;

  return {
    title: `${project.title} | Foreningen ROBUST`,
    description: project.description || project.content?.substring(0, 160) || 'Et ROBUST prosjekt for degrowth og post-kapitalistiske fremtider',
    keywords: ['degrowth', 'post-kapitalisme', 'bærekraft', 'ROBUST', 'prosjekt', 'Norge'].filter(Boolean),
    openGraph: {
      title: project.title,
      description: project.description || project.content?.substring(0, 160),
      url: projectUrl,
      siteName: 'Foreningen ROBUST',
      images: project.featured_image_url ? [
        {
          url: project.featured_image_url,
          width: 1200,
          height: 630,
          alt: project.title,
        }
      ] : [],
      locale: 'no_NO',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: project.title,
      description: project.description || project.content?.substring(0, 160),
      images: project.featured_image_url ? [project.featured_image_url] : [],
    },
    alternates: {
      canonical: projectUrl,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!project) {
    notFound();
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: project.title,
    description: project.description,
    image: project.featured_image_url,
    datePublished: project.created_at,
    dateModified: project.updated_at,
    author: {
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
      '@id': `https://robust.iverfinne.no/prosjekter/${project.slug}`,
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
              href="/prosjekter" 
              className="flex items-center gap-3 text-white hover:text-[#ffc2c2] transition-colors"
            >
              <ArrowLeft size={24} />
              <span className="font-['JetBrains_Mono',monospace] text-lg">Tilbake til prosjekter</span>
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
            {project.featured_image_url && (
              <div className="aspect-video relative">
                <Image
                  src={project.featured_image_url || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
            
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <h1 className="font-['JetBrains_Mono',monospace] text-[#e3160b] text-3xl md:text-4xl font-bold flex-1">
                  {project.title}
                </h1>
                {project.status && (
                  <span className={`text-sm px-4 py-2 rounded font-['JetBrains_Mono',monospace] ${
                    project.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                    project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status === 'ongoing' ? 'Pågående' : 
                     project.status === 'completed' ? 'Fullført' : 'Planlagt'}
                  </span>
                )}
              </div>
              
              {project.description && (
                <p className="font-['JetBrains_Mono',monospace] text-gray-700 text-xl mb-8 leading-relaxed font-bold">
                  {project.description}
                </p>
              )}
              
              <div className="font-['JetBrains_Mono',monospace] text-gray-800 prose prose-lg max-w-none">
                <ReactMarkdown>{project.content || ""}</ReactMarkdown>
              </div>
              
              <div className="mt-12 pt-6 border-t border-gray-200 flex flex-wrap gap-4 text-sm">
                {project.start_date && (
                  <p className="font-['JetBrains_Mono',monospace] text-gray-500">
                    <span className="font-bold">Start:</span> {new Date(project.start_date).toLocaleDateString('no-NO', { 
                      year: 'numeric', 
                      month: 'long'
                    })}
                  </p>
                )}
                {project.end_date && (
                  <p className="font-['JetBrains_Mono',monospace] text-gray-500">
                    <span className="font-bold">Slutt:</span> {new Date(project.end_date).toLocaleDateString('no-NO', { 
                      year: 'numeric', 
                      month: 'long'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
