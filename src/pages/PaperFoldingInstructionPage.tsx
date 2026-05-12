import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  Lightbulb,
  Target,
} from 'lucide-react';

export default function PaperFoldingInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">Paper Folding & Hole Punching Test</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Spatial Reasoning Test</Badge>
            <span className="text-emerald-600">Defence Aptitude Assessment</span>
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

        <div className="bg-sky-100 text-sky-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Important:</strong> This test evaluates your <strong>spatial visualization</strong> and <strong>reasoning ability</strong>.
          You will see a folded paper with hole punches and must identify the correct unfolded pattern.
          <br />
          <br />
          Each question has <strong>30 seconds</strong> to respond. The test auto-advances on timeout.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 text-xs sm:text-sm text-slate-700">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Timing & Format</p>
              <ul className="space-y-1 ml-6 list-disc">
                <li><strong>Questions:</strong> 10 (sample set)</li>
                <li><strong>Time per question:</strong> 30 seconds</li>
                <li><strong>Auto-advance:</strong> On timeout</li>
                <li><strong>Options:</strong> 4 choices (A, B, C, D)</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> How to Answer</p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Observe the folded paper carefully</li>
                <li>Note the position of hole punches</li>
                <li>Mentally unfold the paper</li>
                <li>Select the matching unfolded pattern</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2"><Target className="w-4 h-4" /> Sample Question</p>
              <div className="border border-slate-200 rounded-md p-3 bg-slate-50">
                <p className="text-xs sm:text-sm leading-relaxed mb-2">
                  <strong>Folded Paper:</strong> A square paper folded in half horizontally and vertically, with holes punched at specific positions.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed">
                  <strong>Task:</strong> Choose which of the 4 options shows the correct pattern when the paper is unfolded.
                </p>
              </div>
            </div>
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-yellow-500" /> Pro Tip</p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Visualize the folding sequence in reverse. Start from the final folded state and work backwards to the unfolded form.
                Pay close attention to how folds affect hole positions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 sm:px-8" onClick={() => navigate('/paper-folding/sets')}>
            <Target className="w-5 h-5 mr-2" />
            Select Set
          </Button>
        </div>
      </div>
    </div>
  );
}
