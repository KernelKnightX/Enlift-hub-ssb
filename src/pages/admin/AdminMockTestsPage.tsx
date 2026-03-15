import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Plus, Trash2, Upload, Download,
  Clock, FileText, CheckCircle, XCircle,
  AlertCircle, FileSpreadsheet, Database,
  Pencil, Search, X,
} from 'lucide-react';
import type { MockTest, MockTestQuestion, ExamType, Difficulty } from '@/types/schema';
import { getMockTests, createMockTest, updateMockTest, deleteMockTest } from '@/lib/mockTestService';

/* ─── CONSTANTS ─── */
const EXAM_TYPES: ExamType[] = ['prelims', 'mains', 'mains-descriptive', 'current-affairs'];
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const EXAM_NAMES = ['CDS', 'AFCAT', 'NDA', 'CAPF', 'SSBInterview'];

// Subject options for dropdown
const SUBJECT_OPTIONS = [
  'History',
  'Geography',
  'Indian Polity',
  'Economics',
  'Physics',
  'Chemistry',
  'Biology',
  'Environment & Ecology',
  'Current Affairs',
  'Defence & Military Awareness',
  'English',
  'Maths',
  'Complete mock test',
];

const BLANK_FORM = {
  title: '',
  description: '',
  examName: '',
  examType: 'prelims' as ExamType,
  subject: '',
  difficulty: 'medium' as Difficulty,
  duration: 60,
  totalQuestions: 100,
  totalMarks: 100,
  positiveMarking: 1,
  negativeMarking: 0.33,
  passingScore: 40,
  isPublished: true,
};

/* ─── CSV TEMPLATE ─── */
// NOTE: correctAnswer is 0-indexed (0 = first option, 1 = second, etc.)
const CSV_TEMPLATE = `question,option1,option2,option3,option4,correctAnswer,explanation,subject,difficulty,source
What is the capital of India?,Mumbai,New Delhi,Kolkata,Chennai,1,New Delhi is the capital of India since 1911.,Geography,easy,NCERT
Who wrote the Indian national anthem?,Rabindranath Tagore,Bankim Chandra,Mahatma Gandhi,Jawaharlal Nehru,0,Rabindranath Tagore composed Jana Gana Mana in 1911.,History,easy,PYQ
What is the largest state of India by area?,Rajasthan,Madhya Pradesh,Uttar Pradesh,Maharashtra,0,Rajasthan covers 342239 sq km making it the largest state.,Geography,easy,NCERT`;

/* ─── HELPERS ─── */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function safeInt(val: string | number, fallback = 0): number {
  const n = typeof val === 'number' ? val : parseInt(val);
  return isNaN(n) ? fallback : n;
}

