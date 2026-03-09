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
import { saveOIRSet } from '@/lib/testDataService';
import type { OIRQuestion } from '@/types/schema';

export default function OIRUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [questions, setQuestions] = useState<OIRQuestion[]>([]);
  const [setId, setSetId] = useState('set1');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Predefined set options
  const setOptions = [
    { value: 'set1', label: 'Set 1' },
    { value: 'set2', label: 'Set 2' },
    { value: 'set3', label: 'Set 3' },
    { value: 'set4', label: 'Set 4' },
    { value: 'set5', label: 'Set 5' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const json = Array.isArray(parsed) ? parsed : [];
        const parsedQuestions: OIRQuestion[] = json.map((item: unknown, index: number) => {
          const itemObj = item as { imageUrl?: string; options?: string[]; correctAnswer?: number };
          return {
            id: `${index + 1}`,
            imageUrl: itemObj.imageUrl || '',
            options: itemObj.options || ['Option A', 'Option B', 'Option C', 'Option D'],
            correctAnswer: itemObj.correctAnswer ?? 0
          };
        });
        
        setQuestions(parsedQuestions);
        setMessage({ type: 'success', text: `Loaded ${parsedQuestions.length} questions from JSON` });
      } catch (error) {
        setMessage({ type: 'error', text: 'Invalid JSON format. Please check the file.' });
      }
    };
    reader.readAsText(file);
  };

  const addQuestion = () => {
    const newQuestion: OIRQuestion = {
      id: `${questions.length + 1}`,
      imageUrl: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, field: keyof OIRQuestion, value: unknown) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id).map((q, index) => ({ ...q, id: `${index + 1}` })));
  };

  const handleSave = async () => {
    if (!setId) {
      setMessage({ type: 'error', text: 'Please enter a set ID (e.g., set1)' });
      return;
    }
    if (questions.length === 0) {
      setMessage({ type: 'error', text: 'Please add at least one question' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await saveOIRSet(setId, questions);
      setMessage({ type: 'success', text: `Successfully saved ${questions.length} questions to ${setId}` });
      setQuestions([]);
      setSetId('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template: OIRQuestion[] = [
      {
        id: '1',
        imageUrl: 'https://example.com/image1.jpg',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 0
      }
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'oir_template.json';
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
              <h1 className="text-xl font-bold">Upload OIR Questions</h1>
              <p className="text-sm text-muted-foreground">Manage Officer Intelligence Rating questions</p>
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
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessage(null)}>
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
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              <Upload className="w-10 h-10 mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600 mb-2">Drag & drop a JSON file or click to browse</p>
              <p className="text-xs text-gray-500 mb-4">
                Expected format: Array of questions with imageUrl, options, and correctAnswer
              </p>
              <div className="flex justify-center gap-3">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Choose File</Button>
                <Button variant="outline" onClick={downloadTemplate}>Download Template</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Set Info */}
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
                <p className="text-xs text-muted-foreground mt-1">Select the set number for this OIR question set</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions ({questions.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-2" />Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No questions added yet. Upload a JSON file or add manually.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {questions.map((q, index) => (
                  <div key={q.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-sm text-gray-500">Q{index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)} className="text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <Input
                        placeholder="Image URL"
                        value={q.imageUrl}
                        onChange={(e) => updateQuestion(q.id, 'imageUrl', e.target.value)}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        {q.options.map((opt, optIndex) => (
                          <Input
                            key={optIndex}
                            placeholder={`Option ${optIndex + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[optIndex] = e.target.value;
                              updateQuestion(q.id, 'options', newOptions);
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Correct Answer:</Label>
                        <select
                          value={q.correctAnswer}
                          onChange={(e) => updateQuestion(q.id, 'correctAnswer', parseInt(e.target.value))}
                          className="p-2 border rounded"
                        >
                          {q.options.map((_, optIndex) => (
                            <option key={optIndex} value={optIndex}>Option {optIndex + 1}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={uploading || questions.length === 0 || !setId}>
            <Save className="w-4 h-4 mr-2" />
            {uploading ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
