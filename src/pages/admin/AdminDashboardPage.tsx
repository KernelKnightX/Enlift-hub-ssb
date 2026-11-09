import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Image,
  BookOpen,
  FileText,
  PenTool,
  MessageSquare,
  Upload,
  Settings,
  BarChart3,
  Users,
  LayoutDashboard,
  LogOut,
  Crown,
  Mail,
  Languages,
  Headphones,
  ShieldCheck,
  Radar
} from 'lucide-react';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const adminModules = [
    {
      id: 'ppdt',
      name: 'PPDT',
      title: 'Picture Perception & Description Test',
      description: 'Upload and manage PPDT image sets',
      icon: Image,
      color: 'bg-blue-600',
      actions: [{ label: 'Upload Image Sets', path: '/admin/ppdt' }]
    },    
    {
      id: 'tat',
      name: 'TAT',
      title: 'Thematic Apperception Test',
      description: 'Manage TAT picture-based tests',
      icon: BookOpen,
      color: 'bg-purple-600',
      actions: [{ label: 'Upload Image Sets', path: '/admin/tat' }]
    },
    {
      id: 'viit',
      name: 'VIIT',
      title: 'Verbal Intelligence & Info Test',
      description: 'Manage verbal & GK-based questions',
      icon: FileText,
      color: 'bg-orange-600',
      actions: [{ label: 'Upload Question Sets', path: '/admin/viit' }]
    },
    {
      id: 'wat',
      name: 'WAT',
      title: 'Word Association Test',
      description: 'Manage word stimulus sets',
      icon: PenTool,
      color: 'bg-red-600',
      actions: [{ label: 'Upload Word Sets', path: '/admin/wat' }]
    },
    {
      id: 'srt',
      name: 'SRT',
      title: 'Situation Reaction Test',
      description: 'Manage situation-based responses',
      icon: MessageSquare,
      color: 'bg-indigo-600',
      actions: [{ label: 'Upload Situation Sets', path: '/admin/srt' }]
    },
    {
      id: 'english',
      name: 'English',
      title: 'Grammar & Vocabulary Test',
      description: 'Manage grammar, vocabulary, spelling, and sentence questions',
      icon: Languages,
      color: 'bg-cyan-600',
      actions: [{ label: 'Upload English Questions', path: '/admin/english' }]
    },
    {
      id: 'listening',
      name: 'Listening',
      title: 'Listening Recall Test',
      description: 'Manage audio recall word questions',
      icon: Headphones,
      color: 'bg-emerald-600',
      actions: [{ label: 'Upload Listening Questions', path: '/admin/listening' }]
    },
    {
      id: 'opam',
      name: 'OPAM',
      title: 'Officer Potential Assessment Measure',
      description: 'Upload and manage OPAM question sets',
      icon: ShieldCheck,
      color: 'bg-fuchsia-600',
      actions: [{ label: 'Upload OPAM Questions', path: '/admin/opam' }]
    },
    {
      id: 'speed-recognition',
      name: 'Mock Test',
      title: 'Mock Tests (AFCAT/NDA/CDS)',
      description: 'Manage MCQ mock test questions',
      icon: FileText,
      color: 'bg-teal-600',
      actions: [{ label: 'Upload Mock Tests', path: '/admin/mock' }]
    },
    {
      id: 'blog',
      name: 'Blog',
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      icon: FileText,
      color: 'bg-green-600',
      actions: [{ label: 'Manage Blogs', path: '/admin/blog' }]
    },
    {
      id: 'magazine',
      name: 'Magazine',
      title: 'Current Affairs Magazine',
      description: 'Manage subscribers and send daily magazines',
      icon: Mail,
      color: 'bg-blue-600',
      actions: [{ label: 'Manage Magazine', path: '/admin/magazine' }]
    }
  ];

  return (
    <div className="min-h-screen bg-muted/10">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/LOOGO.png" alt="Enlift hub" className="h-10 w-auto" />
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                Enlift hub Control Panel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-amber-500">
              <Crown className="w-3 h-3 mr-1" />
              Admin
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user?.fullName || 'Administrator'}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* WELCOME */}
        <Card className="mb-8 border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-1 flex items-center gap-2">
              Welcome, Administrator
              <Badge className="bg-amber-500">
                <Crown className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage practice tests and content uploads
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              System time: {now.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* TEST MANAGEMENT */}
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Test Content Management
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {adminModules.map((module) => {
            const Icon = module.icon;
            return (
              <Card key={module.id} className="hover:shadow-md transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant="outline">{module.name}</Badge>
                  </div>
                  <CardTitle className="mt-2">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-col gap-2">
                    {module.actions.map((action) => (
                      <Link key={action.path} to={action.path}>
                        <Button size="sm" className="w-full justify-start">
                          <Upload className="w-4 h-4 mr-2" />
                          {action.label}
                        </Button>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="my-10" />

        {/* FUTURE SYSTEM */}
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          System & Analytics
        </h3>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Users className="w-6 h-6 mb-2 text-muted-foreground" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>Roles, access & history</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-6 h-6 mb-2 text-muted-foreground" />
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Attempts & trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Settings className="w-6 h-6 mb-2 text-muted-foreground" />
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Platform configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled className="w-full">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
