"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { Edit, Eye, User } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  published: boolean;
  category: string | null;
  created_at: string;
  updated_at: string;
  last_modified_by_username: string | null;
};

export function ArticleList({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [filter, setFilter] = useState<string>("all");
  const { toast } = useToast();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('articles-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'articles'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setArticles(prev => [payload.new as Article, ...prev]);
            toast({
              title: "Ny artikkel opprettet",
              description: `"${(payload.new as Article).title}" ble opprettet`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setArticles(prev => 
              prev.map(article => 
                article.id === payload.new.id ? payload.new as Article : article
              )
            );
            toast({
              title: "Artikkel oppdatert",
              description: `"${(payload.new as Article).title}" ble oppdatert`,
            });
          } else if (payload.eventType === 'DELETE') {
            setArticles(prev => 
              prev.filter(article => article.id !== payload.old.id)
            );
            toast({
              title: "Artikkel slettet",
              description: "Artikkelen ble slettet",
              variant: "destructive",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const filteredArticles = articles.filter(article => {
    if (filter === "all") return true;
    return article.category === filter;
  });

  const getCategoryLabel = (category: string | null) => {
    const labels: Record<string, string> = {
      "om-oss": "Om oss",
      "prosjekter": "Prosjekter",
      "i-media": "I media",
      "kontakt": "Kontakt"
    };
    return category ? labels[category] || category : "Ingen kategori";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          className={filter === "all" ? "bg-[#e3160b] hover:bg-[#c51309]" : ""}
        >
          Alle
        </Button>
        <Button
          size="sm"
          variant={filter === "om-oss" ? "default" : "outline"}
          onClick={() => setFilter("om-oss")}
          className={filter === "om-oss" ? "bg-[#e3160b] hover:bg-[#c51309]" : ""}
        >
          Om oss
        </Button>
        <Button
          size="sm"
          variant={filter === "prosjekter" ? "default" : "outline"}
          onClick={() => setFilter("prosjekter")}
          className={filter === "prosjekter" ? "bg-[#e3160b] hover:bg-[#c51309]" : ""}
        >
          Prosjekter
        </Button>
        <Button
          size="sm"
          variant={filter === "i-media" ? "default" : "outline"}
          onClick={() => setFilter("i-media")}
          className={filter === "i-media" ? "bg-[#e3160b] hover:bg-[#c51309]" : ""}
        >
          I media
        </Button>
        <Button
          size="sm"
          variant={filter === "kontakt" ? "default" : "outline"}
          onClick={() => setFilter("kontakt")}
          className={filter === "kontakt" ? "bg-[#e3160b] hover:bg-[#c51309]" : ""}
        >
          Kontakt
        </Button>
      </div>

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            {filter === "all" 
              ? "Ingen artikler ennå. Opprett din første artikkel!" 
              : `Ingen artikler i kategorien "${getCategoryLabel(filter)}".`}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-2 truncate">
                      {article.title}
                    </CardTitle>
                    <div className="flex gap-2 mb-1 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {getCategoryLabel(article.category)}
                      </Badge>
                      <Badge variant={article.published ? "default" : "secondary"} className={article.published ? "bg-[#e3160b]" : ""}>
                        {article.published ? "Publisert" : "Utkast"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>
                        Oppdatert {formatDistanceToNow(new Date(article.updated_at), { addSuffix: true, locale: nb })}
                      </span>
                      {article.last_modified_by_username && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {article.last_modified_by_username}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0 flex-nowrap">
                    <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0 flex-shrink-0">
                      <Link href={`/admin/articles/${article.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    {article.published && (
                      <Button asChild size="sm" variant="outline" className="h-8 w-8 p-0 flex-shrink-0">
                        <Link href={`/artikkel/${article.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              {article.excerpt && (
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
