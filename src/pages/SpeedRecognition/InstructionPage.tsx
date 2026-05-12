import { useNavigate } from 'react-router';
import { ArrowLeft, CheckCircle, Clock, Crosshair, FileText, Lightbulb, Radar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SpeedRecognitionInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">Speed Recognition Test</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Cognitive Speed Test</Badge>
            <span className="text-amber-600">Defence Aptitude Assessment</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      <div className="max-w-6xl mx-auto bg-white border rounded-xl shadow-sm p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Test Instructions
        </h2>

        <div className="bg-amber-100 text-amber-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Important:</strong> This test evaluates your <strong>observation speed</strong>, <strong>pattern recognition</strong>, and <strong>fast decision making</strong>.
          You will see a target object and must select the identical match from four options.
          <br />
          <br />
          Each question has <strong>3 seconds</strong> to respond. The test auto-submits on timeout.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm text-slate-700">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Timing & Format</p>
              <ul className="space-y-1 ml-6 list-disc">
                <li><strong>Total Questions:</strong> 30</li>
                <li><strong>Time per question:</strong> 3 seconds</li>
                <li><strong>Auto-submit:</strong> On timeout</li>
                <li><strong>Options:</strong> 4 choices (A, B, C, D)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> How to Answer</p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Observe the target object carefully</li>
                <li>Compare shape, direction, and small details</li>
                <li>Select the identical option quickly</li>
                <li>Use keyboard shortcuts A, B, C, D if preferred</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2"><Radar className="w-4 h-4" /> Test Focus</p>
              <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                <p className="text-xs sm:text-sm leading-relaxed mb-2">
                  <strong>Target:</strong> One object is shown on the left.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed">
                  <strong>Task:</strong> Select the option that is exactly identical. Similar rotated or altered objects are distractors.
                </p>
              </div>
            </div>
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Pro Tip</p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Scan the outline first, then verify one or two distinguishing details. Do not overthink because the timer is intentionally short.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white w-full sm:w-auto px-6 sm:px-8" onClick={() => navigate('/speed-recognition/sets')}>
            <Crosshair className="w-5 h-5 mr-2" />
            Select Set
          </Button>
        </div>
      </div>
    </div>
  );
}
