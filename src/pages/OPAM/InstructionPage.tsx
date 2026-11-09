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

export default function OPAMInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            OPAM — Officer Potential Assessment Measure
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Officer Like Qualities Assessment</Badge>
            <span className="text-slate-600">
              Welcome, Officer Aspirant!
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 w-full sm:w-auto justify-center"
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
          OPAM Test Instructions
        </h2>

        {/* Important Notice */}
        <div className="bg-sky-100 text-sky-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Important:</strong> OPAM is a <strong>120-item psychological assessment</strong> based on the 15 Officer Like Qualities (OLQs) used in the updated Computerised Stage-1 Selection System (CSSS) for SSB interviews.
          <br />
          <br />
          Answer honestly using the <strong>5-point Likert scale</strong> (1 = Strongly Disagree to 5 = Strongly Agree). There are <strong>no right or wrong answers</strong>.
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
                <li><strong>Total Statements:</strong> 120</li>
                <li><strong>Time Required:</strong> 20-30 minutes</li>
                <li><strong>Response Time:</strong> ~10-15 seconds per statement</li>
                <li><strong>Can Save Progress:</strong> Not required</li>
              </ul>
            </div>

            {/* Key Points */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Points
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Answer honestly and spontaneously</li>
                <li>There are no right or wrong answers</li>
                <li>Base your responses on your natural reactions</li>
                <li>Complete all 120 items for accurate assessment</li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* Officer Like Qualities */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                🎖️ 15 Officer Like Qualities (OLQs)
              </p>
              <ul className="text-xs space-y-1 ml-6 list-disc">
                <li>Effective Intelligence</li>
                <li>Reasoning Ability</li>
                <li>Organizing Ability</li>
                <li>Power of Expression</li>
                <li>Social Adaptability</li>
                <li>Cooperation</li>
                <li>Sense of Responsibility</li>
                <li>Initiative & Self Confidence</li>
                <li>Speed of Decision & Leadership</li>
                <li>Liveliness & Stamina</li>
              </ul>
            </div>

            {/* Scoring */}
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Scoring
              </p>
              <div className="text-xs space-y-1 text-slate-700">
                <p><strong>Each OLQ ranges from 8 to 40 points:</strong></p>
                <p>• 32–40: Excellent | • 24–31: Good</p>
                <p>• 16–23: Average | • 8–15: Needs Improvement</p>
              </div>
            </div>

          </div>
        </div>

        {/* Likert Scale Reference */}
        <div className="mt-6 sm:mt-8 rounded-lg bg-amber-50 border border-amber-200 p-4">
          <p className="font-semibold text-amber-900 mb-3">5-Point Likert Scale:</p>
          <div className="grid grid-cols-5 gap-2 text-xs">
            <div className="text-center p-2 bg-white border rounded">
              <p className="font-semibold">1</p>
              <p className="text-amber-700 text-xs">Strongly<br/>Disagree</p>
            </div>
            <div className="text-center p-2 bg-white border rounded">
              <p className="font-semibold">2</p>
              <p className="text-amber-700 text-xs">Disagree</p>
            </div>
            <div className="text-center p-2 bg-white border rounded">
              <p className="font-semibold">3</p>
              <p className="text-amber-700 text-xs">Neutral</p>
            </div>
            <div className="text-center p-2 bg-white border rounded">
              <p className="font-semibold">4</p>
              <p className="text-amber-700 text-xs">Agree</p>
            </div>
            <div className="text-center p-2 bg-white border rounded">
              <p className="font-semibold">5</p>
              <p className="text-amber-700 text-xs">Strongly<br/>Agree</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-slate-900 hover:bg-slate-800 text-white w-full sm:w-auto px-6 sm:px-8"
            onClick={() => navigate('/opam/sets')}
          >
            🚀 Start OPAM Assessment
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Takes approximately 20-30 minutes to complete
          </p>
        </div>

      </div>
    </div>
  );
}
