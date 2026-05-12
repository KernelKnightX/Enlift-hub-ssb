import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Clock,
  FileText,
  CheckCircle,
  Lightbulb,
  Zap,
} from 'lucide-react';

export default function EnglishInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            English Grammar & Vocabulary Test
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs sm:text-sm">
            <Badge variant="secondary">Verbal Aptitude Test</Badge>
            <span className="text-emerald-600">
              Defence Entrance Exam Prep
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
          <strong>Format:</strong> Multiple-choice questions on <strong>grammar, vocabulary, synonyms, antonyms, analogies,</strong> and <strong>reading comprehension</strong>.
          <br />
          <br />
          Each question has <strong>fixed time limit</strong>. Manage your time wisely and attempt maximum questions.
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
                <li><strong>Total Questions:</strong> 50</li>
                <li><strong>Time per Question:</strong> 30 seconds</li>
                <li><strong>Total Time:</strong> 25 minutes</li>
                <li><strong>Auto-advance:</strong> After each question</li>
              </ul>
            </div>

            {/* Question Types */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Question Types
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Grammar Rules</li>
                <li>Vocabulary & Spelling</li>
                <li>Synonyms & Antonyms</li>
                <li>Analogies</li>
                <li>Reading Comprehension</li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* How to Approach */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                How to Approach
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Read the question carefully</li>
                <li>Eliminate obviously wrong options</li>
                <li>Select the most appropriate answer</li>
                <li>Don't spend too much time on one question</li>
                <li>Skip difficult questions and return if time permits</li>
              </ul>
            </div>

            {/* Tip */}
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Pro Tip
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Build vocabulary daily. Understand grammar concepts fundamentally.
                Practice timed tests regularly to improve speed and accuracy.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 sm:px-8"
            onClick={() => navigate('/english/sets')}
          >
            🚀 Start English Test
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            30 seconds per question • 50 questions total
          </p>
        </div>

      </div>
    </div>
  );
}
