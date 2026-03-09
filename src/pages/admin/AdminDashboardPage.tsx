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
  MessageCircle,
  ExternalLink,
  Trash2,
  CheckCircle
} from 'lucide-react';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface MentorshipApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'pending' | 'contacted';
  appliedAt: string;
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [now, setNow] = useState(new Date());
  const [pendingApps, setPendingApps] = useState<MentorshipApplication[]>([]);
  const [contactedApps, setContactedApps] = useState<MentorshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'contacted'>('pending');

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch pending applications
  useEffect(() => {
    const q = query(
      collection(db, 'mentorship_applications'),
      where('status', '==', 'pending'),
      orderBy('appliedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: MentorshipApplication[] = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as MentorshipApplication);
      });
      setPendingApps(apps);
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, []);

  // Fetch contacted applications
  useEffect(() => {
    const q = query(
      collection(db, 'mentorship_contacted'),
      orderBy('contactedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const apps: MentorshipApplication[] = [];
      snapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as MentorshipApplication);
      });
      setContactedApps(apps);
    }, () => {});

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const markAsContacted = async (app: MentorshipApplication) => {
    try {
      // Add to contacted collection
      await addDoc(collection(db, 'mentorship_contacted'), {
        ...app,
        status: 'contacted',
        contactedAt: new Date().toISOString(),
      });

      // Delete from pending
      await deleteDoc(doc(db, 'mentorship_applications', app.id));
    } catch (error) {
      console.error('Error moving application:', error);
    }
  };

  const deleteApplication = async (id: string, collectionName: string) => {
    if (confirm('Are you sure you want to delete this application?')) {
      try {
        await deleteDoc(doc(db, collectionName, id));
      } catch (error) {
        console.error('Error deleting application:', error);
      }
    }
  };

  const getWhatsAppMessage = (name: string, plan: string): string => {
    if (plan.includes('2,999') || plan.includes('Assessment')) {
      return `Hi ${name} 👋

Thank you for completing the registration for the 1-Week SSB Assessment Program 🔥

💳 Payment Details

To proceed further, please complete the program fee of ₹2,999.

👉 Pay to: [Your UPI / Number]
👉 Amount: ₹2,999

📸 After payment, kindly share the screenshot along with:
• Transaction ID
• Your Full Name

Once payment is confirmed, we will assign your personal SSB mentor and share the next steps immediately.

If you face any issue or have questions, feel free to reply here.

Team Enlift hub 🇮🇳
Train the Mind. Clear the Board.`;
    } else {
      return `Hi ${name} 👋

Thank you for completing the registration for the 1-Month SSB Mentorship Program 🔥

💳 Payment Details

To proceed further, please complete the program fee of ₹9,999.

👉 Pay to: [Your UPI / Number]
👉 Amount: ₹9,999

📸 After payment, kindly share the screenshot along with:
• Transaction ID
• Your Full Name

Once payment is confirmed, we will assign your personal SSB mentor and share the next steps immediately.

If you face any issue or have questions, feel free to reply here.

Team Enlift hub 🇮🇳
Train the Mind. Clear the Board.`;
    }
  };

  const getWhatsAppLink = (phone: string, name: string, plan: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = encodeURIComponent(getWhatsAppMessage(name, plan));
    return `https://wa.me/${cleanPhone}?text=${message}`;
  };

  const pendingCount = pendingApps.length;
  const contactedCount = contactedApps.length;

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
      id: 'blog',
      name: 'Blog',
      title: 'Blog Management',
      description: 'Create and manage blog posts',
      icon: FileText,
      color: 'bg-green-600',
      actions: [{ label: 'Manage Blogs', path: '/admin/blog' }]
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
              Manage tests, content, and mentorship applications
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              System time: {now.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* MENTORSHIP APPLICATIONS */}
        <Card className="mb-8 border-2 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-green-600" />
                Mentorship Applications
              </CardTitle>
              <CardDescription>
                View and manage student mentorship requests
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('pending')}
              >
                Pending ({pendingCount})
              </Button>
              <Button
                variant={activeTab === 'contacted' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('contacted')}
              >
                Contacted ({contactedCount})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading applications...</p>
            ) : activeTab === 'pending' ? (
              pendingApps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No pending applications.
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingApps.map((app) => (
                    <div 
                      key={app.id} 
                      className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{app.name}</span>
                          <Badge variant="secondary">
                            {app.plan}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          📧 {app.email} • 📱 {app.phone}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={getWhatsAppLink(app.phone, app.name, app.plan)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => markAsContacted(app)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Mark Contacted
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              contactedApps.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No contacted applications.
                </p>
              ) : (
                <div className="space-y-4">
                  {contactedApps.map((app) => (
                    <div 
                      key={app.id} 
                      className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{app.name}</span>
                          <Badge variant="secondary">
                            {app.plan}
                          </Badge>
                          <Badge className="bg-green-500">
                            Contacted
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          📧 {app.email} • 📱 {app.phone}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={getWhatsAppLink(app.phone, app.name, app.plan)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            WhatsApp
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Button>
                        </a>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => deleteApplication(app.id, 'mentorship_contacted')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
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
