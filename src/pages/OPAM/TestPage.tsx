import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { PsychCandidateVerificationGate } from '@/components/practice/PsychCandidateVerificationGate';
import { savePracticeSession } from '@/utils/practiceHistory';
import { useOPAMQuestions } from '@/hooks/useTestData';
import { opamSections, getOPAMInterpretation } from '@/data/opamQuestions';

const choices = [
  { value: 1, label: 'Strongly Disagree', color: 'bg-red-100 text-red-700' },
  { value: 2, label: 'Disagree', color: 'bg-orange-100 text-orange-700' },
  { value: 3, label: 'Neutral', color: 'bg-slate-100 text-slate-800' },
  { value: 4, label: 'Agree', color: 'bg-emerald-100 text-emerald-700' },
  { value: 5, label: 'Strongly Agree', color: 'bg-blue-100 text-blue-700' },
];

export default function OPAMTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const setId = searchParams.get('set') || 'opam-default';
  const { data: opamQuestions, loading } = useOPAMQuestions(setId, 120);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [completed, setCompleted] = useState(false);
  const [startTime] = useState(new Date());
  const [saved, setSaved] = useState(false);
  const [candidateVerified, setCandidateVerified] = useState(false);

  useEffect(() => {
    if (opamQuestions.length > 0 && answers.length !== opamQuestions.length) {
      setAnswers(Array(opamQuestions.length).fill(null));
      setCurrent(0);
    }
  }, [opamQuestions.length]);

  const TOTAL_QUESTIONS = opamQuestions.length;
  const currentQuestion = opamQuestions[current];
  const section = currentQuestion
    ? opamSections.find((sec) => sec.label === currentQuestion.section)
    : undefined;
  const sectionQuestions = currentQuestion
    ? opamQuestions.filter((question) => question.section === currentQuestion.section)
    : [];
  const sectionAnswered = sectionQuestions.filter((question) => answers[question.id - 1] !== null).length;
  const answeredCount = answers.filter((answer) => answer !== null).length;
  const unansweredCount = TOTAL_QUESTIONS - answeredCount;

  const handleAnswer = (value: number) => {
    const copy = [...answers];
    copy[current] = value;
    setAnswers(copy);
  };

  const handleSubmit = () => {
    setCompleted(true);
  };

  useEffect(() => {
    if (!completed || saved) return;

    if (user) {
      const endTime = new Date();
      savePracticeSession({
        id: crypto.randomUUID(),
        userId: user.id,
        testType: 'opam',
        set: setId,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        status: 'completed',
        score: undefined,
        totalItems: TOTAL_QUESTIONS,
        answeredItems: answeredCount,
        totalTimeMinutes: Math.max(1, Math.round((endTime.getTime() - startTime.getTime()) / 60000)),
        responses: answers.map((answer) => (answer !== null ? answer.toString() : '')),
      });
    }

    setSaved(true);
  }, [completed, user, startTime, answers, answeredCount, saved]);

  const sectionResults = opamSections.map((sectionDef) => {
    const sectionScore = opamQuestions
      .filter((question) => question.section === sectionDef.label)
      .reduce((sum, question) => sum + (answers[question.id - 1] || 0), 0);

    return {
      ...sectionDef,
      score: sectionScore,
      interpretation: getOPAMInterpretation(sectionScore),
    };
  });

  const averageScore = sectionResults.length > 0
    ? Math.round(sectionResults.reduce((sum, item) => sum + item.score, 0) / sectionResults.length)
    : 0;

  if (!isAuthenticated && !candidateVerified) {
    return (
      <PsychCandidateVerificationGate
        label="OPAM"
        color="#0f172a"
        onVerified={() => setCandidateVerified(true)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center py-24 text-slate-600">
          <p className="text-lg font-semibold">Loading OPAM questions…</p>
          <p className="mt-3 text-sm">Please wait while the assessment content loads.</p>
        </div>
      </div>
    );
  }

  if (!loading && TOTAL_QUESTIONS === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center py-24 text-slate-600">
          <p className="text-lg font-semibold">No OPAM questions are available.</p>
          <p className="mt-3 text-sm">Please contact your administrator to upload the OPAM question set.</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <Card>
            <CardContent className="space-y-6 p-8">
              <div className="flex items-center gap-3 text-slate-900">
                <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 uppercase tracking-[0.2em]">OPAM Complete</p>
                  <h1 className="text-3xl font-bold">Your OLQ Profile</h1>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <p className="text-sm text-slate-500 mb-2">Completed questions</p>
                  <p className="text-4xl font-semibold text-slate-900">{answeredCount} / {TOTAL_QUESTIONS}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-white p-6">
                  <p className="text-sm text-slate-500 mb-2">Average OLQ score</p>
                  <p className="text-4xl font-semibold text-slate-900">{averageScore} / 40</p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-semibold mb-4">Your OPAM result categories</h2>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Excellent', range: '32–40', color: 'bg-emerald-100 text-emerald-700' },
                    { label: 'Good', range: '24–31', color: 'bg-sky-100 text-sky-700' },
                    { label: 'Average', range: '16–23', color: 'bg-amber-100 text-amber-700' },
                    { label: 'Needs Improvement', range: '8–15', color: 'bg-red-100 text-red-700' },
                  ].map((item) => (
                    <div key={item.label} className={`rounded-2xl p-4 ${item.color}`}>
                      <p className="text-sm font-semibold">{item.label}</p>
                      <p className="text-sm">{item.range}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                <div className="grid grid-cols-[1fr_80px_120px_160px] gap-4 px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-50">
                  <span>OLQ</span>
                  <span>Score</span>
                  <span>Interpretation</span>
                  <span>Graph</span>
                </div>
                {sectionResults.map((result) => (
                  <div key={result.number} className="grid grid-cols-[1fr_80px_120px_160px] gap-4 px-6 py-4 border-t border-slate-200 text-sm text-slate-700 items-center">
                    <span>{result.number}. {result.label}</span>
                    <span className="font-semibold">{result.score}</span>
                    <span>{result.interpretation}</span>
                    <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          result.interpretation === 'Excellent'
                            ? 'bg-emerald-500'
                            : result.interpretation === 'Good'
                            ? 'bg-sky-500'
                            : result.interpretation === 'Average'
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${(result.score / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Button onClick={() => navigate('/dashboard')}>
                  Back to Dashboard
                </Button>
                <Button variant="outline" onClick={() => navigate('/opam/sets')}>
                  Retake OPAM
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">OPAM Assessment</p>
            <h1 className="text-3xl font-bold text-slate-900">Officer Potential Assessment</h1>
            <p className="mt-2 text-sm text-slate-600">
              Section {section?.number}: {section?.label} — question {current + 1} of {TOTAL_QUESTIONS}
            </p>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Clock className="w-5 h-5" />
            <span>{answeredCount} completed</span>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {sectionAnswered}/{sectionQuestions.length} in this section
            </span>
          </div>
        </div>

        <Progress value={(answeredCount / TOTAL_QUESTIONS) * 100} className="h-2 rounded-full mb-6" />

        <Card>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-slate-500">Statement {current + 1}/{TOTAL_QUESTIONS}</span>
                <Badge variant="secondary">{section?.label}</Badge>
              </div>
              <p className="text-xl leading-9 text-slate-900">{currentQuestion.prompt}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {choices.map((choice) => (
                <button
                  key={choice.value}
                  type="button"
                  onClick={() => handleAnswer(choice.value)}
                  className={`rounded-2xl border px-4 py-5 text-left transition ${
                    answers[current] === choice.value
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold">{choice.label}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Button
                variant="outline"
                disabled={current === 0}
                onClick={() => setCurrent((prev) => Math.max(prev - 1, 0))}
              >
                <ChevronLeft className="w-4 h-4 mr-2" /> Previous
              </Button>
              <Button
                variant="outline"
                disabled={current === TOTAL_QUESTIONS - 1}
                onClick={() => setCurrent((prev) => Math.min(prev + 1, TOTAL_QUESTIONS - 1))}
              >
                Next <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
              <Button className="w-full" onClick={handleSubmit}>
                Submit Assessment
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-900 mb-2">How results are shown</p>
              <p>
                Each section is scored out of 40. The result page shows your OLQ scores and categories. Your raw answer choices are not shown back to students.
              </p>
              {unansweredCount > 0 && (
                <p className="mt-3 text-sm text-amber-700">
                  {unansweredCount} question{unansweredCount > 1 ? 's' : ''} are unanswered. Complete all questions for the most accurate profile.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
