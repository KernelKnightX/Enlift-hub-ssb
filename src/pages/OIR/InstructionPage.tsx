import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  FileText,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';

export default function OIRInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            Officer Intelligence Rating (OIR)
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">SSB Psychological Test</Badge>
            <span className="text-emerald-600">
              Welcome, Officer Aspirant!
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
          OIR Test Instructions
        </h2>

        {/* Important Notice */}
        <div className="bg-sky-100 text-sky-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Important:</strong> This is an <strong>intelligence test</strong>.
          Answer all questions to the best of your ability.
          <br />
          <br />
          Select the <strong>most appropriate answer</strong> for each question.
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm text-slate-700">

          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* Timing */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Timing
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li><strong>Total Time:</strong> 40 minutes</li>
                <li><strong>Per Question:</strong> ~30 seconds</li>
                <li><strong>Free Navigation:</strong> Move between questions</li>
              </ul>
            </div>

            {/* Key Points */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Points
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Attempt all questions</li>
                <li>Manage time wisely</li>
                <li>Review before submitting</li>
                <li>Trust your instincts</li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* What to Write */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                ✍️ How to Answer
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Observe the picture carefully</li>
                <li>Read all options thoroughly</li>
                <li>Select the most accurate answer</li>
                <li>Answers can be changed anytime</li>
              </ul>
            </div>

            {/* Tip */}
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Tip
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Focus on <strong>logical reasoning</strong> and <strong>observation skills</strong>.
                Avoid guessing - eliminate wrong answers first.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 sm:px-8"
            onClick={() => navigate('/oir/sets')}
          >
            🚀 Start OIR Test
          </Button>
        </div>

      </div>
    </div>
  );
}
