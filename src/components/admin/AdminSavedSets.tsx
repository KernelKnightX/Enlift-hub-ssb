import { useState } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface AdminSavedSet {
  setId: string;
  previews: Array<{ label: string; imageUrl?: string }>;
}

interface AdminSavedSetsProps {
  title: string;
  description: string;
  itemLabel: string;
  sets: AdminSavedSet[];
  loading: boolean;
  onDelete: (setId: string) => Promise<void>;
  onDeleteAll: () => Promise<void>;
}

export function AdminSavedSets({
  title,
  description,
  itemLabel,
  sets,
  loading,
  onDelete,
  onDeleteAll,
}: AdminSavedSetsProps) {
  const [deletingSet, setDeletingSet] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  const handleDelete = async (setId: string) => {
    if (deletingAll) return;
    if (!window.confirm(`Delete "${setId}" and all of its ${itemLabel.toLowerCase()}? This cannot be undone.`)) return;
    setDeletingSet(setId);
    try {
      await onDelete(setId);
    } finally {
      setDeletingSet(null);
    }
  };

  const handleDeleteAll = async () => {
    if (deletingSet) return;
    if (!window.confirm(`Delete all ${sets.length} saved sets and their ${itemLabel.toLowerCase()}? This cannot be undone.`)) return;
    setDeletingAll(true);
    try {
      await onDeleteAll();
    } finally {
      setDeletingAll(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {!loading && sets.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={() => void handleDeleteAll()}
              disabled={deletingAll || deletingSet !== null}
            >
              {deletingAll
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <Trash2 className="mr-2 h-4 w-4" />}
              {deletingAll ? 'Deleting all…' : 'Delete all sets'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading saved sets…
          </div>
        ) : sets.length === 0 ? (
          <div className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
            No saved sets yet. Newly saved sets will appear here.
          </div>
        ) : (
          <div className="space-y-3">
            {sets.map((set) => (
              <div key={set.setId} className="rounded-lg border bg-white">
                <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <details className="min-w-0 flex-1">
                    <summary className="cursor-pointer list-none">
                      <span className="block break-all font-semibold text-slate-900">{set.setId}</span>
                      <span className="text-sm text-muted-foreground">
                        {set.previews.length} {itemLabel} · Click to preview
                      </span>
                    </summary>
                    <div className="mt-4 max-h-96 space-y-2 overflow-y-auto border-t bg-slate-50 p-4">
                      {set.previews.slice(0, 10).map((item, index) => (
                        <div key={`${set.setId}-${index}`} className="flex items-start gap-3 rounded-md border bg-white p-3 text-sm">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.label} className="h-16 w-20 shrink-0 rounded object-cover" />
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500">
                              {index + 1}
                            </span>
                          )}
                          <span className="min-w-0 whitespace-pre-wrap break-words text-slate-700">{item.label || 'Untitled item'}</span>
                        </div>
                      ))}
                      {set.previews.length > 10 && (
                        <p className="pt-1 text-xs text-muted-foreground">
                          Showing 10 of {set.previews.length} {itemLabel}.
                        </p>
                      )}
                    </div>
                  </details>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      void handleDelete(set.setId);
                    }}
                    disabled={deletingSet !== null || deletingAll}
                  >
                    {deletingSet === set.setId
                      ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete set
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
