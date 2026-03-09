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

export default function TATInstructionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-4 sm:px-6 sm:py-6">

      {/* Top Header */}
      <div className="max-w-6xl mx-auto bg-white border rounded-lg px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-slate-900">
            Thematic Apperception Test (TAT)
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
          TAT Test Instructions
        </h2>

        {/* Important Notice */}
        <div className="bg-sky-100 text-sky-900 rounded-md px-3 py-3 mb-4 sm:mb-6 text-xs sm:text-sm leading-relaxed">
          <strong>Important:</strong> This is an <strong>offline writing test</strong>.
          No typing is required on the system. Candidates must keep their
          <strong> own pen and paper ready</strong> before starting the test.
          <br />
          <br />
          You will view a picture for <strong>30 seconds</strong>, followed by
          <strong> 4 minutes</strong> to write a story based on your perception.
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
                <li><strong>Picture Viewing:</strong> 30 seconds</li>
                <li><strong>Story Writing:</strong> 4 minutes</li>
                <li><strong>Auto-advance:</strong> After each phase</li>
              </ul>
            </div>

            {/* Key Points */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Key Points
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Observe carefully during picture viewing</li>
                <li>Create a complete and realistic story</li>
                <li>Include thoughts, actions, and outcome</li>
                <li>Give a logical and positive conclusion</li>
              </ul>
            </div>

          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">

            {/* What to Write */}
            <div>
              <p className="font-semibold mb-2 flex items-center gap-2">
                ✍️ What to Write
              </p>
              <ul className="space-y-1 ml-6 list-disc">
                <li>Characters in the picture (number, age, gender)</li>
                <li>What is happening in the situation</li>
                <li>What led to this situation</li>
                <li>What action is taken</li>
                <li>What will be the final outcome</li>
              </ul>
            </div>

            {/* Tip */}
            <div className="border rounded-md p-3 sm:p-4 bg-slate-50">
              <p className="font-semibold mb-1 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-500" />
                Tip
              </p>
              <p className="text-xs sm:text-sm leading-relaxed">
                Focus on <strong>positive themes</strong>, <strong>leadership qualities</strong>,
                <strong> sense of responsibility</strong>, and
                <strong> practical problem-solving</strong> in your story.
                Avoid fantasy, extreme emotions, or unrealistic conclusions.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 sm:mt-8">
          <Button
            size="lg"
            className="bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto px-6 sm:px-8"
            onClick={() => navigate('/tat/sets')}
          >
            🚀 Start TAT Test
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Picture appears for 30 seconds, then 4 minutes to write
          </p>
        </div>

      </div>
    </div>
  );
}
