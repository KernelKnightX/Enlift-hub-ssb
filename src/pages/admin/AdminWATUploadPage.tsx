import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Upload,
  FileArchive,
  Trash2,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { deleteWATSet, getWATSetSummaries, saveWATSet } from '@/lib/testDataService';
import { readJsonFilesFromZip } from '@/lib/adminUploadArchives';
import { AdminSavedSets } from '@/components/admin/AdminSavedSets';
import type { WATWord } from '@/types/schema';

export default function WATUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState<WATWord[]>([]);
  const [zipSets, setZipSets] = useState<Array<{ setId: string; words: WATWord[] }> | null>(null);
  const [setId, setSetId] = useState('set1');
  const [uploading, setUploading] = useState(false);
  const [savedSets, setSavedSets] = useState<Array<{ setId: string; items: string[] }>>([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const refreshSets = useCallback(async () => {
    setLoadingSets(true);
    try {
      setSavedSets(await getWATSetSummaries());
    } catch (error) {
      console.error('Failed to load saved WAT sets:', error);
      setMessage({ type: 'error', text: 'Could not load saved WAT sets. Please refresh and try again.' });
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

      const parseWords = (value: unknown, name: string): WATWord[] => {
        const rawWords = Array.isArray(value)
          ? value
          : typeof value === 'object' && value !== null && 'words' in value
            ? value.words
            : null;
        if (!Array.isArray(rawWords)) {
          throw new Error(`${name} must contain a JSON array or an object with a "words" array.`);
        }
        if (rawWords.length === 0) throw new Error(`${name} does not contain any words.`);
        return rawWords.map((word: unknown, index: number) => {
          const wordObj = typeof word === 'object' && word !== null
            ? word as { word?: unknown }
            : null;
          const value = typeof word === 'string' ? word : wordObj?.word;
          if (typeof value !== 'string' || !value.trim()) {
            throw new Error(`${name}: word ${index + 1} is empty or invalid.`);
          }
          return { id: `${index + 1}`, word: value.trim() };
        });
      };

      if (file.name.toLowerCase().endsWith('.zip')) {
        const importedSets = jsonFiles.map(({ name, content }) => {
          const data: unknown = JSON.parse(content);
          const metadata = typeof data === 'object' && data !== null
            ? data as { set_number?: unknown }
            : null;
          const filenameSetNumber = name.match(/set[_-]?0*(\d+)/i)?.[1];
          const setNumber = typeof metadata?.set_number === 'number'
            ? metadata.set_number
            : filenameSetNumber
              ? Number(filenameSetNumber)
              : null;
          if (setNumber === null || !Number.isInteger(setNumber) || setNumber < 1) {
            throw new Error(`${name} needs a positive "set_number" or a set number in its filename.`);
          }
          return { setId: `set${setNumber}`, words: parseWords(data, name) };
        });
        if (new Set(importedSets.map((set) => set.setId)).size !== importedSets.length) {
          throw new Error('The ZIP contains more than one file for the same WAT set number.');
        }
        setZipSets(importedSets);
        setWords([]);
        setMessage({
          type: 'success',
          text: `Loaded ${importedSets.length} WAT sets with ${importedSets.reduce((total, set) => total + set.words.length, 0)} words. Review the sets below, then save.`,
        });
      } else {
        const parsedWords = parseWords(JSON.parse(jsonFiles[0].content) as unknown, jsonFiles[0].name);
        setWords(parsedWords);
        setZipSets(null);
        setMessage({
          type: 'success',
          text: `Loaded ${parsedWords.length} words from JSON. Save them to ${setId}.`,
        });
      }
    } catch (error) {
      setZipSets(null);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Unable to read the selected file.',
      });
    }
  };

  const addWord = () => {
    const newWord: WATWord = {
      id: `${words.length + 1}`,
      word: ''
    };
    setWords([...words, newWord]);
  };

  const updateWord = (id: string, value: string) => {
    setWords(words.map(w => w.id === id ? { ...w, word: value } : w));
  };

  const removeWord = (id: string) => {
    setWords(words.filter(w => w.id !== id).map((w, index) => ({ ...w, id: `${index + 1}` })));
  };

  const handleSave = async () => {
    const setsToSave = zipSets ?? (words.length > 0 ? [{ setId, words }] : []);
    if (setsToSave.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one word' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      for (const set of setsToSave) await saveWATSet(set.setId, set.words);
      setMessage({
        type: 'success',
        text: zipSets
          ? `Successfully saved ${zipSets.length} sets with ${zipSets.reduce((total, set) => total + set.words.length, 0)} words.`
          : `Successfully saved ${words.length} words to ${setId}`,
      });
      setWords([]);
      setZipSets(null);
      await refreshSets();
      // Keep setId so user can add more words to the same set
    } catch (error) {
      console.error('Failed to save WAT set:', error);
      setMessage({ type: 'error', text: error instanceof Error ? `Failed to save WAT set: ${error.message}` : 'Failed to save WAT set.' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteSet = async (id: string) => {
    try {
      await deleteWATSet(id);
      setSavedSets((sets) => sets.filter((set) => set.setId !== id));
      setMessage({ type: 'success', text: `Deleted WAT set "${id}".` });
    } catch (error) {
      console.error(`Failed to delete WAT set ${id}:`, error);
      setMessage({ type: 'error', text: error instanceof Error ? `Failed to delete "${id}": ${error.message}` : `Failed to delete "${id}".` });
    }
  };

  const handleDeleteAllSets = async () => {
    try {
      for (const set of savedSets) await deleteWATSet(set.setId);
      setSavedSets([]);
      setMessage({ type: 'success', text: `Deleted all ${savedSets.length} WAT sets.` });
    } catch (error) {
      console.error('Failed to delete all WAT sets:', error);
      setMessage({ type: 'error', text: error instanceof Error ? `Could not delete all WAT sets: ${error.message}` : 'Could not delete all WAT sets.' });
      await refreshSets();
    }
  };

  const downloadTemplate = () => {
    const template = [
      { word: "Success" },
      { word: "Challenge" },
      { word: "Leadership" }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wat_template.json';
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
              <h1 className="text-xl font-bold">Upload WAT Words</h1>
              <p className="text-sm text-muted-foreground">Manage Word Association Test data</p>
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
              <FileArchive className="w-5 h-5" />
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
                Choose a JSON file or a ZIP containing one JSON file per set
              </p>
              <p className="text-xs text-gray-500 mb-4">
                JSON may be an array or an object with a words array. ZIP files use each file's set_number.
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

        {zipSets && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>WAT sets ready to save ({zipSets.length})</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {zipSets.map((set) => (
                <div key={set.setId} className="rounded-lg border bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">{set.setId}</p>
                  <p className="text-sm text-muted-foreground">{set.words.length} words</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {set.words.slice(0, 5).map((word) => word.word).join(', ')}
                    {set.words.length > 5 ? '…' : ''}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Separator className="my-6" />

        {/* Set Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="setId">Select Set</Label>
                <select
                  id="setId"
                  value={setId}
                  onChange={(e) => setSetId(e.target.value)}
                  className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-background"
                >
                  {setOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose which set to upload words to
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Words List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Words ({words.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={addWord}>
                <Plus className="w-4 h-4 mr-2" />
                Add Word
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {words.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No words added yet. Upload a JSON file or add manually.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {words.map((word, index) => (
                  <div key={word.id} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                    <Input
                      value={word.word}
                      onChange={(e) => updateWord(word.id, e.target.value)}
                      placeholder="Enter word..."
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWord(word.id)}
                      className="text-red-500 hover:text-red-600"
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
          title="Previously uploaded WAT sets"
          description="Expand a set to preview its words. Deleting removes the full set from the test library."
          itemLabel="words"
          sets={savedSets.map((set) => ({
            setId: set.setId,
            previews: set.items.map((word) => ({ label: word })),
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
            disabled={uploading || (words.length === 0 && !zipSets) || (!zipSets && !setId)}
          >
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Saving...' : zipSets ? `Save ${zipSets.length} sets to Firebase` : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
