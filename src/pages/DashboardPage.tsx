import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NavbarSection } from '@/pages/navbar/NavbarSection';
import {
  Image,
  MessageSquare,
  PenTool,
  BookOpen,
  ArrowRight,
  Clock,
  Award,
  Target,
  Users,
  GraduationCap,
} from 'lucide-react';

const practiceModules = [
  {
    id: 'ppdt',
    name: 'PPDT',
    title: 'Picture Perception & Description',
    description: 'Story writing based on images',
    icon: Image,
    path: '/ppdt/instructions',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    id: 'tat',
    name: 'TAT',
    title: 'Thematic Apperception Test',
    description: 'Imagination and attitude test',
    icon: BookOpen,
    path: '/tat/instructions',
    color: 'from-green-500 to-green-600',
    bgLight: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    id: 'wat',
    name: 'WAT',
    title: 'Word Association Test',
    description: 'Spontaneous word responses',
    icon: PenTool,
    path: '/wat/instructions',
    color: 'from-orange-500 to-orange-600',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
  {
    id: 'srt',
    name: 'SRT',
    title: 'Situation Reaction Test',
    description: 'Practical judgment scenarios',
    icon: MessageSquare,
    path: '/srt/instructions',
    color: 'from-red-500 to-red-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
  },
  {
    id: 'ssbprep',
    name: 'SSB Prep',
    title: 'SSB Interview Preparation',
    description: 'Lecturette, Interview, GD & GTO',
    icon: GraduationCap,
    path: '/ssb-preparation',
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentTime.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <NavbarSection />

      {/* Main - with padding top for fixed navbar */}
      <main className="max-w-7xl mx-auto px-4 py-6 pt-20">
        {/* Welcome */}
        <Card className="mb-6 bg-gradient-to-br from-blue-50 to-green-50">
          <CardContent className="py-4 px-4">
            <Badge className="mb-2 bg-green-600 text-white">Active Session</Badge>
            <h2 className="text-xl sm:text-2xl font-bold">
              Welcome, {user?.fullName ? user.fullName.split(' ')[0] : 'Candidate'}!
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {formattedDate} • Train the Mind. Clear the Board.
            </p>
          </CardContent>
        </Card>

        {/* LETS CRACK SSB */}
        <h3 className="text-lg sm:text-xl font-bold mb-4">LETS CRACK SSB</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-8">
          {practiceModules.map((module) => {
            const Icon = module.icon;

            return (
              <Link key={module.id} to={module.path} className="h-full">
                <Card className="h-full min-h-[120px] sm:min-h-[140px] border-2 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all">
                  <div className={`h-1.5 sm:h-2 rounded-t-xl bg-gradient-to-r ${module.color}`} />

                  <CardContent className="h-full flex flex-col p-3 sm:p-4">
                    <Badge className="w-fit mb-2 text-xs">{module.name}</Badge>

                    <div className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 rounded-lg ${module.bgLight} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${module.textColor}`} />
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold mb-1">
                      {module.title}
                    </h4>

                    <p className="text-xs text-muted-foreground flex-1">
                      {module.description}
                    </p>

                    <div className="mt-2 flex items-center text-xs font-medium text-primary">
                      Start <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Extra Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Link to="/mentorship">
            <Card className="border-2 hover:shadow-lg bg-gradient-to-br from-green-50 to-blue-50 h-full">
              <CardContent className="py-4 px-4 flex gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 rounded-lg flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <Badge className="mb-1 bg-green-600 text-white text-xs">Mentorship</Badge>
                  <h4 className="text-base sm:text-lg font-bold mb-1">One-to-One SSB Session</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Personal guidance, OLQ feedback & officer-level evaluation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link to="/ssb-preparation">
            <Card className="border-2 hover:shadow-lg bg-gradient-to-br from-purple-50 to-orange-50 h-full">
              <CardContent className="py-4 px-4 flex gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-lg flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <Badge className="mb-1 bg-purple-600 text-white text-xs">Complete SSB</Badge>
                  <h4 className="text-base sm:text-lg font-bold mb-1">Other SSB Preparation</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Interview, GTO, Conference & full SSB process explained.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-muted-foreground px-2">
          <span className="flex items-center gap-1"><Award className="w-3 h-3 sm:w-4 sm:h-4" /> Unlimited Practice</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 sm:w-4 sm:h-4" /> Real SSB Timing</span>
          <span className="flex items-center gap-1"><Target className="w-3 h-3 sm:w-4 sm:h-4" /> OLQ Focused</span>
        </div>
      </main>
    </div>
  );
}
