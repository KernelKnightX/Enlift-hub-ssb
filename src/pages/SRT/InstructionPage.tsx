import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  FileText,
  CheckCircle,
  Lightbulb,
  Target,
} from 'lucide-react';

export default function SRTInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            Situation Reaction Test (SRT)
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
          SRT Test Instructions
        </h2>

        {/* Important Notice */}
        <div className="bg-sky-100 text-sky-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Important:</strong> This is an <strong>offline writing test</strong>.
          No typing is required on the system. Candidates must keep their
          <strong> own pen and paper ready</strong> before starting the test.
          <br />
          <br />
          You will read a <strong>situation</strong> and write <strong>what you would do</strong>.
          There are <strong>30 situations</strong> in total.
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
                <li><strong>Total Situations:</strong> 30 per set</li>
                <li><strong>Time per Situation:</strong> ~30 seconds</li>
                <li><strong>Total Duration:</strong> 15 minutes</li>
              </ul>
            </div>

            {/* Key Points */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Points
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Read the situation carefully</li>
                <li>Write practical and realistic actions</li>
                <li>Show quick decision making</li>
                <li>Be specific about your response</li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* What to Write */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                What to Write
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>What action you would take</li>
                <li>Steps you would follow</li>
                <li>How you would handle the situation</li>
                <li>Practical and realistic approach</li>
                <li>Leadership qualities in action</li>
              </ul>
            </div>

            {/* Tip */}
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Tip
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Focus on <strong>practical solutions</strong>, <strong>quick thinking</strong>,
                and <strong>leadership</strong>. Avoid overly ideal or unrealistic responses.
                Show maturity and common sense in your reactions.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 sm:px-8"
            onClick={() => navigate('/srt/sets')}
          >
            🚀 Start SRT Test
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            30 situations per set
          </p>
        </div>

      </div>
    </div>
  );
}