/* ─── CSS ─── */
const css = `
  *, *::before, *::after { box-sizing: border-box; }

  .adm { min-height: 100vh; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; }

  /* TOP BAR */
  .adm-topbar { background: #fff; border-bottom: 1px solid #e5e5e5; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 60px; position: sticky; top: 0; z-index: 20; }
  .adm-topbar-left { display: flex; align-items: center; gap: 16px; }
  .adm-back { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 500; color: #666; background: none; border: none; cursor: pointer; padding: 6px 10px; border-radius: 4px; transition: background 0.1s; }
  .adm-back:hover { background: #f5f5f5; color: #111; }
  .adm-topbar-title { font-size: 15px; font-weight: 700; }
  .adm-topbar-sub { font-size: 12px; color: #999; }
  .adm-topbar-right { display: flex; align-items: center; gap: 8px; }

  /* BUTTONS */
  .btn { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; border-radius: 5px; padding: 8px 16px; cursor: pointer; border: none; transition: all 0.12s; white-space: nowrap; }
  .btn-primary { background: #111; color: #fff; }
  .btn-primary:hover { background: #333; }
  .btn-primary:disabled { background: #999; cursor: not-allowed; }
  .btn-outline { background: #fff; color: #111; border: 1px solid #ddd; }
  .btn-outline:hover { border-color: #999; }
  .btn-ghost { background: transparent; color: #555; padding: 6px 10px; }
  .btn-ghost:hover { background: #f0f0f0; color: #111; }
  .btn-danger { background: #fee2e2; color: #dc2626; }
  .btn-danger:hover { background: #fecaca; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

  /* PAGE BODY */
  .adm-body { max-width: 1200px; margin: 0 auto; padding: 28px 32px 80px; }

  /* TOAST */
  .adm-toast { display: flex; align-items: center; gap: 10px; padding: 12px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; margin-bottom: 20px; }
  .adm-toast-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
  .adm-toast-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .adm-toast-close { margin-left: auto; background: none; border: none; cursor: pointer; color: inherit; opacity: 0.6; padding: 2px; }
  .adm-toast-close:hover { opacity: 1; }

  /* STATS ROW */
  .adm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .adm-stat { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; padding: 18px 20px; display: flex; align-items: center; gap: 14px; }
  .adm-stat-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .adm-stat-val { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1; margin-bottom: 3px; }
  .adm-stat-label { font-size: 11px; color: #888; font-weight: 500; }

  /* TABLE CARD */
  .adm-card { background: #fff; border: 1px solid #e5e5e5; border-radius: 8px; overflow: hidden; }
  .adm-card-header { padding: 16px 20px; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: space-between; }
  .adm-card-title { font-size: 14px; font-weight: 700; }

  /* FILTER BAR */
  .adm-filters { display: flex; gap: 10px; padding: 14px 20px; border-bottom: 1px solid #f0f0f0; flex-wrap: wrap; }
  .adm-search-wrap { position: relative; flex: 1; min-width: 200px; }
  .adm-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #aaa; width: 14px; height: 14px; }
  .adm-search { width: 100%; padding: 7px 10px 7px 32px; border: 1px solid #e0e0e0; border-radius: 5px; font-size: 13px; outline: none; background: #fafafa; }
  .adm-search:focus { border-color: #999; background: #fff; }
  .adm-select-sm { padding: 7px 10px; border: 1px solid #e0e0e0; border-radius: 5px; font-size: 13px; background: #fafafa; outline: none; cursor: pointer; }
  .adm-select-sm:focus { border-color: #999; }
  .adm-result-count { padding: 8px 20px; font-size: 12px; color: #999; border-bottom: 1px solid #f5f5f5; }

  /* TABLE */
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th { font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: #888; padding: 10px 16px; text-align: left; border-bottom: 1px solid #f0f0f0; background: #fafafa; white-space: nowrap; }
  .adm-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #f7f7f7; vertical-align: middle; }
  .adm-table tbody tr:last-child td { border-bottom: none; }
  .adm-table tbody tr:hover td { background: #fafafa; }
  .adm-td-title { font-weight: 600; color: #111; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .adm-td-sub { font-size: 11px; color: #999; margin-top: 1px; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; letter-spacing: .03em; white-space: nowrap; }
  .badge-outline { border: 1px solid #e0e0e0; color: #555; background: #fff; }
  .badge-green { background: #f0fdf4; color: #15803d; }
  .badge-gray { background: #f5f5f5; color: #666; }
  .badge-blue { background: #eff6ff; color: #1d4ed8; }
  .badge-purple { background: #faf5ff; color: #7c3aed; }
  .badge-orange { background: #fff7ed; color: #c2410c; }
  .badge-cyan { background: #ecfeff; color: #0e7490; }
  .badge-yellow { background: #fefce8; color: #a16207; }
  .badge-red { background: #fef2f2; color: #dc2626; }

  /* DELETE CONFIRM INLINE */
  .adm-del-confirm { display: flex; align-items: center; gap: 6px; }
  .adm-del-confirm span { font-size: 12px; color: #dc2626; font-weight: 500; }

  /* EMPTY STATES */
  .adm-empty { text-align: center; padding: 56px 24px; color: #aaa; }
  .adm-empty-icon { font-size: 40px; margin-bottom: 12px; }
  .adm-empty-title { font-size: 14px; font-weight: 600; color: #555; margin-bottom: 6px; }
  .adm-empty-sub { font-size: 13px; }

  /* MODAL OVERLAY */
  .adm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); z-index: 40; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .adm-modal { background: #fff; border-radius: 10px; width: 100%; max-height: 90vh; overflow-y: auto; display: flex; flex-direction: column; }
  .adm-modal-sm { max-width: 640px; }
  .adm-modal-lg { max-width: 860px; }
  .adm-modal-header { padding: 20px 24px; border-bottom: 1px solid #eee; display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-shrink: 0; }
  .adm-modal-title { font-size: 16px; font-weight: 800; margin-bottom: 3px; }
  .adm-modal-sub { font-size: 12px; color: #999; }
  .adm-modal-close { background: none; border: none; cursor: pointer; color: #aaa; padding: 2px; border-radius: 3px; }
  .adm-modal-close:hover { color: #111; background: #f0f0f0; }
  .adm-modal-body { padding: 24px; flex: 1; overflow-y: auto; }
  .adm-modal-footer { padding: 16px 24px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; flex-shrink: 0; }

  /* FORM */
  .adm-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .adm-form-full { grid-column: 1 / -1; }
  .adm-field { display: flex; flex-direction: column; gap: 5px; }
  .adm-label { font-size: 12px; font-weight: 600; color: #444; }
  .adm-input { padding: 8px 11px; border: 1px solid #e0e0e0; border-radius: 5px; font-size: 13px; outline: none; background: #fff; width: 100%; transition: border-color 0.1s; }
  .adm-input:focus { border-color: #999; }
  .adm-textarea { padding: 8px 11px; border: 1px solid #e0e0e0; border-radius: 5px; font-size: 13px; outline: none; background: #fff; width: 100%; resize: vertical; min-height: 72px; }
  .adm-textarea:focus { border-color: #999; }
  .adm-native-select { padding: 8px 11px; border: 1px solid #e0e0e0; border-radius: 5px; font-size: 13px; background: #fff; width: 100%; outline: none; cursor: pointer; }
  .adm-native-select:focus { border-color: #999; }
  .adm-toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #fafafa; border: 1px solid #e5e5e5; border-radius: 5px; }
  .adm-toggle-label { font-size: 13px; font-weight: 500; }
  .adm-toggle { position: relative; display: inline-block; width: 36px; height: 20px; }
  .adm-toggle input { opacity: 0; width: 0; height: 0; }
  .adm-toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #ddd; border-radius: 20px; transition: 0.2s; }
  .adm-toggle-slider::before { content: ''; position: absolute; height: 14px; width: 14px; left: 3px; bottom: 3px; background: white; border-radius: 50%; transition: 0.2s; }
  .adm-toggle input:checked + .adm-toggle-slider { background: #111; }
  .adm-toggle input:checked + .adm-toggle-slider::before { transform: translateX(16px); }

  /* DIVIDER */
  .adm-divider { border: none; border-top: 1px solid #f0f0f0; margin: 20px 0; }

  /* QUESTIONS SECTION */
  .adm-q-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .adm-q-title { font-size: 13px; font-weight: 700; }
  .adm-q-item { border: 1px solid #e8e8e8; border-radius: 6px; padding: 16px; margin-bottom: 12px; background: #fafafa; }
  .adm-q-item-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .adm-q-num { font-size: 11px; font-weight: 700; color: #888; background: #eee; padding: 2px 8px; border-radius: 3px; }
  .adm-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 10px 0; }
  .adm-option-row { display: flex; align-items: center; gap: 8px; }
  .adm-option-letter { width: 22px; height: 22px; border-radius: 50%; background: #e8e8e8; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; }

  /* DROP ZONE */
  .adm-dropzone { border: 2px dashed #ddd; border-radius: 8px; padding: 36px; text-align: center; cursor: pointer; transition: all 0.15s; }
  .adm-dropzone:hover { border-color: #999; background: #fafafa; }
  .adm-dropzone-active { border-color: #111; background: #f5f5f5; }
  .adm-dropzone-done { border-color: #15803d; background: #f0fdf4; border-style: solid; }
  .adm-dropzone-icon { margin-bottom: 10px; color: #aaa; }
  .adm-dropzone-title { font-size: 14px; font-weight: 600; color: #555; margin-bottom: 4px; }
  .adm-dropzone-sub { font-size: 12px; color: #aaa; margin-bottom: 14px; }

  /* CSV PREVIEW */
  .adm-preview { border: 1px solid #e8e8e8; border-radius: 6px; max-height: 220px; overflow-y: auto; margin-top: 12px; }
  .adm-preview-item { padding: 10px 14px; border-bottom: 1px solid #f5f5f5; }
  .adm-preview-item:last-child { border-bottom: none; }
  .adm-preview-q { font-size: 13px; font-weight: 500; margin-bottom: 5px; }
  .adm-preview-opts { display: flex; flex-wrap: wrap; gap: 5px; }
  .adm-preview-more { padding: 10px 14px; text-align: center; font-size: 12px; color: #999; }

  /* CSV FORMAT NOTE */
  .adm-format-note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 6px; padding: 12px 14px; font-size: 12px; color: #92400e; line-height: 1.6; margin-bottom: 16px; }

  /* LOADING */
  .adm-loading { text-align: center; padding: 40px; color: #aaa; font-size: 14px; }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .adm-stats { grid-template-columns: 1fr 1fr; }
    .adm-body { padding: 20px 20px 60px; }
    .adm-topbar { padding: 0 20px; }
  }
  @media (max-width: 600px) {
    .adm-stats { grid-template-columns: 1fr 1fr; gap: 10px; }
    .adm-form-grid { grid-template-columns: 1fr; }
    .adm-form-full { grid-column: 1; }
    .adm-filters { flex-direction: column; }
    .adm-topbar-right { gap: 6px; }
    .adm-options-grid { grid-template-columns: 1fr; }
    .adm-modal-header { padding: 16px; }
    .adm-modal-body { padding: 16px; }
    .adm-modal-footer { padding: 12px 16px; }
  }
`;

