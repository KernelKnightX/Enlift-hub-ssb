import type { Difficulty, MockTestQuestion } from '@/types/schema';

export interface CsvPreviewQuestion extends MockTestQuestion {
  imageFileName?: string;
  imageData?: string;
  hasFigure?: boolean;
}

export function parseCSVRecords(csv: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < csv.length; i++) {
    const ch = csv[i];
    if (ch === '"') {
      if (inQuotes && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      record.push(field.trim());
      field = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      record.push(field.trim());
      if (record.some((value) => value.length > 0)) records.push(record);
      record = [];
      field = '';
      if (ch === '\r' && csv[i + 1] === '\n') i++;
    } else {
      field += ch;
    }
  }
  if (inQuotes) throw new Error('The CSV contains an unclosed quoted field.');
  record.push(field.trim());
  if (record.some((value) => value.length > 0)) records.push(record);
  return records;
}

export function imageFileKey(fileName: string): string {
  return fileName.replace(/\\/g, '/').split('/').pop()?.trim().toLowerCase() ?? '';
}

export function imageFileFromDataUri(dataUri: string, fileName: string): File {
  const match = dataUri.match(/^data:(image\/[\w.+-]+);base64,([\s\S]+)$/i);
  if (!match) throw new Error('Embedded image data must be a base64 image data URI.');
  const binary = window.atob(match[2].replace(/\s/g, ''));
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const extension = match[1].split('/')[1].split('+')[0].replace('jpeg', 'jpg');
  return new File([bytes], fileName || `question-image.${extension}`, { type: match[1] });
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg)$/i;

export type ZipCsvEntry = { path: string; file: File };

export async function extractZipImportContents(zipFile: File): Promise<{
  csvEntries: ZipCsvEntry[];
  images: File[];
}> {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(await zipFile.arrayBuffer());
  const csvEntries: ZipCsvEntry[] = [];
  const images: File[] = [];

  for (const entry of Object.values(zip.files)) {
    if (entry.dir) continue;
    const path = entry.name.replace(/\\/g, '/');
    const base = path.split('/').pop() ?? '';
    if (!base || base.startsWith('.')) continue;

    if (base.toLowerCase().endsWith('.csv')) {
      const blob = await entry.async('blob');
      csvEntries.push({ path, file: new File([blob], base, { type: 'text/csv' }) });
      continue;
    }

    if (IMAGE_EXT.test(base)) {
      const blob = await entry.async('blob');
      const mime = blob.type || (base.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
      images.push(new File([blob], base, { type: mime }));
    }
  }

  csvEntries.sort((a, b) => a.path.localeCompare(b.path));
  return { csvEntries, images };
}

export function resolveZipCsvEntry(
  entries: ZipCsvEntry[],
  pathOrFileName: string,
): ZipCsvEntry | undefined {
  const key = imageFileKey(pathOrFileName);
  return entries.find(
    (entry) =>
      entry.path === pathOrFileName ||
      imageFileKey(entry.path) === key ||
      imageFileKey(entry.file.name) === key,
  );
}

/** @param csvPathOrName — when ZIP has multiple CSVs, pass path or filename to select one */
export async function extractMockImportBundle(
  file: File,
  csvPathOrName?: string,
): Promise<{ csv: File; images: File[]; csvEntries: ZipCsvEntry[] }> {
  const name = file.name.toLowerCase();
  if (!name.endsWith('.zip')) {
    if (name.endsWith('.csv')) {
      return { csv: file, images: [], csvEntries: [{ path: file.name, file }] };
    }
    throw new Error('Upload a .csv file or a .zip bundle (CSV + PNG images).');
  }

  const { csvEntries, images } = await extractZipImportContents(file);
  if (!csvEntries.length) {
    throw new Error('ZIP must include at least one .csv file with your questions.');
  }

  const picked =
    (csvPathOrName ? resolveZipCsvEntry(csvEntries, csvPathOrName) : undefined) ?? csvEntries[0];

  return { csv: picked.file, images, csvEntries };
}

export function parseMockTestCsv(
  csvText: string,
  defaultSubject: string,
): CsvPreviewQuestion[] {
  const records = parseCSVRecords(csvText);
  if (records.length < 2) throw new Error('CSV is empty or has no data rows.');

  const headers = records[0].map((value, index) =>
    (index === 0 ? value.replace(/^\uFEFF/, '') : value).trim().toLowerCase(),
  );
  const headerIndex = (...names: string[]) =>
    names.map((name) => headers.indexOf(name)).find((index) => index >= 0) ?? -1;

  const requiredHeaders = [
    ['question'],
    ['option1', 'option_a'],
    ['option2', 'option_b'],
    ['option3', 'option_c'],
    ['option4', 'option_d'],
    ['correctanswer', 'correct_answer'],
  ];
  const missingHeaders = requiredHeaders
    .filter((aliases) => headerIndex(...aliases) < 0)
    .map((aliases) => aliases[0]);
  if (missingHeaders.length) {
    throw new Error(
      `CSV is missing required column${missingHeaders.length > 1 ? 's' : ''}: ${missingHeaders.join(', ')}.`,
    );
  }

  const parsed: CsvPreviewQuestion[] = [];
  for (let i = 1; i < records.length; i++) {
    const values = records[i];
    const rowNumber = i + 1;
    const get = (...names: string[]) => values[headerIndex(...names)]?.trim() ?? '';
    const question = get('question');
    const options = [
      get('option1', 'option_a'),
      get('option2', 'option_b'),
      get('option3', 'option_c'),
      get('option4', 'option_d'),
    ];
    const correctAnswerText = get('correctanswer', 'correct_answer').toLowerCase();
    const answerLetter = correctAnswerText.match(/^[a-d]$/)
      ? correctAnswerText.charCodeAt(0) - 97
      : Number(correctAnswerText);
    const correctAnswer = answerLetter;

    if (!question) throw new Error(`Row ${rowNumber}: question is empty.`);
    if (options.some((option) => !option)) {
      throw new Error(`Row ${rowNumber}: all four answer options are required.`);
    }
    if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
      throw new Error(`Row ${rowNumber}: answer must be A-D or 0-3.`);
    }

    const difficultyText = get('difficulty').toLowerCase();
    const difficulty: Difficulty = ['easy', 'medium', 'hard'].includes(difficultyText)
      ? (difficultyText as Difficulty)
      : 'medium';
    const imageFileName = get('image_file') || '';
    const imageData = get('image_data') || '';
    const hasFigure = /^(yes|true|1)$/i.test(get('has_figure'));
    if (imageData && !/^data:image\/[\w.+-]+;base64,/i.test(imageData)) {
      throw new Error(`Row ${rowNumber}: image_data must be a base64 image data URI.`);
    }
    const passage = get('passage');
    parsed.push({
      id: parsed.length + 1,
      question,
      ...(passage ? { passage } : {}),
      options,
      correctAnswer,
      explanation: get('explanation') || '',
      subject: get('subject', 'section') || defaultSubject || 'General',
      difficulty,
      source: get('source') || '',
      ...(imageFileName ? { imageFileName } : {}),
      ...(imageData ? { imageData } : {}),
      ...(hasFigure ? { hasFigure } : {}),
    });
  }

  return parsed;
}

