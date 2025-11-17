import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, FileText } from 'lucide-react';

type ArticleHistoryProps = {
  articleId: string;
};

export async function ArticleHistory({ articleId }: ArticleHistoryProps) {
  const supabase = await createClient();
  
  const { data: history, error } = await supabase
    .from("article_history")
    .select("*")
    .eq("article_id", articleId)
    .order("changed_at", { ascending: false })
    .limit(10);

  if (error || !history || history.length === 0) {
    return null;
  }

  const getChangeTypeLabel = (type: string) => {
    switch (type) {
      case 'created': return 'Opprettet';
      case 'updated': return 'Oppdatert';
      case 'published': return 'Publisert';
      case 'unpublished': return 'Avpublisert';
      default: return type;
    }
  };

  const getChangeTypeColor = (type: string) => {
    switch (type) {
      case 'created': return 'text-blue-600';
      case 'updated': return 'text-gray-600';
      case 'published': return 'text-green-600';
      case 'unpublished': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Versjonshistorikk
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3 p-3 bg-gray-50 border"
            >
              <div className="flex-shrink-0">
                <FileText className={`h-4 w-4 ${getChangeTypeColor(entry.change_type)}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`font-medium text-sm ${getChangeTypeColor(entry.change_type)}`}>
                    {getChangeTypeLabel(entry.change_type)}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {entry.changed_by_username}
                  </span>
                  <span className="text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {new Date(entry.changed_at).toLocaleString('nb-NO', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>
                {entry.title && (
                  <p className="text-sm text-gray-700 mt-1 truncate">
                    {entry.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
