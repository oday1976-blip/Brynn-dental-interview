import type { BankQuestion } from '../data/questionBank';
import { STORY_BANK } from '../data/brynnContext';

export type TranscriptTurn = {
  role: 'interviewer' | 'brynn';
  text: string;
  questionId?: string;
  isFollowUp?: boolean;
  /** How the applicant submitted this answer (applicant turns only). */
  inputMode?: 'voice' | 'text';
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

function hasResultLanguage(answer: string): boolean {
  return /\b(result|outcome|because of|what changed|led to|ended up|learned|impact|so that|as a result)\b/i.test(
    answer
  );
}

function hasSpecificity(answer: string): boolean {
  return /\b(when|because|for example|one time|specifically|dr\.|clinic|patient|shadow|lab)\b/i.test(
    answer
  );
}

/** Pick a template by index with wrap-around; never invent applicant facts. */
function pickTemplate(templates: string[], preferredIndex: number): string | null {
  if (!templates.length) return null;
  return templates[preferredIndex % templates.length] ?? templates[0] ?? null;
}

/**
 * Rule-based follow-up: at most one follow-up per main question.
 * Grounded in answer content + theme hints — never invents new facts about the applicant.
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
  const specific = hasSpecificity(answer);
  const vague = isVague(answer);
  const behavioral =
    question.category === 'behavioral' || question.category === 'mmi';

  // Short answers → ask for a concrete example (prefer later templates when available)
  if (wc < 25 || (vague && wc < 40)) {
    const fromBank = pickTemplate(templates, templates.length > 1 ? 1 : 0);
    return (
      fromBank ??
      'Could you give me a concrete example — what happened, what you did, and how it turned out?'
    );
  }

  // Behavioral / MMI with action but weak result language
  if (behavioral && wc >= 20 && !hasResultLanguage(answer)) {
    return 'What changed because of what you did — for you, the team, or someone else?';
  }

  // Long + specific → reflection / impact rather than another example ask
  if (wc >= 60 && specific) {
    if (templates.length > 1) return pickTemplate(templates, 1);
    return 'Looking back, what impact did that have on how you approach similar situations now?';
  }

  // Theme hit → rotate into a related probe (prefer index 0, else 1)
  if (hitStories.length > 0 && templates.length > 0) {
    return pickTemplate(templates, 0);
  }

  // Medium length with templates → prefer second template when present
  if (wc >= 25 && wc < 60 && templates.length > 0) {
    return pickTemplate(templates, templates.length > 1 ? 1 : 0);
  }

  // Behavioral without a result probe already fired
  if (behavioral && wc >= 20 && wc < 80 && templates.length > 0) {
    return pickTemplate(templates, Math.min(1, templates.length - 1));
  }

  return null;
}
