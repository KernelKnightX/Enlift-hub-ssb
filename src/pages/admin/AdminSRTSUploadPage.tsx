import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Upload,
  FileJson,
  Trash2,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { deleteSRTSet, getSRTSetSummaries, saveSRTSet } from '@/lib/testDataService';
import { readJsonFilesFromZip } from '@/lib/adminUploadArchives';
import { AdminSavedSets } from '@/components/admin/AdminSavedSets';
import type { SRTSituation } from '@/types/schema';

export default function SRTSUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [situations, setSituations] = useState<SRTSituation[]>([]);
  const [setId, setSetId] = useState('set1');
  const [uploading, setUploading] = useState(false);
  const [savedSets, setSavedSets] = useState<Array<{ setId: string; items: string[] }>>([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshSets = useCallback(async () => {
    setLoadingSets(true);
    try {
      setSavedSets(await getSRTSetSummaries());
    } catch (error) {
      console.error('Failed to load saved SRT sets:', error);
      setMessage({ type: 'error', text: 'Could not load saved SRT sets. Please refresh and try again.' });
    } finally {
      setLoadingSets(false);
    }
  }, []);

  useEffect(() => {
    void refreshSets();
  }, [refreshSets]);

  // Predefined set options
  const setOptions = [
    { value: 'set1', label: 'Set 1' },
    { value: 'set2', label: 'Set 2' },
    { value: 'set3', label: 'Set 3' },
    { value: 'set4', label: 'Set 4' },
    { value: 'set5', label: 'Set 5' },
    { value: 'set6', label: 'Set 6' },
    { value: 'set7', label: 'Set 7' },
    { value: 'set8', label: 'Set 8' },
    { value: 'set9', label: 'Set 9' },
    { value: 'set10', label: 'Set 10' }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const jsonFiles = file.name.toLowerCase().endsWith('.zip')
        ? await readJsonFilesFromZip(file)
        : [{ name: file.name, content: await file.text() }];
      if (jsonFiles.length === 0) {
        throw new Error('The ZIP archive does not contain any JSON files.');
      }

      const parsedSituations: SRTSituation[] = jsonFiles.flatMap(({ name, content }) => {
        const json: unknown = JSON.parse(content);
        if (!Array.isArray(json)) throw new Error(`${name} must contain a JSON array.`);
        return json.map((item: unknown, index: number) => {
          const situation = typeof item === 'string'
            ? item
            : typeof item === 'object' && item !== null && 'situation' in item &&
                typeof item.situation === 'string'
              ? item.situation
              : '';
          if (!situation.trim()) throw new Error(`${name}: situation ${index + 1} is empty or invalid.`);
          return { id: '', situation: situation.trim() };
        });
      }).map((situation, index) => ({ ...situation, id: `${index + 1}` }));

      if (parsedSituations.length === 0) {
        throw new Error('No situations were found in the selected file.');
      }

      setSituations(parsedSituations);
      setMessage({
        type: 'success',
        text: `Loaded ${parsedSituations.length} situations from ${jsonFiles.length} JSON file${jsonFiles.length === 1 ? '' : 's'}. Save them to ${setId}.`,
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to read the selected file.',
      });
    }
  };

  const addSituation = () => {
    const newSituation: SRTSituation = {
      id: `${situations.length + 1}`,
      situation: ''
    };
    setSituations([...situations, newSituation]);
  };

  const updateSituation = (id: string, value: string) => {
    setSituations(situations.map(s => s.id === id ? { ...s, situation: value } : s));
  };

  const removeSituation = (id: string) => {
    setSituations(situations.filter(s => s.id !== id).map((s, index) => ({ ...s, id: `${index + 1}` })));
  };

  const handleSave = async () => {
    if (!setId) {
      setMessage({ type: 'error', text: 'Please enter a set ID (e.g., set1)' });
      return;
    }
    if (situations.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one situation' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await saveSRTSet(setId, situations);
      setMessage({ type: 'success', text: `Successfully saved ${situations.length} situations to ${setId}` });
      setSituations([]);
      await refreshSets();
      // Keep setId so user can add more situations to the same set
    } catch (error) {
      console.error('Failed to save SRT set:', error);
      setMessage({ type: 'error', text: error instanceof Error ? `Failed to save SRT set: ${error.message}` : 'Failed to save SRT set.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSet = async (id: string) => {
    try {
      await deleteSRTSet(id);
      setSavedSets((sets) => sets.filter((set) => set.setId !== id));
      setMessage({ type: 'success', text: `Deleted SRT set "${id}".` });
    } catch (error) {
      console.error(`Failed to delete SRT set ${id}:`, error);
      setMessage({ type: 'error', text: error instanceof Error ? `Failed to delete "${id}": ${error.message}` : `Failed to delete "${id}".` });
    }
  };

  const handleDeleteAllSets = async () => {
    try {
      for (const set of savedSets) await deleteSRTSet(set.setId);
      setSavedSets([]);
      setMessage({ type: 'success', text: `Deleted all ${savedSets.length} SRT sets.` });
    } catch (error) {
      console.error('Failed to delete all SRT sets:', error);
      setMessage({ type: 'error', text: error instanceof Error ? `Could not delete all SRT sets: ${error.message}` : 'Could not delete all SRT sets.' });
      await refreshSets();
    }
  };

  const downloadTemplate = () => {
    const template = [
      { situation: "You are leading a team when one member falls ill. You would..." },
      { situation: "During training, you notice a safety violation. You would..." }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'srt_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Upload SRT Situations</h1>
              <p className="text-sm text-muted-foreground">Manage Situation Reaction Test data</p>
            </div>
          </div>
          <Badge variant="outline">Admin Mode</Badge>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Message */}
        {message && (
          <Card className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CardContent className="py-4 flex items-center gap-3">
              {message.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              <span className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                {message.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto"
                onClick={() => setMessage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* JSON Upload */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              Upload JSON or ZIP File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.zip,application/json,application/zip"
                onChange={(event) => void handleFileUpload(event)}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Choose a JSON file or a ZIP containing JSON files
              </p>
              <p className="text-xs text-gray-500 mb-4">
                JSON arrays from a ZIP are combined and saved to the selected set.
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Choose File
                </Button>
                <Button variant="outline" onClick={downloadTemplate}>
                  Download Template
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Set Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Set</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="setId">Set Number</Label>
                <select
                  id="setId"
                  value={setId}
                  onChange={(e) => setSetId(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-background"
                >
                  {setOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose which set to upload situations to
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Situations List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Situations ({situations.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={addSituation}>
                <Plus className="w-4 h-4 mr-2" />
                Add Situation
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {situations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No situations added yet. Upload a JSON file or add manually.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {situations.map((situation, index) => (
                  <div key={situation.id} className="flex items-start gap-3">
                    <span className="text-sm text-gray-500 w-8 pt-2">{index + 1}.</span>
                    <div className="flex-1">
                      <textarea
                        value={situation.situation}
                        onChange={(e) => updateSituation(situation.id, e.target.value)}
                        placeholder="Describe the situation..."
                        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                        rows={2}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSituation(situation.id)}
                      className="text-red-500 hover:text-red-600 mt-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <AdminSavedSets
          title="Previously uploaded SRT sets"
          description="Expand a set to preview its situations. Deleting removes the full set from the test library."
          itemLabel="situations"
          sets={savedSets.map((set) => ({
            setId: set.setId,
            previews: set.items.map((situation) => ({ label: situation })),
          }))}
          loading={loadingSets}
          onDelete={handleDeleteSet}
          onDeleteAll={handleDeleteAllSets}
        />

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={uploading || situations.length === 0 || !setId}
          >
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
