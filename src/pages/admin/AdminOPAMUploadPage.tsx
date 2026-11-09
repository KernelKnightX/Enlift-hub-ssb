import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { unzipSync } from 'fflate';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  FileArchive,
  FileJson,
  Loader2,
  Save,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { deleteOPAMSet, getOPAMSetSummaries, saveOPAMSet } from '@/lib/testDataService';
import { opamSections } from '@/data/opamQuestions';
import type { OPAMQuestion } from '@/types/schema';

const SAMPLE_TEMPLATE: OPAMQuestion[] = [
  {
    id: 1,
    section: opamSections[0].label,
    prompt: 'I can remain calm while solving unexpected problems.',
  },
];

type SetSummary = { setId: string; questions: OPAMQuestion[] };
type UploadSet = { setId: string; questions: OPAMQuestion[] };

function parseQuestions(value: unknown, filename: string): OPAMQuestion[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`${filename} must contain a non-empty JSON array.`);
  }

  return value.map((item: unknown, index: number) => {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`${filename}: question ${index + 1} must be an object.`);
    }
    const question = item as Partial<OPAMQuestion>;
    if (typeof question.prompt !== 'string' || !question.prompt.trim()) {
      throw new Error(`${filename}: question ${index + 1} is missing its prompt.`);
    }

    return {
      id: typeof question.id === 'number' ? question.id : index + 1,
      section: typeof question.section === 'string' && question.section.trim()
        ? question.section
        : opamSections[Math.floor(index / 8)]?.label || 'Section',
      prompt: question.prompt.trim(),
    };
  });
}

function normalizeSetId(filename: string): string {
  const name = filename.replace(/\.json$/i, '').split('/').pop() || '';
  const normalized = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!normalized) throw new Error(`Could not create a set ID from "${filename}".`);
  return normalized.startsWith('opam-') ? normalized : `opam-${normalized}`;
}

function parseJsonText(text: string, filename: string): OPAMQuestion[] {
  try {
    return parseQuestions(JSON.parse(text) as unknown, filename);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`${filename} is not valid JSON.`);
    }
    throw error;
  }
}

