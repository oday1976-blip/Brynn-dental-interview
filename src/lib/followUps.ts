import type { BankQuestion } from '../data/questionBank';
import { STORY_BANK } from '../data/brynnContext';

export type TranscriptTurn = {
  role: 'interviewer' | 'brynn';
  text: string;
  questionId?: string;
  isFollowUp?: boolean;
};

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function mentionsStory(answer: string): string[] {
  const lower = answer.toLowerCase();
  return STORY_BANK.filter((s) => s.labels.some((l) => lower.includes(l.toLowerCase()))).map(
    (s) => s.id
  );
}

function isVague(answer: string): boolean {
  const wc = wordCount(answer);
  if (wc < 25) return true;
  const vagueMarkers = [
    /i (just )?really (like|love|enjoy)/i,
    /it's (just )?important/i,
    /i've always wanted/i,
    /stuff like that/i,
    /and so on/i,
  ];
  const hasSpecific =
    /\b(when|because|for example|one time|specifically|dr\.|clinic|patient)\b/i.test(answer);
  return wc < 40 && vagueMarkers.some((r) => r.test(answer)) && !hasSpecific;
}

/**
 * Rule-based follow-up: at most one follow-up per main question.
 * Grounded in answer content + story bank hints — never invents new facts about Brynn.
 */
export function chooseFollowUp(
  question: BankQuestion,
  answer: string,
  alreadyFollowedUp: boolean
): string | null {
  if (alreadyFollowedUp) return null;
  if (question.category === 'closing') return null;

  const wc = wordCount(answer);
  if (wc < 8) {
    return "I'd love a bit more detail — can you walk me through a specific example?";
  }

  const hitStories = mentionsStory(answer);
  const templates = question.followUpTemplates ?? [];

  if (hitStories.length > 0 && templates.length > 0) {
    return templates[0];
  }

  if (isVague(answer) && templates.length > 0) {
    return templates[0];
  }

  if (wc >= 25 && wc < 60 && templates.length > 1) {
    return templates[1] ?? templates[0];
  }

  if (wc >= 60 && hitStories.length === 0 && templates.length > 0 && isVague(answer)) {
    return templates[0];
  }

  if (
    (question.category === 'behavioral' || question.category === 'mmi') &&
    wc >= 20 &&
    wc < 80 &&
    templates.length > 0
  ) {
    return templates[0];
  }

  return null;
}
