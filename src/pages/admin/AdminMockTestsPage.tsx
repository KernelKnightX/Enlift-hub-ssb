import { useState, useRef, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import {
  Plus, Trash2, Upload, Download,
  Clock, FileText, CheckCircle, XCircle,
  AlertCircle, FileSpreadsheet, Database,
  Pencil, Search, X, Archive,
} from 'lucide-react';
import type { MockTest, MockTestQuestion, ExamType, Difficulty } from '@/types/schema';
import { getMockTests, createMockTest, updateMockTest, deleteMockTest } from '@/lib/mockTestService';
import { getMockTestMarkingScheme, hasFixedMockTestMarkingScheme } from '@/lib/mockTestMarking';
import { uploadImage } from '@/lib/firebaseStorage';
import { AdminShell } from '@/components/admin/AdminShell';
import {
  type CsvPreviewQuestion,
  extractMockImportBundle,
  formatMockTestTitle,
  imageFileKey,
  materializeCsvQuestions,
  mergeImageFiles,
  paperTitleFromCsvPath,
  parseMockTestCsv,
  primarySubjectFromParsed,
  summarizeZipCsvEntries,
  type ZipCsvEntry,
} from '@/lib/mockTestCsvImport';

/* ─── CONSTANTS ─── */
const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const EXAM_NAMES = ['CDS', 'AFCAT'];
const EXAM_FILTER_NAMES = [...EXAM_NAMES, 'NDA', 'CAPF', 'SSBInterview'];

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
  'Reasoning',
  'Complete mock test',
];

const BLANK_FORM = {
  title: '',
  description: '',
  examName: '',
  examType: 'practice' as ExamType,
  subject: '',
  difficulty: 'medium' as Difficulty,
  duration: 60,
  totalQuestions: 100,
  totalMarks: 100,
  positiveMarking: 1,
  negativeMarking: 0.25,
  passingScore: 40,
  isPublished: true,
  isFree: true,
  price: 0,
};

/* ─── CSV TEMPLATE ─── */
// NOTE: correctAnswer is 0-indexed (0 = first option, 1 = second, etc.)
const CSV_TEMPLATE = `question,option1,option2,option3,option4,correctAnswer,explanation,subject,difficulty,source,image_file,image_data,has_figure
What is the capital of India?,Mumbai,New Delhi,Kolkata,Chennai,1,New Delhi is the capital of India since 1911.,Geography,easy,NCERT,,,
Who wrote the Indian national anthem?,Rabindranath Tagore,Bankim Chandra,Mahatma Gandhi,Jawaharlal Nehru,0,Rabindranath Tagore composed Jana Gana Mana in 1911.,History,easy,PYQ,,,`;

function safeInt(val: string | number, fallback = 0): number {
  const n = typeof val === 'number' ? val : parseInt(val);
  return isNaN(n) ? fallback : n;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}