export default function AdminOPAMUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setId, setSetId] = useState('opam-default');
  const [questions, setQuestions] = useState<OPAMQuestion[]>([]);
  const [uploadSets, setUploadSets] = useState<UploadSet[]>([]);
  const [savedSets, setSavedSets] = useState<SetSummary[]>([]);
  const [expandedSet, setExpandedSet] = useState<string | null>(null);
  const [loadingSets, setLoadingSets] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingSet, setDeletingSet] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshSets = useCallback(async () => {
    setLoadingSets(true);
    try {
      setSavedSets(await getOPAMSetSummaries());
    } catch (error) {
      console.error('Failed to load saved OPAM sets:', error);
      setMessage({ type: 'error', text: 'Could not load saved OPAM sets. Please refresh and try again.' });
    } finally {
      setLoadingSets(false);
    }
  }, []);

  useEffect(() => {
    void refreshSets();
  }, [refreshSets]);

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (files.length === 0) return;

    setMessage(null);
    try {
      const parsedSets: UploadSet[] = [];
      const setIds = new Set<string>();

      for (const file of files) {
        if (file.name.toLowerCase().endsWith('.zip')) {
          const archive = unzipSync(new Uint8Array(await file.arrayBuffer()));
          const entries = Object.entries(archive)
            .filter(([path]) => path.toLowerCase().endsWith('.json') && !path.split('/').some((part) => part.startsWith('__')))
            .sort(([a], [b]) => a.localeCompare(b));

          if (entries.length === 0) {
            throw new Error(`${file.name} does not contain any JSON files.`);
          }

          for (const [path, content] of entries) {
            const id = normalizeSetId(path);
            if (setIds.has(id)) throw new Error(`More than one uploaded file maps to the set ID "${id}".`);
            setIds.add(id);
            parsedSets.push({
              setId: id,
              questions: parseJsonText(new TextDecoder().decode(content), path),
            });
          }
        } else if (file.name.toLowerCase().endsWith('.json')) {
          const id = files.length === 1 ? setId.trim() : normalizeSetId(file.name);
          if (!id) throw new Error('Enter a set identifier before uploading a JSON file.');
          if (setIds.has(id)) throw new Error(`More than one uploaded file uses the set ID "${id}".`);
          setIds.add(id);
          parsedSets.push({
            setId: id,
            questions: parseJsonText(await file.text(), file.name),
          });
        } else {
          throw new Error(`${file.name} is not a JSON or ZIP file.`);
        }
      }

      if (parsedSets.length === 1) {
        setSetId(parsedSets[0].setId);
        setQuestions(parsedSets[0].questions);
      } else {
        setQuestions([]);
      }
      setUploadSets(parsedSets);
      setMessage({
        type: 'success',
        text: `Loaded ${parsedSets.length} set${parsedSets.length === 1 ? '' : 's'} with ${parsedSets.reduce((total, item) => total + item.questions.length, 0)} OPAM statements.`,
      });
    } catch (error) {
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Could not read the selected files.' });
    }
  };

  const loadTemplate = () => {
    const blob = new Blob([JSON.stringify(SAMPLE_TEMPLATE, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'opam_template.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    const setsToSave = uploadSets.length
      ? uploadSets
      : setId.trim() && questions.length
        ? [{ setId: setId.trim(), questions }]
        : [];

    if (setsToSave.length === 0) {
      setMessage({ type: 'error', text: 'Upload a JSON file or ZIP archive containing OPAM questions first.' });
      return;
    }

    setUploading(true);
    setMessage(null);
    try {
      for (const item of setsToSave) await saveOPAMSet(item.setId, item.questions);
      setMessage({
        type: 'success',
        text: `Saved ${setsToSave.length} set${setsToSave.length === 1 ? '' : 's'} with ${setsToSave.reduce((total, item) => total + item.questions.length, 0)} questions.`,
      });
      setQuestions([]);
      setUploadSets([]);
      await refreshSets();
    } catch (error) {
      console.error('Failed to save OPAM uploads:', error);
      setMessage({ type: 'error', text: error instanceof Error ? `Failed to save OPAM sets: ${error.message}` : 'Failed to save OPAM sets.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(`Delete the saved OPAM set "${id}" and all its questions? This cannot be undone.`)) return;
    setDeletingSet(id);
    setMessage(null);
    try {
      await deleteOPAMSet(id);
      setSavedSets((sets) => sets.filter((item) => item.setId !== id));
      if (expandedSet === id) setExpandedSet(null);
      setMessage({ type: 'success', text: `Deleted OPAM set "${id}".` });
    } catch (error) {
      console.error(`Failed to delete OPAM set ${id}:`, error);
      setMessage({ type: 'error', text: error instanceof Error ? `Failed to delete "${id}": ${error.message}` : `Failed to delete "${id}".` });
    } finally {
      setDeletingSet(null);
    }
  };

  const totalPendingQuestions = uploadSets.reduce((total, item) => total + item.questions.length, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white px-4 py-4 shadow-sm sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">OPAM Content Manager</h1>
              <p className="text-sm text-muted-foreground">Upload, review, and manage assessment sets</p>
            </div>
          </div>
          <Badge variant="outline">Admin Mode</Badge>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {message && (
          <Card className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <CardContent className="flex items-center gap-3 py-4">
              {message.type === 'error'
                ? <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                : <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />}
              <p className={`text-sm ${message.type === 'error' ? 'text-red-800' : 'text-green-800'}`}>{message.text}</p>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessage(null)} aria-label="Dismiss message">
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        <section className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Saved sets</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{loadingSets ? '—' : savedSets.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Saved questions</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">
                {loadingSets ? '—' : savedSets.reduce((total, item) => total + item.questions.length, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending upload</p>
              <p className="mt-1 text-3xl font-bold text-slate-900">{totalPendingQuestions}</p>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileArchive className="h-5 w-5 text-fuchsia-700" />
              Upload JSON files or a ZIP archive
            </CardTitle>
            <CardDescription>
              A ZIP can contain multiple JSON files. Each file becomes a set named from its filename. JSON uploads use the set ID below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="opam-set-id">Set identifier for a single JSON file</Label>
                <Input
                  id="opam-set-id"
                  value={setId}
                  onChange={(event) => setSetId(event.target.value)}
                  placeholder="opam-default"
                />
              </div>
              <Button variant="outline" onClick={loadTemplate}>
                <Save className="mr-2 h-4 w-4" />
                Download JSON template
              </Button>
            </div>

            <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.zip,application/json,application/zip"
                multiple
                onChange={(event) => void handleFileUpload(event)}
                className="hidden"
              />
              <Upload className="mx-auto mb-3 h-10 w-10 text-slate-400" />
              <p className="font-semibold text-slate-800">Choose JSON file(s) or a ZIP archive</p>
              <p className="mt-1 text-sm text-slate-500">JSON format: an array of objects with a prompt and optional section.</p>
              <Button className="mt-4" variant="outline" onClick={() => fileInputRef.current?.click()}>
                Browse files
              </Button>
            </div>
          </CardContent>
        </Card>

        {(uploadSets.length > 0 || questions.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle>Review upload ({uploadSets.length || 1} set{(uploadSets.length || 1) === 1 ? '' : 's'})</CardTitle>
              <CardDescription>
                {uploadSets.length
                  ? `${uploadSets.length} set(s), ${totalPendingQuestions} questions`
                  : `${setId}: ${questions.length} questions`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(uploadSets.length ? uploadSets : [{ setId, questions }]).map((item) => (
                <div key={item.setId} className="rounded-lg border bg-white p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{item.setId}</p>
                      <p className="text-sm text-muted-foreground">{item.questions.length} questions</p>
                    </div>
                    <Badge variant="secondary">Ready to save</Badge>
                  </div>
                  <div className="max-h-48 space-y-2 overflow-y-auto">
                    {item.questions.slice(0, 5).map((question) => (
                      <div key={`${item.setId}-${question.id}`} className="rounded-md bg-slate-50 p-3 text-sm">
                        <p className="font-medium text-slate-700">{question.section}</p>
                        <p className="text-slate-600">{question.prompt}</p>
                      </div>
                    ))}
                    {item.questions.length > 5 && (
                      <p className="text-xs text-muted-foreground">And {item.questions.length - 5} more questions.</p>
                    )}
                  </div>
                </div>
              ))}
              <Button onClick={() => void handleSave()} disabled={uploading} className="w-full sm:w-auto">
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {uploading ? 'Saving sets…' : 'Save uploaded sets'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Separator />

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>Saved OPAM sets</CardTitle>
                <CardDescription>Review the uploaded questions or permanently remove a set.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => void refreshSets()} disabled={loadingSets}>
                {loadingSets && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Refresh list
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingSets ? (
              <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading saved sets…
              </div>
            ) : savedSets.length === 0 ? (
              <div className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
                <FileJson className="mx-auto mb-2 h-8 w-8 text-slate-400" />
                No saved OPAM sets yet. Upload JSON or ZIP files above to get started.
              </div>
            ) : (
              <div className="space-y-3">
                {savedSets.map((item) => {
                  const expanded = expandedSet === item.setId;
                  return (
                    <div key={item.setId} className="rounded-lg border bg-white">
                      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                        <button
                          type="button"
                          className="min-w-0 flex-1 text-left"
                          onClick={() => setExpandedSet(expanded ? null : item.setId)}
                          aria-expanded={expanded}
                        >
                          <span className="block truncate font-semibold text-slate-900">{item.setId}</span>
                          <span className="text-sm text-muted-foreground">{item.questions.length} questions · {expanded ? 'Hide' : 'View'} questions</span>
                        </button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                          onClick={() => void handleDelete(item.setId)}
                          disabled={deletingSet !== null}
                        >
                          {deletingSet === item.setId
                            ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            : <Trash2 className="mr-2 h-4 w-4" />}
                          Delete set
                        </Button>
                      </div>
                      {expanded && (
                        <div className="max-h-80 space-y-2 overflow-y-auto border-t bg-slate-50 p-4">
                          {item.questions.map((question) => (
                            <div key={`${item.setId}-${question.id}`} className="rounded-md border bg-white p-3 text-sm">
                              <p className="font-medium text-slate-700">{question.section}</p>
                              <p className="text-slate-600">{question.prompt}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-start">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to dashboard
          </Button>
        </div>
      </main>
    </div>
  );
}
