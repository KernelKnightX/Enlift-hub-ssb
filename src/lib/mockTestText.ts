const NUMBERED_STATEMENT = /(?<!\n)\s+(\d+[.)]\s+)/g;
const ANSWER_INSTRUCTION =
  /\s+(?=(?:select|choose)\s+the\s+correct\s+answer\b)/i;

export function formatMockQuestionText(question: string): string {
  return question
    .replace(NUMBERED_STATEMENT, '\n$1')
    .replace(ANSWER_INSTRUCTION, '\n\n');
}
