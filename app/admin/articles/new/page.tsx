import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ArticleEditor } from "@/components/admin/article-editor";
import { getUserFromSession } from '@/lib/auth';

export default async function NewArticlePage() {
  const cookieStore = await cookies();
  const adminSession = cookieStore.get('admin-session');
  
  if (!adminSession) {
    redirect("/admin/login");
  }

  const currentUser = await getUserFromSession(adminSession.value);
  
  if (!currentUser) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-[#e3160b]">Ny artikkel</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArticleEditor currentUser={currentUser} />
      </main>
    </div>
  );
}
