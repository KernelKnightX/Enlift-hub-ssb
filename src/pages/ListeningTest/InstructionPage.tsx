import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  FileText,
  CheckCircle,
  Lightbulb,
  Headphones,
} from 'lucide-react';

export default function ListeningInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            Listening Test
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Audio Recall Assessment</Badge>
            <span className="text-emerald-600">
              Cognitive Skills Test
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Instruction Card */}
      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Test Instructions
        </h2>

        {/* Important Notice */}
        <div className="bg-sky-100 text-sky-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Format:</strong> You will hear <strong>4 words</strong> spoken aloud once (cannot be replayed).
          Then you must <strong>select those 4 words</strong> from a grid of 12 candidates in <strong>8 seconds</strong>.
          <br />
          <br />
          <strong>Headphones Recommended:</strong> Use quality headphones for best results. Sound quality affects performance.
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm text-slate-700">

          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* Timing */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timing & Format
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li><strong>Total Questions:</strong> 30</li>
                <li><strong>Audio Transmission:</strong> 4 words, spoken once</li>
                <li><strong>Recall Window:</strong> 8 seconds</li>
                <li><strong>Selection Required:</strong> Exactly 4 words</li>
                <li><strong>Total Time:</strong> ~6-8 minutes</li>
              </ul>
            </div>

            {/* How it Works */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Headphones className="w-4 h-4" />
                How It Works
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Listen to 4 words (no replay)</li>
                <li>12 word options appear</li>
                <li>Select the 4 heard words</li>
                <li>4th selection auto-submits</li>
                <li>Auto-advance to next question</li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* Strategy */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Winning Strategy
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Focus completely during audio</li>
                <li>Repeat words mentally</li>
                <li>Scan options immediately</li>
                <li>Select with confidence</li>
                <li>Use keyboard shortcuts (1-9, 0, -, =)</li>
              </ul>
            </div>

            {/* Tip */}
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Pro Tip
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Audio clarity matters. Use quality headphones. Minimize distractions.
                The brain processes phonetics within the 8-second window—speed and accuracy are key.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 sm:px-8"
            onClick={() => navigate('/listening/sets')}
          >
            🚀 Start Listening Test
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            4 words heard • 8 second recall • 30 questions
          </p>
        </div>

      </div>
    </div>
  );
}