export function mergeImageFiles(existing: File[], incoming: File[]): File[] {
  const map = new Map<string, File>();
  [...existing, ...incoming].forEach((file) => map.set(imageFileKey(file.name), file));
  return Array.from(map.values());
}

/** Human-readable mock paper title from a CSV path inside a ZIP. */
export function paperTitleFromCsvPath(path: string): string {
  const base = path.split('/').pop()?.replace(/\.csv$/i, '') ?? 'Mock paper';
  return base.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
}

export function formatMockTestTitle(examName: string, subject: string): string {
  const formattedSubject = subject
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
  return `${examName.trim()}${formattedSubject ? ` ${formattedSubject}` : ''} – Mock Test`;
}

export function primarySubjectFromParsed(parsed: CsvPreviewQuestion[], fallback = ''): string {
  return parsed.find((q) => q.subject?.trim())?.subject?.trim() || fallback;
}

export async function materializeCsvQuestions(
  csvPreview: CsvPreviewQuestion[],
  csvImages: File[],
  uploadImageFn: (file: File, path: string) => Promise<string>,
  onImageProgress?: (uploaded: number, total: number) => void,
): Promise<MockTestQuestion[]> {
  const imageFilesByName = new Map<string, File[]>();
  csvImages.forEach((file) => {
    const key = imageFileKey(file.name);
    imageFilesByName.set(key, [...(imageFilesByName.get(key) ?? []), file]);
  });

  const imageUploads = csvPreview.map((question) => {
    const referencedName = question.imageFileName ? imageFileKey(question.imageFileName) : '';
    const matches = referencedName ? imageFilesByName.get(referencedName) ?? [] : [];
    if (matches.length > 1) {
      throw new Error(
        `More than one image is named "${question.imageFileName}". Keep only one file with that name.`,
      );
    }
    const file =
      matches[0] ??
      (question.imageData
        ? imageFileFromDataUri(
            question.imageData,
            question.imageFileName
              ? imageFileKey(question.imageFileName)
              : `question-${question.id}.png`,
          )
        : undefined);
    if ((question.hasFigure || question.imageFileName) && !question.imageData && !file) {
      throw new Error(
        `Question ${question.id} needs "${question.imageFileName ?? 'an image'}" from the ZIP or image_data in the CSV.`,
      );
    }
    return { question, file };
  });

  let uploaded = 0;
  const needUpload = imageUploads.filter((item) => item.file).length;

  return Promise.all(
    imageUploads.map(async ({ question, file }) => {
      const savedQuestion = { ...question };
      delete savedQuestion.imageFileName;
      delete savedQuestion.imageData;
      delete savedQuestion.hasFigure;
      const normalized: MockTestQuestion = {
        id: savedQuestion.id,
        question: savedQuestion.question,
        options: savedQuestion.options,
        correctAnswer: savedQuestion.correctAnswer,
        explanation: savedQuestion.explanation || '',
        subject: savedQuestion.subject?.trim() || 'General',
        difficulty: savedQuestion.difficulty,
        source: savedQuestion.source || '',
        ...(savedQuestion.passage ? { passage: savedQuestion.passage } : {}),
      };
      if (!file) return normalized;
      uploaded += 1;
      onImageProgress?.(uploaded, needUpload);
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const imageUrl = await uploadImageFn(
        file,
        `mock-tests/questions/${Date.now()}_${question.id}_${safeName}`,
      );
      return { ...normalized, imageUrl };
    }),
  );
}

export async function summarizeZipCsvEntries(
  entries: ZipCsvEntry[],
  defaultSubject: string,
): Promise<Array<{ path: string; title: string; questionCount: number; figureCount: number; subject: string }>> {
  const summaries = [];
  for (const entry of entries) {
    const text = await entry.file.text();
    const parsed = parseMockTestCsv(text, defaultSubject);
    summaries.push({
      path: entry.path,
      title: paperTitleFromCsvPath(entry.path),
      questionCount: parsed.length,
      figureCount: parsed.filter((q) => q.imageData || q.imageFileName || q.hasFigure).length,
      subject: primarySubjectFromParsed(parsed, defaultSubject),
    });
  }
  return summaries;
}
