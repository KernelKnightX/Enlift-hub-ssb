import { useState, useRef } from 'react';
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
  FileJson,
  Trash2,
  Plus,
  Save,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { saveWATSet } from '@/lib/testDataService';
import type { WATWord } from '@/types/schema';

export default function WATUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [words, setWords] = useState<WATWord[]>([]);
  const [setId, setSetId] = useState('set1');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const json = Array.isArray(parsed) ? parsed : [];
        const parsedWords: WATWord[] = json.map((word: unknown, index: number) => {
          const wordObj = word as { word?: string };
          return {
            id: `${index + 1}`,
            word: typeof word === 'string' ? word : (wordObj.word || '')
          };
        });
        
        setWords(parsedWords);
        setMessage({ type: 'success', text: `Loaded ${parsedWords.length} words from JSON` });
      } catch (error) {
        setMessage({ type: 'error', text: 'Invalid JSON format. Please check the file.' });
      }
    };
    reader.readAsText(file);
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
    if (words.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one word' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await saveWATSet(setId, words);
      setMessage({ type: 'success', text: `Successfully saved ${words.length} words to ${setId}` });
      setWords([]);
      // Keep setId so user can add more words to the same set
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setUploading(false);
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
              <FileJson className="w-5 h-5" />
              Upload JSON File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">
                Drag & drop a JSON file or click to browse
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Expected format: Array of words: ["Success", "Challenge", "Leadership"]
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

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={uploading || words.length === 0 || !setId}
          >
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
