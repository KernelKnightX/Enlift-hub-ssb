import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle, FileJson, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { saveEnglishGrammarSet } from '@/lib/testDataService';
import type { EnglishGrammarQuestion } from '@/types/schema';

const categories = [
  'Error Detection',
  'Fill in the Blanks',
  'Synonyms',
  'Antonyms',
  'Missing Alphabets',
  'Correct Spelling',
  'Sentence Improvement',
];

export default function AdminEnglishUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setId, setSetId] = useState('set1');
  const [questions, setQuestions] = useState<EnglishGrammarQuestion[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const parseQuestion = (item: unknown, index: number): EnglishGrammarQuestion => {
    const q = item as Partial<EnglishGrammarQuestion>;
    const options = Array.isArray(q.options) ? q.options.map(String).slice(0, 4) : ['', '', '', ''];

    return {
      id: q.id || `${index + 1}`,
      category: q.category || categories[0],
      prompt: q.prompt || '',
      options: [...options, '', '', '', ''].slice(0, 4),
      correctAnswer: q.correctAnswer || options[0] || '',
      explanation: q.explanation || '',
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
        setMessage({ type: 'success', text: `Loaded ${parsedQuestions.length} English questions from JSON` });
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
        prompt: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
      },
    ]);
  };

  const updateQuestion = (id: string, field: keyof EnglishGrammarQuestion, value: unknown) => {
    setQuestions((current) => current.map((q) => q.id === id ? { ...q, [field]: value } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions((current) => current.filter((q) => q.id !== id).map((q, index) => ({ ...q, id: `${index + 1}` })));
  };

  const validateQuestions = () => {
    return questions.every((q) => (
      q.prompt.trim()
      && q.options.length === 4
      && q.options.every((option) => option.trim())
      && q.correctAnswer.trim()
      && q.options.includes(q.correctAnswer)
    ));
  };

  const handleSave = async () => {
    if (!questions.length) {
      setMessage({ type: 'error', text: 'Please add at least one question' });
      return;
    }

    if (!validateQuestions()) {
      setMessage({ type: 'error', text: 'Each question needs a prompt, 4 options, and a correct answer matching one option.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await saveEnglishGrammarSet(setId, questions);
      setMessage({ type: 'success', text: `Saved ${questions.length} English questions to ${setId}` });
      setQuestions([]);
    } catch {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template: EnglishGrammarQuestion[] = [
      {
        id: '1',
        category: 'Synonyms',
        prompt: 'Choose the closest synonym of "resilient".',
        options: ['adaptable', 'fragile', 'ordinary', 'careless'],
        correctAnswer: 'adaptable',
        explanation: 'Resilient means able to recover or adapt after difficulty.',
      },
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'english_grammar_template.json';
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
              <h1 className="text-xl font-bold">Upload English Grammar Questions</h1>
              <p className="text-sm text-muted-foreground">Manage Grammar & Vocabulary Test content</p>
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
              <p className="text-sm text-gray-600 mb-2">Upload an array of English questions</p>
              <p className="text-xs text-gray-500 mb-4">Fields: category, prompt, options[4], correctAnswer, explanation</p>
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
              <div className="text-center py-8 text-gray-500">No questions added yet.</div>
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
                      <Input value={question.prompt} onChange={(e) => updateQuestion(question.id, 'prompt', e.target.value)} placeholder="Question prompt" />
                      <div className="grid sm:grid-cols-2 gap-2">
                        {question.options.map((option, optionIndex) => (
                          <Input
                            key={optionIndex}
                            value={option}
                            onChange={(e) => {
                              const nextOptions = [...question.options];
                              nextOptions[optionIndex] = e.target.value;
                              updateQuestion(question.id, 'options', nextOptions);
                            }}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        ))}
                      </div>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                        className="w-full p-2 border rounded"
                      >
                        <option value="">Select correct answer</option>
                        {question.options.filter(Boolean).map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                      <Input value={question.explanation} onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)} placeholder="Explanation" />
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