/* ─── COMPONENT ─── */
export default function AdminMockTestsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [csvPreview, setCsvPreview] = useState<CsvPreviewQuestion[]>([]);
  const [csvImages, setCsvImages] = useState<File[]>([]);
  const [csvImagePreviews, setCsvImagePreviews] = useState<Map<string, string>>(new Map());
  const [csvUploading, setCsvUploading] = useState(false);
  const [csvUploadStatus, setCsvUploadStatus] = useState('');
  const [importBundleName, setImportBundleName] = useState<string | null>(null);
  const [zipCsvEntries, setZipCsvEntries] = useState<ZipCsvEntry[]>([]);
  const [selectedZipCsvPath, setSelectedZipCsvPath] = useState('');
  const [zipPaperSummaries, setZipPaperSummaries] = useState<
    Array<{ path: string; title: string; questionCount: number; figureCount: number; subject: string }>
  >([]);
  /** Per-CSV subject/title when a ZIP has multiple papers (not shared formData). */
  const [zipPaperMeta, setZipPaperMeta] = useState<Record<string, { title: string; subject: string }>>({});

  const isMultiZipImport = zipCsvEntries.length > 1;

  const persistZipPaperFormToMeta = (path: string) => {
    if (!path) return;
    setZipPaperMeta((prev) => ({
      ...prev,
      [path]: {
        title: formData.title.trim() || prev[path]?.title || paperTitleFromCsvPath(path),
        subject: formData.subject || prev[path]?.subject || '',
      },
    }));
  };

  const setZipPaperSubject = (path: string, subject: string) => {
    setZipPaperMeta((prev) => ({
      ...prev,
      [path]: {
        title: prev[path]?.title || paperTitleFromCsvPath(path),
        subject,
      },
    }));
    if (path === selectedZipCsvPath) {
      setFormData((f) => ({ ...f, subject }));
    }
  };
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const bundleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const previews = new Map<string, string>();
    csvImages.forEach((file) => previews.set(imageFileKey(file.name), URL.createObjectURL(file)));
    setCsvImagePreviews(previews);
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [csvImages]);

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
    } catch (error) {
      showMsg('error', `Failed to load tests: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTests(); }, [loadTests]);

  useEffect(() => {
    if (searchParams.get('import') !== '1') return;
    setShowUploadModal(true);
    const next = new URLSearchParams(searchParams);
    next.delete('import');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- open import modal once from dashboard link
  }, []);

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
  const isTestFree = (test: MockTest) =>
    test.isFree ?? tests.filter((item) => item.examName === test.examName && item.isPublished).findIndex((item) => item.id === test.id) === 0;

  const openCreate = () => {
    setEditingTest(null);
    resetForm();
    setShowCreateModal(true);
  };

  const openEdit = (test: MockTest) => {
    setEditingTest(test);
    const marking = getMockTestMarkingScheme(test.examName, test);
    setFormData({
      title: test.title || '',
      description: test.description || '',
      examName: test.examName || '',
      examType: test.examType || 'practice',
      subject: test.subject || '',
      difficulty: test.difficulty || 'medium',
      duration: test.duration || 60,
      totalQuestions: test.totalQuestions || 100,
      totalMarks: test.totalMarks || 100,
      ...marking,
      passingScore: test.passingScore || 40,
      isPublished: test.isPublished ?? true,
      isFree: isTestFree(test),
      price: test.price ?? 99,
    });
    setQuestions(test.questions || []);
    setShowCreateModal(true);
  };

  const setNum = (key: keyof typeof BLANK_FORM, val: string) =>
    setFormData(f => ({ ...f, [key]: safeInt(val) }));
  const setExamName = (examName: string) =>
    setFormData((f) => ({
      ...f,
      examName,
      ...getMockTestMarkingScheme(examName, {
        positiveMarking: BLANK_FORM.positiveMarking,
        negativeMarking: BLANK_FORM.negativeMarking,
      }),
    }));
  const applyStandardTitle = () => {
    if (!formData.examName) {
      showMsg('error', 'Select an exam before generating a standard title.');
      return;
    }
    const titleWithoutSuffix = formData.title.replace(/\s*[–—-]\s*Mock Test\s*$/i, '').trim();
    const escapedExamName = formData.examName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const inferredSubject = titleWithoutSuffix
      .replace(new RegExp(`^${escapedExamName}\\s*`, 'i'), '')
      .replace(/^(?:(?:20\d{2})\s*)?(?:P(?:aper)?\s*\d+\s*)?(?:Q\s*\d+(?:\s*[-–]\s*\d+)?\s*)?/i, '')
      .trim();
    const subject = formData.subject.trim() || inferredSubject;
    if (!subject) {
      showMsg('error', 'Select a subject or add it to the current title before generating a standard title.');
      return;
    }
    setFormData((f) => ({ ...f, title: formatMockTestTitle(f.examName, subject) }));
  };

  /* ─── CSV ─── */
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const parseCsvText = (text: string, sourceName: string, options?: { silent?: boolean }) => {
    try {
      const fallbackSubject =
        zipPaperMeta[sourceName]?.subject ||
        zipPaperSummaries.find((s) => s.path === sourceName)?.subject ||
        formData.subject;
      const parsed = parseMockTestCsv(text, fallbackSubject);
      setCsvPreview(parsed);
      const inferredSubject = primarySubjectFromParsed(parsed, fallbackSubject);

      if (zipCsvEntries.length > 1) {
        if (!options?.silent) {
          const withImages = parsed.filter((q) => q.imageData || q.imageFileName).length;
          showMsg(
            'success',
            `Parsed ${parsed.length} questions${withImages ? ` (${withImages} with figures)` : ''}.`,
          );
        }
        return;
      }

      if (inferredSubject) setFormData((f) => ({ ...f, subject: inferredSubject }));
      if (!formData.title.trim() && sourceName.toLowerCase().endsWith('.csv')) {
        setFormData((f) => ({ ...f, title: paperTitleFromCsvPath(sourceName) }));
      }

      if (!options?.silent) {
        const withImages = parsed.filter((q) => q.imageData || q.imageFileName).length;
        showMsg(
          'success',
          `Parsed ${parsed.length} questions from ${sourceName}${withImages ? ` (${withImages} with figures)` : ''}.`,
        );
      }
    } catch (error) {
      setCsvPreview([]);
      showMsg('error', `Could not parse CSV: ${getErrorMessage(error)}`);
    }
  };

  const processFile = (file: File) => {
    const lower = file.name.toLowerCase();
    if (lower.endsWith('.zip')) {
      void processBundle(file);
      return;
    }
    if (!lower.endsWith('.csv')) {
      showMsg('error', 'Please upload a .csv file or .zip bundle.');
      return;
    }
    setCsvFile(file);
    setImportBundleName(null);
    setZipCsvEntries([]);
    setSelectedZipCsvPath('');
    setCsvPreview([]);
    const reader = new FileReader();
    reader.onload = (e) => parseCsvText(String(e.target?.result ?? ''), file.name);
    reader.onerror = () => showMsg('error', 'Error reading file.');
    reader.readAsText(file);
  };

  const loadZipCsvEntry = (entry: ZipCsvEntry, options?: { silent?: boolean }) => {
    setCsvFile(entry.file);
    setSelectedZipCsvPath(entry.path);
    const reader = new FileReader();
    reader.onload = (e) => parseCsvText(String(e.target?.result ?? ''), entry.path, options);
    reader.onerror = () => showMsg('error', 'Error reading CSV from ZIP.');
    reader.readAsText(entry.file);
  };

  const processBundle = async (file: File, csvPathOrName?: string) => {
    try {
      const { csv, images, csvEntries } = await extractMockImportBundle(file, csvPathOrName);
      setImportBundleName(file.name);
      setZipCsvEntries(csvEntries);
      if (images.length) setCsvImages((prev) => mergeImageFiles(prev, images));
      const summaries = await summarizeZipCsvEntries(csvEntries, formData.subject);
      setZipPaperSummaries(summaries);
      const initialMeta: Record<string, { title: string; subject: string }> = {};
      summaries.forEach((row) => {
        initialMeta[row.path] = { title: row.title, subject: row.subject };
      });
      setZipPaperMeta(initialMeta);
      const firstEntry = csvEntries.find((e) => e.file === csv) ?? { path: csv.name, file: csv };
      setFormData((f) => ({
        ...f,
        title: initialMeta[firstEntry.path]?.title ?? paperTitleFromCsvPath(firstEntry.path),
        subject: initialMeta[firstEntry.path]?.subject ?? '',
      }));
      loadZipCsvEntry(firstEntry, { silent: csvEntries.length > 1 });
      const multi = csvEntries.length > 1;
      showMsg(
        'success',
        multi
          ? `Found ${csvEntries.length} papers and ${images.length} image(s). Use “Create all papers” to publish every CSV as its own mock test.`
          : `Extracted ${images.length} image(s) from ${file.name}.`,
      );
    } catch (error) {
      showMsg('error', getErrorMessage(error));
    }
  };

  const handleZipCsvChange = (path: string) => {
    const entry = zipCsvEntries.find((e) => e.path === path);
    if (!entry) return;

    setZipPaperMeta((prev) => {
      const next = { ...prev };
      if (selectedZipCsvPath && selectedZipCsvPath !== path) {
        next[selectedZipCsvPath] = {
          title:
            formData.title.trim() ||
            next[selectedZipCsvPath]?.title ||
            paperTitleFromCsvPath(selectedZipCsvPath),
          subject: formData.subject,
        };
      }
      const picked = next[path];
      const summary = zipPaperSummaries.find((s) => s.path === path);
      setFormData((f) => ({
        ...f,
        title: picked?.title || summary?.title || paperTitleFromCsvPath(path),
        subject: picked?.subject ?? summary?.subject ?? '',
      }));
      return next;
    });

    loadZipCsvEntry(entry, { silent: true });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const zip = files.find((f) => f.name.toLowerCase().endsWith('.zip'));
    const csv = files.find((f) => f.name.toLowerCase().endsWith('.csv'));
    const images = files.filter((f) => f.type.startsWith('image/'));
    if (zip) void processBundle(zip);
    else if (csv) processFile(csv);
    if (images.length) setCsvImages((prev) => mergeImageFiles(prev, images));
    if (!zip && !csv && !images.length) {
      showMsg('error', 'Drop a .zip bundle, .csv file, or image files.');
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mock_test_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const clearCsvImport = () => {
    setCsvFile(null);
    setCsvPreview([]);
    setCsvImages([]);
    setImportBundleName(null);
    setZipCsvEntries([]);
    setSelectedZipCsvPath('');
    setZipPaperSummaries([]);
    setZipPaperMeta({});
    setCsvUploadStatus('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
    if (bundleInputRef.current) bundleInputRef.current.value = '';
  };

  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    const selected = Array.from(files);
    const invalid = selected.find((file) => !file.type.startsWith('image/'));
    if (invalid) {
      showMsg('error', `${invalid.name} is not a supported image file.`);
      return;
    }
    setCsvImages((prev) => mergeImageFiles(prev, selected));
  };

  const createOnePaperFromCsv = async (
    parsed: CsvPreviewQuestion[],
    meta: { title: string; subject?: string; sourcePath: string },
  ) => {
    const questionsWithImages = await materializeCsvQuestions(
      parsed,
      csvImages,
      uploadImage,
      (uploaded, total) => setCsvUploadStatus(`Uploading images ${uploaded}/${total}…`),
    );
    const subject = meta.subject || primarySubjectFromParsed(parsed, formData.subject) || formData.subject;
    const marking = getMockTestMarkingScheme(formData.examName, formData);
    const title =
      meta.title.trim() === paperTitleFromCsvPath(meta.sourcePath)
        ? formatMockTestTitle(formData.examName, subject)
        : meta.title;
    await createMockTest({
      ...formData,
      ...marking,
      title,
      subject,
      totalQuestions: parsed.length,
      totalMarks: parsed.length * marking.positiveMarking,
      questions: questionsWithImages,
      createdBy: 'admin',
    });
  };

  const handleCsvUpload = async () => {
    if (!csvPreview.length) { showMsg('error', 'No questions parsed yet.'); return; }
    const title = formData.title.trim() || paperTitleFromCsvPath(selectedZipCsvPath || csvFile?.name || 'Mock paper');
    if (!formData.examName) { showMsg('error', 'Exam name is required.'); return; }
    if (!formData.isFree && formData.price <= 0) { showMsg('error', 'Paid tests must have a price greater than zero.'); return; }
    setCsvUploading(true);
    setCsvUploadStatus('Preparing questions…');
    try {
      if (selectedZipCsvPath) persistZipPaperFormToMeta(selectedZipCsvPath);
      const path = selectedZipCsvPath || csvFile?.name || '';
      const subject = zipPaperMeta[path]?.subject || formData.subject;
      await createOnePaperFromCsv(csvPreview, { title, subject, sourcePath: path });
      showMsg('success', `Test created with ${csvPreview.length} questions!`);
      setShowUploadModal(false);
      clearCsvImport();
      resetForm();
      loadTests();
    } catch (error) {
      showMsg('error', `Failed to create test from CSV: ${getErrorMessage(error)}`);
    } finally {
      setCsvUploading(false);
      setCsvUploadStatus('');
    }
  };

  const handleBatchZipImport = async () => {
    if (!zipCsvEntries.length) {
      showMsg('error', 'Upload a ZIP with multiple CSV papers first.');
      return;
    }
    if (!formData.examName) { showMsg('error', 'Exam name is required (e.g. AFCAT).'); return; }
    if (!formData.isFree && formData.price <= 0) { showMsg('error', 'Paid tests must have a price greater than zero.'); return; }

    const metaSnapshot = { ...zipPaperMeta };
    if (selectedZipCsvPath) {
      metaSnapshot[selectedZipCsvPath] = {
        title:
          formData.title.trim() ||
          metaSnapshot[selectedZipCsvPath]?.title ||
          paperTitleFromCsvPath(selectedZipCsvPath),
        subject: formData.subject || metaSnapshot[selectedZipCsvPath]?.subject || '',
      };
    }

    setCsvUploading(true);
    try {
      for (let i = 0; i < zipCsvEntries.length; i++) {
        const entry = zipCsvEntries[i];
        const meta = metaSnapshot[entry.path];
        const title = meta?.title || paperTitleFromCsvPath(entry.path);
        setCsvUploadStatus(`Paper ${i + 1}/${zipCsvEntries.length}: ${title}`);
        const text = await entry.file.text();
        const subjectHint = meta?.subject || zipPaperSummaries.find((s) => s.path === entry.path)?.subject || '';
        const parsed = parseMockTestCsv(text, subjectHint);
        await createOnePaperFromCsv(parsed, {
          title,
          subject: meta?.subject || primarySubjectFromParsed(parsed, subjectHint),
          sourcePath: entry.path,
        });
      }
      showMsg('success', `Created ${zipCsvEntries.length} mock papers from the ZIP.`);
      setShowUploadModal(false);
      clearCsvImport();
      resetForm();
      loadTests();
    } catch (error) {
      showMsg('error', `Batch import stopped: ${getErrorMessage(error)}`);
    } finally {
      setCsvUploading(false);
      setCsvUploadStatus('');
    }
  };

  /* ─── SAVE / UPDATE ─── */
  const handleSave = async () => {
    if (!formData.title.trim()) { showMsg('error', 'Title is required.'); return; }
    if (!formData.examName) { showMsg('error', 'Exam name is required.'); return; }
    if (!formData.isFree && formData.price <= 0) { showMsg('error', 'Paid tests must have a price greater than zero.'); return; }
    setSaving(true);
    try {
      const marking = getMockTestMarkingScheme(formData.examName, formData);
      const payload = {
        ...formData,
        ...marking,
        totalQuestions: questions.length,
        totalMarks: questions.length * marking.positiveMarking,
        questions,
      };
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
    } catch (error) {
      showMsg('error', `Failed to save test: ${getErrorMessage(error)}`);
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

  /* ─── STATS ─── */
  const totalQ = tests.reduce((a, t) => a + (t.questions?.length || 0), 0);
  const published = tests.filter(t => t.isPublished).length;
  const drafts = tests.length - published;

  const embeddedImageCount = csvPreview.filter((q) => q.imageData).length;
  const fileLinkedCount = csvPreview.filter((q) => q.imageFileName && !q.imageData).length;

  return (
    <AdminShell
      showAdminHomeLink
      toolbar={
        <>
          <span className="adm-toolbar-title">Mock test manager</span>
          <button type="button" className="btn btn-outline btn-sm" onClick={downloadTemplate}>
            <Download size={13} /> Template
          </button>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => setShowUploadModal(true)}>
            <Archive size={13} /> Import CSV / ZIP
          </button>
          <button type="button" className="btn btn-teal btn-sm" onClick={openCreate}>
            <Plus size={13} /> New paper
          </button>
        </>
      }
    >

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
              {EXAM_FILTER_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
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
                    <th>S.No</th>
                    <th>Title</th>
                    <th>Exam</th>
                    <th>Difficulty</th>
                    <th>Questions</th>
                    <th>Duration</th>
                    <th>Access</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTests.map((test, index) => (
                    <tr key={test.id}>
                      <td style={{ fontWeight: 600 }}>{index + 1}</td>
                      <td>
                        <div className="adm-td-title">{test.title}</div>
                        {test.subject && <div className="adm-td-sub">{test.subject}</div>}
                      </td>
                      <td><span className="badge badge-outline">{test.examName}</span></td>
                      <td><span className={`badge ${diffBadge(test.difficulty)}`}>{test.difficulty}</span></td>
                      <td style={{ fontWeight: 600 }}>{test.questions?.length ?? 0}</td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13 }}>
                          <Clock size={13} color="#aaa" />{test.duration} min
                        </span>
                      </td>
                      <td>{isTestFree(test) ? 'Free' : `₹${test.price ?? 0}`}</td>
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

      {/* ─── CSV / ZIP UPLOAD MODAL ─── */}
      {showUploadModal && (
        /* FIX #8: clicking backdrop closes modal */
        <div className="adm-overlay" onClick={() => { setShowUploadModal(false); clearCsvImport(); }}>
          <div className="adm-modal adm-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <div>
                <div className="adm-modal-title">Import mock test paper</div>
                <div className="adm-modal-sub">CSV with optional image_data (base64) or ZIP (CSV + PNG via image_file)</div>
              </div>
              <button className="adm-modal-close" onClick={() => { setShowUploadModal(false); clearCsvImport(); }}>
                <X size={18} />
              </button>
            </div>

            <div className="adm-modal-body">
              {/* FIX #9: clarify 0-indexed correctAnswer */}
              <div className="adm-format-note">
                <strong>Required:</strong> question, four options, correct answer (A–D or 0–3).
                <br />
                <strong>Images:</strong> put <code>data:image/png;base64,…</code> in <strong>image_data</strong> (self-contained CSV), or set{' '}
                <strong>image_file</strong> to a PNG name and upload a <strong>.zip</strong> that contains the CSV + images folder.
                <br />
                Excel shows image_data as long text — that is normal; the app renders it in the CBT as a diagram.
              </div>

              <div className="adm-form-grid" style={{ marginBottom: 16 }}>
                <div className="adm-field adm-form-full">
                  <label className="adm-label">{isMultiZipImport ? 'Title (preview paper only)' : 'Test Title *'}</label>
                  <input
                    className="adm-input"
                    placeholder="e.g. CDS General Knowledge – Mock Test"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData((f) => ({ ...f, title }));
                      if (isMultiZipImport && selectedZipCsvPath) {
                        setZipPaperMeta((prev) => ({
                          ...prev,
                          [selectedZipCsvPath]: {
                            subject: prev[selectedZipCsvPath]?.subject ?? formData.subject,
                            title,
                          },
                        }));
                      }
                    }}
                  />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Exam *</label>
                  <select required className="adm-native-select" value={formData.examName} onChange={e => setExamName(e.target.value)}>
                    <option value="">Select exam…</option>
                    {EXAM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="NDA" disabled>NDA — Coming soon</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Access *</label>
                  <select className="adm-native-select" value={formData.isFree ? 'free' : 'paid'} onChange={e => setFormData(f => ({ ...f, isFree: e.target.value === 'free', price: e.target.value === 'free' ? 0 : (f.price || 99) }))}>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                {!formData.isFree && (
                  <div className="adm-field">
                    <label className="adm-label">Price (₹) *</label>
                    <input required min="1" type="number" className="adm-input" value={formData.price} onChange={e => setNum('price', e.target.value)} />
                  </div>
                )}
                {!isMultiZipImport && (
                  <div className="adm-field">
                    <label className="adm-label">Subject</label>
                    <select
                      className="adm-native-select"
                      value={formData.subject}
                      onChange={(e) => setFormData((f) => ({ ...f, subject: e.target.value }))}
                    >
                      <option value="">Select subject…</option>
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="adm-field">
                  <label className="adm-label">Duration (min)</label>
                  <input type="number" className="adm-input" value={formData.duration} onChange={e => setNum('duration', e.target.value)} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Marks per correct answer</label>
                  <input type="number" min="0" step="0.01" className="adm-input" readOnly={hasFixedMockTestMarkingScheme(formData.examName)} value={formData.positiveMarking} onChange={e => setFormData(f => ({ ...f, positiveMarking: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Penalty per wrong answer</label>
                  <input type="number" min="0" step="0.01" className="adm-input" readOnly={hasFixedMockTestMarkingScheme(formData.examName)} value={formData.negativeMarking} onChange={e => setFormData(f => ({ ...f, negativeMarking: parseFloat(e.target.value) || 0 }))} />
                </div>
              </div>
              <p className="adm-modal-sub" style={{ marginBottom: 16 }}>
                Unanswered questions score 0. Maximum marks are calculated from the uploaded question count.
                {csvPreview.length > 0 && ` Current maximum: ${csvPreview.length * formData.positiveMarking} marks.`}
              </p>

              <div className="adm-import-bundle">
                <div
                  className={`adm-dropzone ${dragActive ? 'adm-dropzone-active' : ''} ${csvFile ? 'adm-dropzone-done' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => bundleInputRef.current?.click()}
                >
                  <input
                    ref={bundleInputRef}
                    type="file"
                    accept=".zip,.csv,text/csv,application/zip"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,text/csv"
                    style={{ display: 'none' }}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                  />
                  {csvFile ? (
                    <>
                      <div className="adm-dropzone-title" style={{ color: '#15803d' }}>
                        {importBundleName ?? csvFile.name}
                      </div>
                      <div className="adm-dropzone-sub">
                        {(csvFile.size / 1024).toFixed(1)} KB · {csvPreview.length} questions
                        {embeddedImageCount > 0 && ` · ${embeddedImageCount} embedded image_data`}
                        {csvImages.length > 0 && ` · ${csvImages.length} PNG from bundle/files`}
                      </div>
                      <button type="button" className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); clearCsvImport(); }}>
                        <X size={12} /> Clear
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="adm-dropzone-icon"><Archive size={28} color="#0f766e" /></div>
                      <div className="adm-dropzone-title">Drop ZIP or CSV here</div>
                      <div className="adm-dropzone-sub">ZIP can include multiple CSVs (pick one) + PNGs · or CSV with image_data</div>
                      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button type="button" className="btn btn-teal btn-sm" onClick={(e) => { e.stopPropagation(); bundleInputRef.current?.click(); }}>
                          Browse ZIP / CSV
                        </button>
                        <button type="button" className="btn btn-outline btn-sm" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                          CSV only
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {zipPaperSummaries.length > 1 && (
                  <div className="adm-import-asset" style={{ marginTop: 12 }}>
                    <div className="adm-import-asset-title">Papers in this ZIP ({zipPaperSummaries.length})</div>
                    <div className="adm-import-asset-help">
                      Each row is saved as its own mock test. Subject is stored per paper (from CSV section column) — edit below without affecting other papers.
                    </div>
                    <ul className="adm-side-list" style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {zipPaperSummaries.map((row) => {
                        const subjectValue = zipPaperMeta[row.path]?.subject ?? row.subject;
                        return (
                          <li key={row.path} style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                              <span style={{ fontWeight: 700, fontSize: 12 }}>{row.title}</span>
                              <span style={{ fontSize: 11, color: '#64748b' }}>
                                {row.questionCount} Q · {row.figureCount} fig
                              </span>
                            </div>
                            <input
                              className="adm-input"
                              list="zip-subject-suggestions"
                              value={subjectValue}
                              placeholder="Subject / section from CSV"
                              onChange={(e) => setZipPaperSubject(row.path, e.target.value)}
                            />
                          </li>
                        );
                      })}
                    </ul>
                    <datalist id="zip-subject-suggestions">
                      {SUBJECT_OPTIONS.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>
                )}

                {isMultiZipImport && (
                  <div className="adm-field" style={{ marginTop: 12 }}>
                    <label className="adm-label" htmlFor="zip-csv-pick">Preview one paper (optional)</label>
                    <select
                      id="zip-csv-pick"
                      className="adm-native-select"
                      value={selectedZipCsvPath}
                      onChange={(e) => handleZipCsvChange(e.target.value)}
                    >
                      {zipCsvEntries.map((entry) => (
                        <option key={entry.path} value={entry.path}>{entry.path}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="adm-import-steps" style={{ marginTop: 12 }}>
                  <div className="adm-import-asset">
                    <div className="adm-import-asset-title">
                      <Upload size={16} /> Extra images <span style={{ fontWeight: 500, color: '#94a3b8' }}>optional</span>
                    </div>
                    <div className="adm-import-asset-help">
                      Add PNGs whose filenames match <strong>image_file</strong> ({fileLinkedCount} row{fileLinkedCount === 1 ? '' : 's'} need files).
                    </div>
                    <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={(e) => handleImageSelection(e.target.files)} />
                    {csvImages.length > 0 && (
                      <div className="adm-image-files">
                        {csvImages.length} file(s): {csvImages.map((file) => file.name).join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {csvUploadStatus && <p className="adm-upload-progress">{csvUploadStatus}</p>}

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
                        {q.passage && <div className="adm-modal-sub">{q.passage}</div>}
                        {(() => {
                          const selectedImage = q.imageFileName ? csvImagePreviews.get(imageFileKey(q.imageFileName)) : undefined;
                          const previewImage = selectedImage || q.imageData;
                          return previewImage
                            ? <img className="adm-preview-image" src={previewImage} alt={`Question ${q.id} diagram`} />
                            : q.hasFigure || q.imageFileName
                              ? <div className="adm-requirement-note">Image required: {q.imageFileName ?? 'select an image file or provide image_data'}</div>
                              : null;
                        })()}
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
              {csvPreview.length > 0 && !formData.examName && (
                <div className="adm-requirement-note">
                  Select an exam (e.g. AFCAT) above, then create one paper or all papers from the ZIP.
                </div>
              )}
            </div>

            <div className="adm-modal-footer">
              <button className="btn btn-outline" onClick={() => { setShowUploadModal(false); clearCsvImport(); }}>Cancel</button>
              <button className="btn btn-outline btn-sm" onClick={downloadTemplate} style={{ marginRight: 'auto' }}>
                <Download size={12} /> Download Template
              </button>
              {zipCsvEntries.length > 1 && (
                <button
                  type="button"
                  className="btn btn-teal"
                  disabled={csvUploading || !formData.examName}
                  onClick={handleBatchZipImport}
                >
                  {csvUploading ? 'Creating…' : `Create all ${zipCsvEntries.length} papers`}
                </button>
              )}
              <button
                type="button"
                className="btn btn-primary"
                disabled={csvUploading || !csvPreview.length || !formData.examName}
                onClick={handleCsvUpload}
              >
                {csvUploading
                  ? 'Creating…'
                  : zipCsvEntries.length > 1
                    ? `Create this paper only (${csvPreview.length} Qs)`
                    : `Create test (${csvPreview.length} Qs)`}
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <label className="adm-label">Test Title *</label>
                    <button type="button" className="btn btn-outline btn-sm" onClick={applyStandardTitle}>
                      Use standard title
                    </button>
                  </div>
                  <input className="adm-input" placeholder="e.g. CDS English – Mock Test" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="adm-field adm-form-full">
                  <label className="adm-label">Description</label>
                  <textarea className="adm-textarea" placeholder="Brief description…" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Exam *</label>
                  <select className="adm-native-select" value={formData.examName} onChange={e => setExamName(e.target.value)}>
                    <option value="">Select exam…</option>
                    {editingTest && !EXAM_NAMES.includes(editingTest.examName) && editingTest.examName !== 'NDA' && (
                      <option value={editingTest.examName}>{editingTest.examName} (existing paper)</option>
                    )}
                    {EXAM_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
                    <option value="NDA" disabled>NDA — Coming soon</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label className="adm-label">Access *</label>
                  <select className="adm-native-select" value={formData.isFree ? 'free' : 'paid'} onChange={e => setFormData(f => ({ ...f, isFree: e.target.value === 'free', price: e.target.value === 'free' ? 0 : (f.price || 99) }))}>
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
                {!formData.isFree && (
                  <div className="adm-field">
                    <label className="adm-label">Price (₹) *</label>
                    <input required min="1" type="number" className="adm-input" value={formData.price} onChange={e => setNum('price', e.target.value)} />
                  </div>
                )}
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
                  <label className="adm-label">Maximum Marks (auto)</label>
                  <input type="number" className="adm-input" value={questions.length * formData.positiveMarking} readOnly />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Marks per correct answer</label>
                  <input type="number" step="0.01" className="adm-input" readOnly={hasFixedMockTestMarkingScheme(formData.examName)} value={formData.positiveMarking} onChange={e => setFormData(f => ({ ...f, positiveMarking: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div className="adm-field">
                  <label className="adm-label">Penalty per wrong answer</label>
                  <input type="number" step="0.01" className="adm-input" readOnly={hasFixedMockTestMarkingScheme(formData.examName)} value={formData.negativeMarking} onChange={e => setFormData(f => ({ ...f, negativeMarking: parseFloat(e.target.value) || 0 }))} />
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
    </AdminShell>
  );
}