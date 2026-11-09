import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Target,
  FileText,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getCompletedSets } from '@/utils/practiceHistory';
import { getOPAMSetSummaries } from '@/lib/testDataService';

export default function OPAMSetSelectionPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [availableSets, setAvailableSets] = useState<Array<{ setId: string; questionCount: number }>>([]);
  const [loadingSets, setLoadingSets] = useState(true);
  const [setLoadError, setSetLoadError] = useState('');

  useEffect(() => {
    let active = true;
    getOPAMSetSummaries()
      .then((sets) => {
        if (!active) return;
        const uploadedSets = sets.map(({ setId, questions }) => ({
          setId,
          questionCount: questions.length,
        }));
        if (!uploadedSets.some((set) => set.setId === 'opam-default')) {
          uploadedSets.unshift({ setId: 'opam-default', questionCount: 120 });
        }
        setAvailableSets(uploadedSets);
      })
      .catch((error: unknown) => {
        console.error('Failed to load OPAM sets:', error);
        if (active) setSetLoadError('Could not load available assessments. Please refresh and try again.');
      })
      .finally(() => {
        if (active) setLoadingSets(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const isSetCompleted = (setId: string) => user
    ? getCompletedSets(user.id, 'opam').includes(setId)
    : false;

  const handleSetClick = (setId: string) => {
    setSelectedSet(setId);
  };

  const handleStartTest = () => {
    if (selectedSet) {
      navigate(`/opam/test?set=${selectedSet}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            OPAM Set Selection
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Officer Like Qualities Assessment</Badge>
            <span className="text-slate-600 font-medium">
              Select one OPAM set to begin
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/opam/instructions')}
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">

        {/* Info Box */}
        <div className="bg-slate-100 text-slate-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm">
          <strong>OPAM Assessment:</strong> This assessment contains <strong>120 statements</strong> across 15 Officer Like Qualities. Total time: <strong>20-30 minutes</strong>.
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 text-xs sm:text-sm">

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <FileText className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Statements</p>
              <p className="text-slate-600 text-xs">120 items</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Target className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">OLQs</p>
              <p className="text-slate-600 text-xs">15 qualities</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Total Time</p>
              <p className="text-slate-600 text-xs">20-30 min</p>
            </div>
          </div>

          <div className="border rounded-lg p-3 flex flex-col items-center text-center gap-2">
            <CheckCircle className="w-5 h-5 text-slate-700" />
            <div>
              <p className="font-semibold">Scale</p>
              <p className="text-slate-600 text-xs">1-5 Likert</p>
            </div>
          </div>

        </div>

        {setLoadError && (
          <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {setLoadError}
          </p>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {loadingSets ? (
            <div className="col-span-full flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading available assessments…
            </div>
          ) : availableSets.map(({ setId, questionCount }) => {
            const completed = isSetCompleted(setId);
            const selected = selectedSet === setId;
            return (
              <button
                key={setId}
                type="button"
                onClick={() => handleSetClick(setId)}
                className={`relative rounded-lg border p-4 text-left transition sm:p-6 ${
                  selected
                    ? 'border-slate-900 bg-slate-50'
                    : completed
                      ? 'border-emerald-300 bg-emerald-50 hover:border-emerald-400'
                      : 'border-slate-200 hover:border-slate-400'
                }`}
              >
                {completed && <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-emerald-600" />}
                <p className={`break-all text-base font-semibold sm:text-lg ${completed ? 'text-emerald-700' : 'text-slate-900'}`}>
                  {setId === 'opam-default' ? 'OPAM Assessment Set' : setId}
                </p>
                <p className={`mt-1 text-xs sm:text-sm ${completed ? 'text-emerald-600' : 'text-slate-600'}`}>
                  {completed ? '✓ Completed' : 'Available'} · {questionCount} statements
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">{setId === 'opam-default' ? 'Standard Assessment' : 'Uploaded Set'}</Badge>
                  <Badge variant="outline" className="text-xs">20-30 minutes</Badge>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Set Summary */}
        {selectedSet && (
          <div className="border border-slate-300 bg-slate-50 rounded-md p-3 sm:p-4 text-xs sm:text-sm text-slate-700 mb-4 sm:mb-6">
            <p className="font-semibold mb-2 flex items-center gap-2 text-slate-900">
              <CheckCircle className="w-4 h-4" />
              Selected: {selectedSet === 'opam-default' ? 'OPAM Assessment Set' : selectedSet}
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Complete all 120 statements for accurate assessment</li>
              <li>Answer honestly based on your natural reactions</li>
              <li>There are no right or wrong answers</li>
              <li>You can review your profile after submission</li>
            </ul>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Button
            variant="outline"
            className="flex-1 sm:flex-none"
            onClick={() => navigate('/opam/instructions')}
          >
            Back to Instructions
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
            onClick={handleStartTest}
            disabled={!selectedSet}
          >
            🚀 Start OPAM Assessment
          </Button>
        </div>

      </div>
    </div>
  );
}