/* ─── COMPONENT ─── */
export default function AdminMockTestsPage() {
  const navigate = useNavigate();
  const [tests, setTests] = useState<MockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Modals
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTest, setEditingTest] = useState<MockTest | null>(null);

  // Delete confirm — stores the ID currently pending confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // CSV state
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<MockTestQuestion[]>([]);
  const [csvUploading, setCsvUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({ ...BLANK_FORM });
  const [questions, setQuestions] = useState<MockTestQuestion[]>([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Auto-dismiss message after 4s
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  const showMsg = (type: 'success' | 'error', text: string) => setMessage({ type, text });

  const loadTests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMockTests();
      setTests(data);
    } catch {
      showMsg('error', 'Failed to load tests.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTests(); }, [loadTests]);

  /* ─── FILTERS ─── */
  const filteredTests = tests.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || t.title?.toLowerCase().includes(q) || t.subject?.toLowerCase().includes(q) || t.examName?.toLowerCase().includes(q);
    const matchExam = examFilter === 'all' || t.examName === examFilter;
    const matchStatus = statusFilter === 'all' || (statusFilter === 'published' ? t.isPublished : !t.isPublished);
    return matchSearch && matchExam && matchStatus;
  });

  /* ─── FORM HELPERS ─── */
  const resetForm = () => { setFormData({ ...BLANK_FORM }); setQuestions([]); };

  const openCreate = () => {
    setEditingTest(null);
    resetForm();
    setShowCreateModal(true);
  };

  const openEdit = (test: MockTest) => {
    setEditingTest(test);
    setFormData({
      title: test.title || '',
      description: test.description || '',
      examName: test.examName || '',
      examType: test.examType || 'prelims',
      subject: test.subject || '',
      difficulty: test.difficulty || 'medium',
      duration: test.duration || 60,
      totalQuestions: test.totalQuestions || 100,
      totalMarks: test.totalMarks || 100,
      positiveMarking: test.positiveMarking || 1,
      negativeMarking: test.negativeMarking || 0.33,
      passingScore: test.passingScore || 40,
      isPublished: test.isPublished ?? true,
    });
    setQuestions(test.questions || []);
    setShowCreateModal(true);
  };

  const setNum = (key: keyof typeof BLANK_FORM, val: string) =>
    setFormData(f => ({ ...f, [key]: safeInt(val) }));

  /* ─── CSV ─── */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) { showMsg('error', 'Please upload a .csv file.'); return; }
    setCsvFile(file);
    const reader = new FileReader();
    reader.onload = e => {
      const lines = (e.target?.result as string).split('\n').filter(l => l.trim());
      if (lines.length < 2) { showMsg('error', 'CSV is empty or has no data rows.'); return; }
      const parsed: MockTestQuestion[] = [];
      for (let i = 1; i < lines.length; i++) {
        const vals = parseCSVLine(lines[i].trim());
        if (vals.length >= 5 && vals[0]?.trim()) {
          // FIX #9: correctAnswer is 0-indexed in CSV — use directly
          const correctIdx = safeInt(vals[5], 0);
          parsed.push({
            id: i,
            question: vals[0].trim(),
            options: [vals[1]?.trim() || '', vals[2]?.trim() || '', vals[3]?.trim() || '', vals[4]?.trim() || ''],
            correctAnswer: correctIdx,
            explanation: vals[6]?.trim() || '',
            subject: vals[7]?.trim() || formData.subject,
            difficulty: (vals[8]?.trim() as Difficulty) || 'medium',
            source: vals[9]?.trim() || '',
          });
        }
      }
      if (!parsed.length) { showMsg('error', 'No valid questions found. Check the CSV format.'); return; }
      setCsvPreview(parsed);
      showMsg('success', `Parsed ${parsed.length} questions successfully.`);
    };
    reader.onerror = () => showMsg('error', 'Error reading file.');
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mock_test_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleCsvUpload = async () => {
    if (!csvPreview.length) { showMsg('error', 'No questions parsed yet.'); return; }
    if (!formData.title.trim()) { showMsg('error', 'Test title is required.'); return; }
    if (!formData.examName) { showMsg('error', 'Exam name is required.'); return; }
    setCsvUploading(true);
    try {
      await createMockTest({
        ...formData,
        totalQuestions: csvPreview.length,
        questions: csvPreview,
        createdBy: 'admin',
      });
      showMsg('success', `Test created with ${csvPreview.length} questions!`);
      setShowUploadModal(false);
      setCsvFile(null); setCsvPreview([]);
      resetForm();
      loadTests();
    } catch {
      showMsg('error', 'Failed to create test from CSV.');
    } finally {
      setCsvUploading(false);
    }
  };

  /* ─── SAVE / UPDATE ─── */
  const handleSave = async () => {
    if (!formData.title.trim()) { showMsg('error', 'Title is required.'); return; }
    if (!formData.examName) { showMsg('error', 'Exam name is required.'); return; }
    setSaving(true);
    try {
      const payload = { ...formData, questions };
      if (editingTest?.id) {
        await updateMockTest(editingTest.id, payload);
        showMsg('success', 'Test updated successfully.');
      } else {
        await createMockTest({ ...payload, createdBy: 'admin' });
        showMsg('success', 'Test created successfully.');
      }
      setShowCreateModal(false);
      setEditingTest(null);
      resetForm();
      loadTests();
    } catch {
      showMsg('error', 'Failed to save test.');
    } finally {
      setSaving(false);
    }
  };

  /* ─── DELETE ─── */
  const handleDelete = async (id: string) => {
    try {
      await deleteMockTest(id);
      showMsg('success', 'Test deleted.');
      setDeleteConfirmId(null);
      loadTests();
    } catch {
      showMsg('error', 'Failed to delete test.');
    }
  };

  /* ─── BADGE HELPERS ─── */
  const diffBadge = (d: Difficulty) =>
    d === 'easy' ? 'badge-green' : d === 'hard' ? 'badge-red' : 'badge-yellow';

  const typeBadge = (t: ExamType) =>
    t === 'prelims' ? 'badge-blue' : t === 'mains' ? 'badge-purple' : t === 'mains-descriptive' ? 'badge-orange' : 'badge-cyan';

  /* ─── STATS ─── */
  const totalQ = tests.reduce((a, t) => a + (t.questions?.length || 0), 0);
  const published = tests.filter(t => t.isPublished).length;
  const drafts = tests.length - published;

  return (
    <div className="adm">
      <style>{css}</style>

      {/* TOP BAR */}
      <div className="adm-topbar">
        <div className="adm-topbar-left">
          <button className="adm-back btn btn-ghost" onClick={() => navigate('/admin')}>
            <ArrowLeft size={15} /> Back
          </button>
          <div>
            <div className="adm-topbar-title">Mock Tests</div>
            <div className="adm-topbar-sub">Create and manage practice tests</div>
          </div>
        </div>
        <div className="adm-topbar-right">
          <button className="btn btn-outline btn-sm" onClick={downloadTemplate}>
            <Download size={13} /> Template
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => setShowUploadModal(true)}>
            <FileSpreadsheet size={13} /> Upload CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={openCreate}>
            <Plus size={13} /> Create Test
          </button>
        </div>
      </div>

      <div className="adm-body">

        {/* TOAST */}
        {message && (
          <div className={`adm-toast ${message.type === 'success' ? 'adm-toast-success' : 'adm-toast-error'}`}>
            {message.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            {message.text}
            <button className="adm-toast-close" onClick={() => setMessage(null)}><X size={14} /></button>
          </div>
        )}

        {/* STATS */}
        <div className="adm-stats">
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#eff6ff' }}>
              <FileText size={18} color="#1d4ed8" />
            </div>
            <div>
              <div className="adm-stat-val">{tests.length}</div>
              <div className="adm-stat-label">Total Tests</div>
            </div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#f0fdf4' }}>
              <CheckCircle size={18} color="#15803d" />
            </div>
            <div>
              <div className="adm-stat-val">{published}</div>
              <div className="adm-stat-label">Published</div>
            </div>
          </div>
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#faf5ff' }}>
              <Database size={18} color="#7c3aed" />
            </div>
            <div>
              <div className="adm-stat-val">{totalQ}</div>
              <div className="adm-stat-label">Total Questions</div>
            </div>
          </div>
          {/* FIX #6: replaced meaningless "total minutes" with "drafts" */}
          <div className="adm-stat">
            <div className="adm-stat-icon" style={{ background: '#fef9c3' }}>
              <Clock size={18} color="#a16207" />
            </div>
            <div>
              <div className="adm-stat-val">{drafts}</div>
              <div className="adm-stat-label">Drafts</div>
            </div>
          </div>
        </div>

        {/* TABLE CARD */}
        <div className="adm-card">
          <div className="adm-card-header">
            <div className="adm-card-title">All Mock Tests</div>
          </div>

          {/* FILTERS */}
          <div className="adm-filters">
            <div className="adm-search-wrap">
              <Search className="adm-search-icon" />
              <input
                className="adm-search"
                placeholder="Search by title, subject or exam…"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <select className="adm-select-sm" value={examFilter} onChange={e => setExamFilter(e.target.value)}>
              <option value="all">All Exams</option>
              {EXAM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <select className="adm-select-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="adm-result-count">
            {filteredTests.length} of {tests.length} tests
          </div>

          {loading ? (
            <div className="adm-loading">Loading tests…</div>
          ) : tests.length === 0 ? (
            <div className="adm-empty">
              <div className="adm-empty-icon">📋</div>
              <div className="adm-empty-title">No tests yet</div>
              <div className="adm-empty-sub">Create your first mock test using the button above.</div>
            </div>
          ) : filteredTests.length === 0 ? (
            /* FIX #7: empty state for filtered results */
            <div className="adm-empty">
              <div className="adm-empty-icon">🔍</div>
              <div className="adm-empty-title">No results found</div>
              <div className="adm-empty-sub">Try adjusting your search or filters.</div>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Exam</th>
                    <th>Type</th>
                    <th>Difficulty</th>
                    <th>Questions</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map(test => (
                    <tr key={test.id}>
                      <td>
                        <div className="adm-td-title">{test.title}</div>
                        {test.subject && <div className="adm-td-sub">{test.subject}</div>}
                      </td>
                      <td><span className="badge badge-outline">{test.examName}</span></td>
                      <td><span className={`badge ${typeBadge(test.examType)}`}>{test.examType}</span></td>
                      <td><span className={`badge ${diffBadge(test.difficulty)}`}>{test.difficulty}</span></td>
                      <td style={{ fontWeight: 600 }}>{test.questions?.length ?? 0}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                          <Clock size={13} color="#aaa" />{test.duration} min
                        </span>
                      </td>
                      <td>
                        {test.isPublished
                          ? <span className="badge badge-green"><CheckCircle size={10} /> Published</span>
                          : <span className="badge badge-gray"><XCircle size={10} /> Draft</span>}
                      </td>
                      <td>
                        {/* FIX #2: inline delete confirmation instead of confirm() */}
                        {deleteConfirmId === test.id ? (
                          <div className="adm-del-confirm">
                            <span>Delete?</span>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(test.id)}>Yes</button>
                            <button className="btn btn-outline btn-sm" onClick={() => setDeleteConfirmId(null)}>No</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(test)} title="Edit">
                              <Pencil size={13} color="#1d4ed8" />
                            </button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setDeleteConfirmId(test.id)} title="Delete">
                              <Trash2 size={13} color="#dc2626" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ─── CSV UPLOAD MODAL ─── */}
      {showUploadModal && (
        /* FIX #8: clicking backdrop closes modal */
        <div className="adm-overlay" onClick={() => { setShowUploadModal(false); setCsvFile(null); setCsvPreview([]); }}>
          <div className="adm-modal adm-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <div className="adm-modal-title">Upload CSV</div>
                <div className="adm-modal-sub">Create a test from a spreadsheet</div>
              </div>
              <button className="adm-modal-close" onClick={() => { setShowUploadModal(false); setCsvFile(null); setCsvPreview([]); }}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body">
              {/* FIX #9: clarify 0-indexed correctAnswer */}
              <div className="adm-format-note">
                <strong>CSV format:</strong> question, option1, option2, option3, option4, correctAnswer, explanation, subject, difficulty, source
                <br />
                <strong>correctAnswer</strong> is 0-indexed: 0 = option1, 1 = option2, 2 = option3, 3 = option4.
                <br />
                Download the template below for a ready-to-use example.
              </div>

              <div className="adm-form-grid" style={{ marginBottom: 16 }}>
                <div className="adm-field adm-form-full">
                  <label className="adm-label">Test Title *</label>
                  <input className="adm-input" placeholder="e.g. CDS GK Mock Test 1" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Exam *</label>
                  <select className="adm-native-select" value={formData.examName} onChange={e => setFormData(f => ({ ...f, examName: e.target.value }))}>
                    <option value="">Select exam…</option>
                    {EXAM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Subject</label>
                  <select className="adm-native-select" value={formData.subject} onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select subject…</option>
                    {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Duration (min)</label>
                  <input type="number" className="adm-input" value={formData.duration} onChange={e => setNum('duration', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Total Marks</label>
                  {/* FIX #5: safeInt used — no NaN */}
                  <input type="number" className="adm-input" value={formData.totalMarks} onChange={e => setNum('totalMarks', e.target.value)} />
                </div>
              </div>

              {/* DROP ZONE */}
              <div
                className={`adm-dropzone ${dragActive ? 'adm-dropzone-active' : ''} ${csvFile ? 'adm-dropzone-done' : ''}`}
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                onClick={() => !csvFile && fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
                {csvFile ? (
                  <>
                    <div className="adm-dropzone-icon"><FileSpreadsheet size={32} color="#15803d" /></div>
                    <div className="adm-dropzone-title" style={{ color: '#15803d' }}>{csvFile.name}</div>
                    <div className="adm-dropzone-sub">{(csvFile.size / 1024).toFixed(1)} KB — {csvPreview.length} questions</div>
                    <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); setCsvFile(null); setCsvPreview([]); }}>
                      <X size={12} /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="adm-dropzone-icon"><Upload size={28} /></div>
                    <div className="adm-dropzone-title">Drag & drop CSV here</div>
                    <div className="adm-dropzone-sub">or click to browse</div>
                    <button className="btn btn-outline btn-sm" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse</button>
                  </>
                )}
              </div>

              {/* PREVIEW */}
              {csvPreview.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginTop: 14, marginBottom: 6 }}>
                    Preview — first 5 of {csvPreview.length} questions
                  </div>
                  <div className="adm-preview">
                    {csvPreview.slice(0, 5).map((q, i) => (
                      <div key={i} className="adm-preview-item">
                        <div className="adm-preview-q">{i + 1}. {q.question}</div>
                        <div className="adm-preview-opts">
                          {q.options.map((opt, j) => (
                            <span key={j} className={`badge ${j === q.correctAnswer ? 'badge-green' : 'badge-outline'}`}>
                              {String.fromCharCode(65 + j)}: {opt}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {csvPreview.length > 5 && (
                      <div className="adm-preview-more">+{csvPreview.length - 5} more questions</div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="adm-modal-footer">
              <button className="btn btn-outline" onClick={() => { setShowUploadModal(false); setCsvFile(null); setCsvPreview([]); }}>Cancel</button>
              <button className="btn btn-outline btn-sm" onClick={downloadTemplate} style={{ marginRight: 'auto' }}>
                <Download size={12} /> Download Template
              </button>
              <button
                className="btn btn-primary"
                disabled={csvUploading || !csvPreview.length || !formData.title || !formData.examName}
                onClick={handleCsvUpload}
              >
                {csvUploading ? 'Creating…' : `Create Test (${csvPreview.length} Qs)`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── CREATE / EDIT MODAL ─── */}
      {showCreateModal && (
        <div className="adm-overlay" onClick={() => { setShowCreateModal(false); setEditingTest(null); resetForm(); }}>
          <div className="adm-modal adm-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <div className="adm-modal-title">{editingTest ? 'Edit Test' : 'Create New Test'}</div>
                <div className="adm-modal-sub">{editingTest ? 'Update test details and questions' : 'Fill in details and add questions manually'}</div>
              </div>
              <button className="adm-modal-close" onClick={() => { setShowCreateModal(false); setEditingTest(null); resetForm(); }}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body">
              <div className="adm-form-grid">
                <div className="adm-field adm-form-full">
                  <label className="adm-label">Test Title *</label>
                  <input className="adm-input" placeholder="e.g. CDS GK Mock Test 1" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="adm-field adm-form-full">
                  <label className="adm-label">Description</label>
                  <textarea className="adm-textarea" placeholder="Brief description…" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Exam *</label>
                  <select className="adm-native-select" value={formData.examName} onChange={e => setFormData(f => ({ ...f, examName: e.target.value }))}>
                    <option value="">Select exam…</option>
                    {EXAM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Exam Type</label>
                  <select className="adm-native-select" value={formData.examType} onChange={e => setFormData(f => ({ ...f, examType: e.target.value as ExamType }))}>
                    {EXAM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Subject</label>
                  <select className="adm-native-select" value={formData.subject} onChange={e => setFormData(f => ({ ...f, subject: e.target.value }))}>
                    <option value="">Select subject…</option>
                    {SUBJECT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Difficulty</label>
                  <select className="adm-native-select" value={formData.difficulty} onChange={e => setFormData(f => ({ ...f, difficulty: e.target.value as Difficulty }))}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Duration (min)</label>
                  <input type="number" className="adm-input" value={formData.duration} onChange={e => setNum('duration', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Total Marks</label>
                  <input type="number" className="adm-input" value={formData.totalMarks} onChange={e => setNum('totalMarks', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Positive Marking</label>
                  <input type="number" step="0.01" className="adm-input" value={formData.positiveMarking} onChange={e => setFormData(f => ({ ...f, positiveMarking: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Negative Marking</label>
                  <input type="number" step="0.01" className="adm-input" value={formData.negativeMarking} onChange={e => setFormData(f => ({ ...f, negativeMarking: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Passing Score (%)</label>
                  <input type="number" className="adm-input" value={formData.passingScore} onChange={e => setNum('passingScore', e.target.value)} />
                </div>
                <div className="adm-field" style={{ justifyContent: 'flex-end', paddingTop: 8 }}>
                  <div className="adm-toggle-row">
                    <span className="adm-toggle-label">Published</span>
                    <label className="adm-toggle">
                      <input type="checkbox" checked={formData.isPublished} onChange={e => setFormData(f => ({ ...f, isPublished: e.target.checked }))} />
                      <span className="adm-toggle-slider" />
                    </label>
                  </div>
                </div>
              </div>

              <hr className="adm-divider" />

              {/* QUESTIONS */}
              <div className="adm-q-header">
                <div className="adm-q-title">Questions ({questions.length})</div>
                <button className="btn btn-outline btn-sm" onClick={() => setQuestions(qs => [...qs, {
                  id: qs.length + 1, question: '', options: ['', '', '', ''],
                  correctAnswer: 0, explanation: '', subject: formData.subject, difficulty: formData.difficulty, source: '',
                }])}>
                  <Plus size={12} /> Add Question
                </button>
              </div>

              {questions.length === 0 ? (
                <div className="adm-empty" style={{ padding: '28px 16px', border: '1px dashed #e0e0e0', borderRadius: 6 }}>
                  <div className="adm-empty-title">No questions yet</div>
                  <div className="adm-empty-sub">Add manually above, or use CSV Upload for bulk import.</div>
                </div>
              ) : (
                <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 4 }}>
                  {questions.map((q, idx) => (
                    <div key={idx} className="adm-q-item">
                      <div className="adm-q-item-header">
                        <span className="adm-q-num">Q{idx + 1}</span>
                        <button className="btn btn-ghost btn-sm" onClick={() => setQuestions(qs => qs.filter((_, i) => i !== idx))}>
                          <Trash2 size={13} color="#dc2626" />
                        </button>
                      </div>
                      <textarea
                        className="adm-textarea"
                        placeholder="Enter question…"
                        value={q.question}
                        onChange={e => setQuestions(qs => { const u = [...qs]; u[idx] = { ...u[idx], question: e.target.value }; return u; })}
                        style={{ marginBottom: 10 }}
                      />
                      <div className="adm-options-grid">
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="adm-option-row">
                            <div className="adm-option-letter" style={oi === q.correctAnswer ? { background: '#111', color: '#fff' } : {}}>
                              {String.fromCharCode(65 + oi)}
                            </div>
                            <input
                              className="adm-input"
                              placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                              value={opt}
                              onChange={e => setQuestions(qs => {
                                const u = [...qs];
                                u[idx] = { ...u[idx], options: u[idx].options.map((o, i) => i === oi ? e.target.value : o) };
                                return u;
                              })}
                            />
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
                        <label className="adm-label" style={{ whiteSpace: 'nowrap' }}>Correct answer</label>
                        <select
                          className="adm-native-select"
                          style={{ width: 120 }}
                          value={q.correctAnswer}
                          onChange={e => setQuestions(qs => { const u = [...qs]; u[idx] = { ...u[idx], correctAnswer: parseInt(e.target.value) }; return u; })}
                        >
                          {q.options.map((_, i) => (
                            <option key={i} value={i}>{String.fromCharCode(65 + i)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="adm-modal-footer">
              <button className="btn btn-outline" onClick={() => { setShowCreateModal(false); setEditingTest(null); resetForm(); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : editingTest ? 'Update Test' : 'Create Test'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}