import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, ArrowLeft, CheckCircle, FileJson, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { saveSpeedRecognitionSet } from '@/lib/testDataService';
import type { SpeedRecognitionAnswerKey, SpeedRecognitionDifficulty, SpeedRecognitionQuestion } from '@/types/schema';

const difficulties: SpeedRecognitionDifficulty[] = ['easy', 'medium', 'hard'];
const answerKeys: SpeedRecognitionAnswerKey[] = ['A', 'B', 'C', 'D'];

function emptyQuestion(id: string): SpeedRecognitionQuestion {
  return {
    id,
    targetImage: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    difficulty: 'medium',
  };
}

export default function AdminSpeedRecognitionUploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setId, setSetId] = useState('set1');
  const [questions, setQuestions] = useState<SpeedRecognitionQuestion[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const parseQuestion = (item: unknown, index: number): SpeedRecognitionQuestion => {
    const q = item as Partial<SpeedRecognitionQuestion>;
    return {
      id: q.id || `${index + 1}`,
      targetImage: q.targetImage || '',
      optionA: q.optionA || '',
      optionB: q.optionB || '',
      optionC: q.optionC || '',
      optionD: q.optionD || '',
      correctAnswer: answerKeys.includes(q.correctAnswer as SpeedRecognitionAnswerKey) ? q.correctAnswer as SpeedRecognitionAnswerKey : 'A',
      difficulty: difficulties.includes(q.difficulty as SpeedRecognitionDifficulty) ? q.difficulty as SpeedRecognitionDifficulty : 'medium',
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
        setMessage({ type: 'success', text: `Loaded ${parsedQuestions.length} Speed Recognition questions from JSON` });
      } catch {
        setMessage({ type: 'error', text: 'Invalid JSON format. Please check the file.' });
      }
    };
    reader.readAsText(file);
  };

  const updateQuestion = (id: string, field: keyof SpeedRecognitionQuestion, value: unknown) => {
    setQuestions((current) => current.map((question) => question.id === id ? { ...question, [field]: value } : question));
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, emptyQuestion(`${current.length + 1}`)]);
  };

  const removeQuestion = (id: string) => {
    setQuestions((current) => current.filter((question) => question.id !== id).map((question, index) => ({ ...question, id: `${index + 1}` })));
  };

  const validateQuestions = () => questions.every((question) => (
    question.targetImage.trim()
    && question.optionA.trim()
    && question.optionB.trim()
    && question.optionC.trim()
    && question.optionD.trim()
    && answerKeys.includes(question.correctAnswer)
    && difficulties.includes(question.difficulty)
  ));

  const handleSave = async () => {
    if (!questions.length) {
      setMessage({ type: 'error', text: 'Please add at least one question.' });
      return;
    }

    if (!validateQuestions()) {
      setMessage({ type: 'error', text: 'Every question requires targetImage, optionA-D, correctAnswer, and difficulty.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      await saveSpeedRecognitionSet(setId, questions);
      setMessage({ type: 'success', text: `Saved ${questions.length} Speed Recognition questions to ${setId}` });
      setQuestions([]);
    } catch {
      setMessage({ type: 'error', text: 'Failed to save questions. Please try again.' });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    const template: SpeedRecognitionQuestion[] = [
      {
        id: '1',
        targetImage: '/images/speed-recognition/vehicle-target.svg',
        optionA: '/images/speed-recognition/vehicle-target.svg',
        optionB: '/images/speed-recognition/vehicle-rotated.svg',
        optionC: '/images/speed-recognition/shape-target.svg',
        optionD: '/images/speed-recognition/object-target.svg',
        correctAnswer: 'A',
        difficulty: 'easy',
      },
    ];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'speed_recognition_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Upload Speed Recognition Questions</h1>
              <p className="text-sm text-muted-foreground">Firestore-backed cognitive speed test content</p>
            </div>
          </div>
          <Badge variant="outline">Admin Mode</Badge>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {message && (
          <Card className={`mb-6 ${message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CardContent className="flex items-center gap-3 py-4">
              {message.type === 'error' ? <AlertCircle className="h-5 w-5 text-red-500" /> : <CheckCircle className="h-5 w-5 text-green-500" />}
              <span className={message.type === 'error' ? 'text-red-700' : 'text-green-700'}>{message.text}</span>
              <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessage(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Upload JSON File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
              <Upload className="mx-auto mb-4 h-10 w-10 text-gray-400" />
              <p className="mb-2 text-sm text-gray-600">Upload an array of Speed Recognition questions</p>
              <p className="mb-4 text-xs text-gray-500">Fields: targetImage, optionA, optionB, optionC, optionD, correctAnswer, difficulty</p>
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
            <select id="setId" value={setId} onChange={(e) => setSetId(e.target.value)} className="w-full rounded-lg border-2 border-slate-200 bg-background p-3 focus:outline-none focus:ring-2 focus:ring-amber-500">
              {Array.from({ length: 10 }, (_, index) => (
                <option key={index + 1} value={`set${index + 1}`}>Set {index + 1}</option>
              ))}
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Questions ({questions.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {!questions.length ? (
              <div className="py-8 text-center text-gray-500">No questions added yet.</div>
            ) : (
              <div className="max-h-[620px] space-y-4 overflow-y-auto">
                {questions.map((question, index) => (
                  <div key={question.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-start justify-between">
                      <span className="text-sm text-gray-500">Q{index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeQuestion(question.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-3">
                      <Input value={question.targetImage} onChange={(e) => updateQuestion(question.id, 'targetImage', e.target.value)} placeholder="Target image URL" />
                      <div className="grid gap-2 sm:grid-cols-2">
                        {answerKeys.map((key) => (
                          <Input key={key} value={question[`option${key}` as keyof SpeedRecognitionQuestion] as string} onChange={(e) => updateQuestion(question.id, `option${key}` as keyof SpeedRecognitionQuestion, e.target.value)} placeholder={`Option ${key} image URL`} />
                        ))}
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <select value={question.correctAnswer} onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value as SpeedRecognitionAnswerKey)} className="rounded border p-2">
                          {answerKeys.map((key) => <option key={key} value={key}>Correct: {key}</option>)}
                        </select>
                        <select value={question.difficulty} onChange={(e) => updateQuestion(question.id, 'difficulty', e.target.value as SpeedRecognitionDifficulty)} className="rounded border p-2">
                          {difficulties.map((difficulty) => <option key={difficulty} value={difficulty}>{difficulty}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button size="lg" onClick={handleSave} disabled={uploading || !questions.length}>
            <Save className="mr-2 h-4 w-4" />
            {uploading ? 'Saving...' : 'Save to Firebase'}
          </Button>
        </div>
      </div>
    </div>
  );
}
