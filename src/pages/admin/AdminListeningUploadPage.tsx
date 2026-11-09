import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle, FileJson, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { saveListeningSet } from '@/lib/testDataService';
import type { ListeningQuestionData } from '@/types/schema';

const categories = ['nature', 'objects', 'places', 'vehicles', 'emotions', 'actions'];

function toWordArray(value: string) {
  return value.split(',').map((word) => word.trim()).filter(Boolean);
}

export default function AdminListeningUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setId, setSetId] = useState('set1');
  const [questions, setQuestions] = useState<ListeningQuestionData[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const parseQuestion = (item: unknown, index: number): ListeningQuestionData => {
    const q = item as Partial<ListeningQuestionData>;
    return {
      id: q.id || `${index + 1}`,
      category: q.category || categories[0],
      audioWords: Array.isArray(q.audioWords) ? q.audioWords.map(String).slice(0, 4) : ['', '', '', ''],
      options: Array.isArray(q.options) ? q.options.map(String).slice(0, 12) : [],
      correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers.map(String).slice(0, 4) : [],
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const json = Array.isArray(parsed) ? parsed : [];
        const parsedQuestions = json.map(parseQuestion);
        setQuestions(parsedQuestions);
        setMessage({ type: 'success', text: `Loaded ${parsedQuestions.length} listening questions from JSON` });
      } catch {
        setMessage({ type: 'error', text: 'Invalid JSON format. Please check the file.' });
      }
    };
    reader.readAsText(file);
  };

  const addQuestion = () => {
    setQuestions((current) => [
      ...current,
      {
        id: `${current.length + 1}`,
        category: categories[0],
        audioWords: ['', '', '', ''],
        options: Array.from({ length: 12 }, () => ''),
        correctAnswers: [],
      },
    ]);
  };

  const updateQuestion = (id: string, field: keyof ListeningQuestionData, value: unknown) => {
    setQuestions((current) => current.map((q) => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions((current) => current.filter((q) => q.id !== id).map((q, index) => ({ ...q, id: `${index + 1}` })));
  };

  const validateQuestions = () => {
    return questions.every((q) => (
      q.audioWords.length === 4
      && q.audioWords.every((word) => word.trim())
      && q.options.length === 12
      && q.options.every((word) => word.trim())
      && q.audioWords.every((word) => q.options.includes(word))
    ));
  };

  const normalizeQuestions = () => {
    return questions.map((q) => ({
      ...q,
      correctAnswers: q.audioWords,
    }));
  };

  const handleSave = async () => {
    if (!questions.length) {
      setMessage({ type: 'error', text: 'Please add at least one listening question' });
      return;
    }

    if (!validateQuestions()) {
      setMessage({ type: 'error', text: 'Each question needs 4 audio words, 12 options, and all audio words must be present in options.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await saveListeningSet(setId, normalizeQuestions());
      setMessage({ type: 'success', text: `Saved ${questions.length} listening questions to ${setId}` });
      setQuestions([]);
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template: ListeningQuestionData[] = [
      {
        id: '1',
        category: 'nature',
        audioWords: ['River', 'Pencil', 'Mountain', 'Bridge'],
        options: ['River', 'Chair', 'Pencil', 'Table', 'Mountain', 'Book', 'Bridge', 'Cloud', 'Road', 'Tree', 'Sun', 'Train'],
        correctAnswers: ['River', 'Pencil', 'Mountain', 'Bridge'],
      },
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'listening_test_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Upload Listening Test Questions</h1>
              <p className="text-sm text-muted-foreground">Manage audio recall word sets</p>
            </div>
          </div>
          <Badge variant="outline">Admin Mode</Badge>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {message && (
          <Card className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CardContent className="py-4 flex items-center gap-3">
              {message.type === 'error' ? <AlertCircle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
              <span className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>{message.text}</span>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessage(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="w-5 h-5" />
              Upload JSON File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Upload an array of listening questions</p>
              <p className="text-xs text-gray-500 mb-4">Fields: category, audioWords[4], options[12], correctAnswers[4]</p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Choose File</Button>
                <Button variant="outline" onClick={downloadTemplate}>Download Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Set Information</CardTitle>
          </CardHeader>
          <CardContent className="max-w-sm">
            <Label htmlFor="setId">Select Set</Label>
            <select
              id="setId"
              value={setId}
              onChange={(e) => setSetId(e.target.value)}
              className="w-full p-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-background"
            >
              {Array.from({ length: 10 }, (_, index) => (
                <option key={index + 1} value={`set${index + 1}`}>Set {index + 1}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1">The test currently reads Set 1 by default.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions ({questions.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No listening questions added yet.</div>
            ) : (
              <div className="space-y-4 max-h-[560px] overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-gray-500">Q{index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <select
                        value={question.category}
                        onChange={(e) => updateQuestion(question.id, 'category', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        {categories.map((category) => <option key={category} value={category}>{category}</option>)}
                      </select>
                      <Input
                        value={question.audioWords.join(', ')}
                        onChange={(e) => {
                          const words = toWordArray(e.target.value).slice(0, 4);
                          updateQuestion(question.id, 'audioWords', words);
                          updateQuestion(question.id, 'correctAnswers', words);
                        }}
                        placeholder="4 audio words, comma separated"
                      />
                      <Input
                        value={question.options.join(', ')}
                        onChange={(e) => updateQuestion(question.id, 'options', toWordArray(e.target.value).slice(0, 12))}
                        placeholder="12 option words, comma separated"
                      />
                      <p className="text-xs text-muted-foreground">
                        Correct answers are automatically set from the 4 audio words.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={uploading || !questions.length}>
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
