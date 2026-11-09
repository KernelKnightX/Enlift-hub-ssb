import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Upload, 
  Send, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle,
  Loader2,
  Eye,
  Trash2,
  Mail
} from 'lucide-react';
import { 
  getAllSubscribers, 
  getActiveSubscribers, 
  getAllMagazineIssues,
  addMagazineIssue,
  markMagazineAsSent,
  type Subscriber,
  type MagazineIssue 
} from '@/lib/subscriptionService';
import { uploadMagazinePDF, isValidPDFFile } from '@/lib/magazineStorage';
import { sendMagazineToAllSubscribers } from '@/lib/magazineEmailService';

export default function AdminMagazinePage() {
  const [activeTab, setActiveTab] = useState<'subscribers' | 'upload' | 'issues'>('subscribers');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [issues, setIssues] = useState<MagazineIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  // Upload form
  const [magazineTitle, setMagazineTitle] = useState('');
  const [magazineDate, setMagazineDate] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Send form
  const [selectedIssue, setSelectedIssue] = useState<string>('');
  const [sendMessage, setSendMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subscribersData, issuesData] = await Promise.all([
        getAllSubscribers(),
        getAllMagazineIssues()
      ]);
      setSubscribers(subscribersData);
      setIssues(issuesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isValidPDFFile(file)) {
        setUploadMessage({ type: 'error', text: 'Please select a valid PDF file (max 50MB)' });
        return;
      }
      setPdfFile(file);
      setUploadMessage(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pdfFile || !magazineTitle || !magazineDate) {
      setUploadMessage({ type: 'error', text: 'Please fill all fields and select a PDF' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      // Upload PDF to Firebase Storage
      console.log('Uploading PDF to Firebase Storage...');
      const pdfUrl = await uploadMagazinePDF(pdfFile, magazineDate);
      console.log('PDF uploaded, URL:', pdfUrl);
      
      // Save issue metadata to Firestore
      console.log('Saving to Firestore...');
      await addMagazineIssue({
        title: magazineTitle,
        date: magazineDate,
        pdfUrl,
        uploadedBy: 'admin',
        sentToSubscribers: false,
      });
      console.log('Saved to Firestore successfully');

      setUploadMessage({ type: 'success', text: 'Magazine uploaded successfully!' });
      
      // Reset form
      setMagazineTitle('');
      setMagazineDate('');
      setPdfFile(null);
      
      // Reload data and switch to issues tab
      await loadData();
      setActiveTab('issues');
      console.log('Data reloaded');
    } catch (error) {
      console.error('Error uploading magazine:', error);
      setUploadMessage({ type: 'error', text: `Failed to upload magazine: ${error instanceof Error ? error.message : 'Unknown error'}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendToSubscribers = async () => {
    if (!selectedIssue) {
      setSendMessage({ type: 'error', text: 'Please select a magazine issue to send' });
      return;
    }

    const issue = issues.find(i => i.id === selectedIssue);
    if (!issue) {
      setSendMessage({ type: 'error', text: 'Magazine issue not found' });
      return;
    }

    setIsSending(true);
    setSendMessage(null);

    try {
      // Get active subscribers count
      const activeSubs = await getActiveSubscribers();
      
      if (activeSubs.length === 0) {
        setSendMessage({ type: 'error', text: 'No active subscribers to send to' });
        setIsSending(false);
        return;
      }

      // Send magazine to all subscribers
      const result = await sendMagazineToAllSubscribers(issue);

      // Mark as sent in database
      await markMagazineAsSent(selectedIssue, result.successful);

      setSendMessage({
        type: 'success',
        text: `Magazine sent to ${result.successful} subscribers! ${result.failed > 0 ? `(${result.failed} failed)` : ''}`
      });

      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error sending magazine:', error);
      setSendMessage({ type: 'error', text: 'Failed to send magazine. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const activeSubscribers = subscribers.filter(s => s.isActive);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Magazine Management</h1>
          <p className="text-slate-600">Manage subscribers and upload daily magazines</p>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {activeSubscribers.length} Active Subscribers
        </Badge>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === 'subscribers' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('subscribers')}
          className={activeTab === 'subscribers' ? 'bg-green-600' : ''}
        >
          <Users className="w-4 h-4 mr-2" />
          Subscribers
        </Button>
        <Button
          variant={activeTab === 'upload' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('upload')}
          className={activeTab === 'upload' ? 'bg-green-600' : ''}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Magazine
        </Button>
        <Button
          variant={activeTab === 'issues' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('issues')}
          className={activeTab === 'issues' ? 'bg-green-600' : ''}
        >
          <Send className="w-4 h-4 mr-2" />
          Send to Subscribers
        </Button>
      </div>

      {/* Subscribers Tab */}
      {activeTab === 'subscribers' && (
        <Card>
          <CardHeader>
            <CardTitle>All Subscribers</CardTitle>
            <CardDescription>List of all magazine subscribers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription Date</TableHead>
                  <TableHead>Plan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-slate-500">
                      No subscribers yet
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber) => (
                    <TableRow key={subscriber.id}>
                      <TableCell className="font-medium">{subscriber.name}</TableCell>
                      <TableCell>{subscriber.email}</TableCell>
                      <TableCell>{subscriber.phone || '-'}</TableCell>
                      <TableCell>
                        {subscriber.isActive ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="w-3 h-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {subscriber.subscriptionDate?.toDate 
                          ? subscriber.subscriptionDate.toDate().toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {subscriber.paymentAmount ? `₹${subscriber.paymentAmount}` : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Magazine Issue</CardTitle>
            <CardDescription>Upload a new daily current affairs magazine PDF</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Magazine Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Daily Current Affairs - March 2024"
                    value={magazineTitle}
                    onChange={(e) => setMagazineTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={magazineDate}
                    onChange={(e) => setMagazineDate(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pdf">PDF File</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                />
                <p className="text-xs text-slate-500">
                  Maximum file size: 50MB. Only PDF files are allowed.
                </p>
              </div>

              {uploadMessage && (
                <div className={`p-3 rounded-lg ${
                  uploadMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {uploadMessage.text}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={isUploading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Magazine
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Send Tab */}
      {activeTab === 'issues' && (
        <Card>
          <CardHeader>
            <CardTitle>Send Magazine to Subscribers</CardTitle>
            <CardDescription>
              Send an uploaded magazine to all active subscribers via email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {issues.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No magazine issues uploaded yet</p>
                <p className="text-sm">Upload a magazine first using the Upload tab</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Select Magazine Issue</Label>
                  <select
                    className="w-full p-2 border rounded-lg"
                    value={selectedIssue}
                    onChange={(e) => setSelectedIssue(e.target.value)}
                  >
                    <option value="">Select an issue...</option>
                    {issues.map((issue) => (
                      <option key={issue.id} value={issue.id}>
                        {issue.title} - {issue.date} 
                        {issue.sentToSubscribers ? ' (Sent)' : ' (Not sent)'}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={handleSendToSubscribers}
                  disabled={!selectedIssue || isSending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send to All Subscribers
                    </>
                  )}
                </Button>

                {selectedIssue && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {issues.find(i => i.id === selectedIssue)?.title}
                        </p>
                        <p className="text-sm text-slate-600">
                          {activeSubscribers.length} active subscribers will receive this magazine
                        </p>
                      </div>
                      <Button
                        onClick={handleSendToSubscribers}
                        disabled={isSending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Send to All
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {sendMessage && (
                  <div className={`p-3 rounded-lg ${
                    sendMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {sendMessage.text}
                  </div>
                )}

                {/* Issues List */}
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">All Magazine Issues</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Subscribers Sent</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issues.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">{issue.title}</TableCell>
                          <TableCell>{issue.date}</TableCell>
                          <TableCell>
                            {issue.sentToSubscribers ? (
                              <Badge className="bg-green-100 text-green-700">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Sent
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="w-3 h-3 mr-1" />
                                Not Sent
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{issue.subscriberCount || 0}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                asChild
                              >
                                <a 
                                  href={issue.pdfUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                              </Button>
                              {!issue.sentToSubscribers && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedIssue(issue.id || '');
                                  }}
                                >
                                  <Send className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
