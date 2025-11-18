"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useRouter } from 'next/navigation';
import { ImageUpload } from "./image-upload";
import { MarkdownEditor } from "./markdown-editor";
import type { AdminUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Trash2 } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  featured_image_url: string | null;
  published: boolean;
  category: string | null;
};

type ArticleEditorProps = {
  article?: Article;
  currentUser: AdminUser;
};

export function ArticleEditor({ article, currentUser }: ArticleEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient(); // Create supabase client once at component level
  const [title, setTitle] = useState(article?.title || "");
  const [slug, setSlug] = useState(article?.slug || "");
  const [excerpt, setExcerpt] = useState(article?.excerpt || "");
  const [content, setContent] = useState(article?.content || "");
  const [featuredImage, setFeaturedImage] = useState(article?.featured_image_url || "");
  const [published, setPublished] = useState(article?.published || false);
  const [category, setCategory] = useState(article?.category || "om-oss");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/æ/g, "ae")
      .replace(/ø/g, "o")
      .replace(/å/g, "a")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!article) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async () => {
    if (!title || !slug) {
      toast({
        title: "Feil",
        description: "Tittel og slug er påkrevd",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const articleData = {
      title,
      slug,
      excerpt: excerpt || null,
      content: content || null,
      featured_image_url: featuredImage || null,
      published,
      category: category || null,
      author_id: currentUser.id,
      last_modified_by: currentUser.id,
      last_modified_by_username: currentUser.username,
    };

    let error;
    let savedArticleId = article?.id;
    
    if (article) {
      ({ error } = await supabase
        .from("articles")
        .update(articleData)
        .eq("id", article.id));
    } else {
      const { data, error: insertError } = await supabase
        .from("articles")
        .insert(articleData)
        .select('id')
        .single();
      
      error = insertError;
      if (data) savedArticleId = data.id;
    }

    if (!error && savedArticleId) {
      const changeType = article 
        ? (published !== article.published 
            ? (published ? 'published' : 'unpublished') 
            : 'updated')
        : 'created';

      await supabase.from('article_history').insert({
        article_id: savedArticleId,
        changed_by_user_id: currentUser.id,
        changed_by_username: currentUser.username,
        title,
        slug,
        content,
        excerpt,
        featured_image_url: featuredImage,
        published,
        category,
        change_type: changeType,
      });
    }

    setSaving(false);

    if (error) {
      console.error("Error saving article:", error);
      toast({
        title: "Feil ved lagring",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Lagret!",
        description: article ? "Artikkelen ble oppdatert" : "Artikkelen ble opprettet",
      });
      // Refresh the page data without navigation for new articles
      if (!article) {
        router.refresh();
      }
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    
    if (!confirm(`Er du sikker på at du vil slette "${article.title}"?`)) return;

    setDeleting(true);

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", article.id);

    if (error) {
      console.error("Error deleting article:", error);
      setDeleting(false);
      toast({
        title: "Feil ved sletting",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Slettet!",
        description: "Artikkelen ble slettet",
      });
      router.push("/admin");
      router.refresh();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? "Rediger artikkel" : "Ny artikkel"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Tittel</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Artikkelens tittel"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="artikkel-url"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="om-oss">Om oss</option>
            <option value="prosjekter">Prosjekter</option>
            <option value="i-media">I media</option>
            <option value="kontakt">Kontakt</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Sammendrag</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Kort beskrivelse av artikkelen"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Fremhevet bilde</Label>
          <ImageUpload
            value={featuredImage}
            onChange={setFeaturedImage}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Innhold (Markdown)</Label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
            placeholder="Skriv artikkelens innhold her med Markdown-formatering..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="published"
            checked={published}
            onCheckedChange={setPublished}
          />
          <Label htmlFor="published">Publiser artikkel</Label>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleSave}
            disabled={saving || deleting}
            className="bg-[#e3160b] hover:bg-[#c51309]"
          >
            {saving ? "Lagrer..." : "Lagre"}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            disabled={saving || deleting}
          >
            Avbryt
          </Button>
          {article && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving || deleting}
              className="ml-auto"
            >
              {deleting ? "Sletter..." : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Slett artikkel
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
