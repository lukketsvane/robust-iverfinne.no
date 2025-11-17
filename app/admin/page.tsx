import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArticleList } from "@/components/admin/article-list";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { createClient } from "@/lib/supabase/server";
import { Eye, LogOut, Plus, FileText, TrendingUp } from 'lucide-react';
import { getUserFromSession } from '@/lib/auth';

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  
  if (!adminSession) {
    redirect("/admin/login");
  }

  const currentUser = await getUserFromSession(adminSession.value);
  
  if (!currentUser) {
    redirect("/admin/login");
  }

  const supabase = await createClient();
  const { data: articles, error } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false });

  const stats = {
    total: articles?.length || 0,
    published: articles?.filter(a => a.published).length || 0,
    drafts: articles?.filter(a => !a.published).length || 0,
    byCategory: {
      "om-oss": articles?.filter(a => a.category === "om-oss").length || 0,
      "prosjekter": articles?.filter(a => a.category === "prosjekter").length || 0,
      "i-media": articles?.filter(a => a.category === "i-media").length || 0,
      "kontakt": articles?.filter(a => a.category === "kontakt").length || 0,
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#e3160b]">ROBUST</h1>
            <span className="text-sm text-gray-500">
              Logget inn som: <span className="font-medium">{currentUser.username}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href="/">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Se nettside</span>
              </Link>
            </Button>
            <form action="/admin/logout" method="post">
              <Button variant="outline" size="sm" type="submit" className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logg ut</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <AnalyticsDashboard />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white border p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <FileText className="h-3 w-3" />
              <span>Totalt</span>
            </div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white border p-4">
            <div className="flex items-center gap-2 text-green-600 text-xs mb-1">
              <TrendingUp className="h-3 w-3" />
              <span>Publisert</span>
            </div>
            <div className="text-2xl font-bold">{stats.published}</div>
          </div>
          <div className="bg-white border p-4">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <FileText className="h-3 w-3" />
              <span>Utkast</span>
            </div>
            <div className="text-2xl font-bold">{stats.drafts}</div>
          </div>
          <div className="bg-white border p-4">
            <div className="flex items-center gap-2 text-[#e3160b] text-xs mb-1">
              <FileText className="h-3 w-3" />
              <span>Kategorier</span>
            </div>
            <div className="text-2xl font-bold">4</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Artikler</h2>
          <Button asChild size="sm" className="bg-[#e3160b] hover:bg-[#c51309] gap-2">
            <Link href="/admin/articles/new">
              <Plus className="h-4 w-4" />
              Ny artikkel
            </Link>
          </Button>
        </div>
        <ArticleList initialArticles={articles || []} />
      </main>
    </div>
  );
}
