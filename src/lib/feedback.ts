import { STORY_BANK } from '../data/brynnContext';
import type { TranscriptTurn } from './followUps';
import type { InterviewMode } from '../data/questionBank';

export interface SessionFeedback {
  overallImpression: string;
  strengths: string[];
  improveAreas: string[];
  contentVsStoryBank: string;
  deliveryTips: string[];
  practiceTips: string[];
  storiesHit: string[];
  storiesMissedSuggestions: string[];
  metrics: {
    answerCount: number;
    avgWords: number;
    shortAnswers: number;
  };
  ttsSummary: string;
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function storiesMentioned(answers: string[]): string[] {
  const joined = answers.join(' ').toLowerCase();
  return STORY_BANK.filter((s) =>
    s.labels.some((l) => joined.includes(l.toLowerCase()))
  ).map((s) => s.summary);
}

function fillerRatio(text: string): number {
  const words = text.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  const fillers = ['um', 'uh', 'like', 'you know', 'basically', 'literally', 'sort of', 'kind of'];
  let count = 0;
  for (const w of words) {
    if (fillers.includes(w.replace(/[,.]/g, ''))) count++;
  }
  // multi-word fillers
  const lower = text.toLowerCase();
  for (const f of ['you know', 'sort of', 'kind of']) {
    const m = lower.match(new RegExp(f, 'g'));
    if (m) count += m.length;
  }
  return count / words.length;
}

function hasSpecificity(text: string): boolean {
  return /\b(when|because|for example|one time|specifically|dr\.|clinic|patient|shadow|lab|dance|quiz|retake)\b/i.test(
    text
  );
}

export function generateHeuristicFeedback(
  turns: TranscriptTurn[],
  mode: InterviewMode
): SessionFeedback {
  const answers = turns.filter((t) => t.role === 'brynn').map((t) => t.text);
  const answerCount = answers.length;
  const wordCounts = answers.map(wordCount);
  const avgWords =
    wordCounts.length > 0
      ? Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length)
      : 0;
  const shortAnswers = wordCounts.filter((w) => w < 25).length;
  const longAnswers = wordCounts.filter((w) => w >= 80).length;
  const specificCount = answers.filter(hasSpecificity).length;
  const avgFiller =
    answers.length > 0
      ? answers.reduce((a, t) => a + fillerRatio(t), 0) / answers.length
      : 0;

  const storiesHit = storiesMentioned(answers);
  const allSummaries = STORY_BANK.map((s) => s.summary);
  const missed = allSummaries.filter((s) => !storiesHit.includes(s));

  const strengths: string[] = [];
  const improveAreas: string[] = [];
  const deliveryTips: string[] = [];
  const practiceTips: string[] = [];

  if (answerCount === 0) {
    return {
      overallImpression:
        'The session ended before any answers were recorded. Try a Quick practice with the mic enabled when you are ready.',
      strengths: [],
      improveAreas: ['Complete at least a few spoken answers so we can give useful feedback.'],
      contentVsStoryBank: 'No answers to compare against your story bank yet.',
      deliveryTips: ['Allow microphone access and use Chrome or Edge for best speech recognition.'],
      practiceTips: [
        'Start with Quick mode (3–4 questions) to get comfortable with tap-to-talk.',
        'Keep your story bank nearby for the first few practice runs.',
        'Practice answering aloud in 60–90 seconds per question.',
      ],
      storiesHit: [],
      storiesMissedSuggestions: missed.slice(0, 3),
      metrics: { answerCount: 0, avgWords: 0, shortAnswers: 0 },
      ttsSummary:
        'No answers were recorded this session. Try a short Quick practice when you are ready.',
    };
  }

  // Strengths
  if (avgWords >= 40 && avgWords <= 120) {
    strengths.push('Answer length was generally interview-appropriate — enough detail without rambling.');
  }
  if (specificCount >= Math.ceil(answerCount * 0.5)) {
    strengths.push('You often included concrete details (people, settings, or moments), which helps committees remember you.');
  }
  if (storiesHit.length >= 2) {
    strengths.push(
      `You naturally brought in experiences from your story bank (${storiesHit.length} themes detected), which keeps answers grounded.`
    );
  }
  if (avgFiller < 0.04) {
    strengths.push('Delivery sounded relatively clean, with limited filler-word density in the transcript.');
  }
  if (shortAnswers === 0) {
    strengths.push('You avoided very short answers — good commitment to developing each response.');
  }
  if (strengths.length === 0) {
    strengths.push('You showed up and practiced aloud — that alone builds interview stamina.');
  }

  // Improve
  if (shortAnswers >= 2 || avgWords < 35) {
    improveAreas.push(
      'Some answers were brief. Aim for a clear situation → action → result (or reflection) in about 60–90 seconds.'
    );
  }
  if (specificCount < Math.ceil(answerCount * 0.4)) {
    improveAreas.push(
      'Add more specifics: names of settings (clinic, lab, job, team), what you did, and what changed for the patient or team.'
    );
  }
  if (longAnswers >= 2) {
    improveAreas.push(
      'A few answers ran long. Practice a crisp landing sentence so you can stop cleanly when the point is made.'
    );
  }
  if (avgFiller >= 0.06) {
    improveAreas.push(
      'The transcript shows noticeable fillers (um/like/you know). A short pause is better than a filler.'
    );
  }
  if (storiesHit.length <= 1 && answerCount >= 3) {
    improveAreas.push(
      'Only limited overlap with your prepared story bank showed up. Before the next run, pick 2–3 stories to weave in deliberately.'
    );
  }
  if (improveAreas.length === 0) {
    improveAreas.push(
      'Tighten the “so what” at the end of each answer — one sentence linking the story to dentistry or growth.'
    );
  }

  // Content vs story bank
  let contentVsStoryBank: string;
  if (storiesHit.length === 0) {
    contentVsStoryBank =
      'This session did not clearly surface prepared themes (shadowing, service, teamwork, ethics, leadership, etc.). That is fine for a first pass — next time, consciously map questions to real experiences you already have. Do not invent new experiences.';
  } else {
    contentVsStoryBank = `Detected story-bank themes in your answers: ${storiesHit.join('; ')}.`;
    if (missed.length > 0) {
      contentVsStoryBank += ` Themes you might still draw on in future interviews (only if relevant — never force them): ${missed.slice(0, 4).join('; ')}.`;
    }
  }

  // Delivery
  deliveryTips.push('Lead with a one-line thesis, then one example, then a brief reflection tied to dentistry.');
  deliveryTips.push('If you blank, restate the question in your own words — it buys thinking time without fillers.');
  if (avgFiller >= 0.04) {
    deliveryTips.push('Practice 10 seconds of silence after a hard question before speaking.');
  } else {
    deliveryTips.push('Keep eye contact with the camera (or interviewer) and smile briefly after finishing — it lands warmth.');
  }

  // Practice tips (3–5)
  practiceTips.push('Rehearse your “why dentistry” and one shadowing story until both fit in ~90 seconds.');
  practiceTips.push('Drill one behavioral STAR story (conflict, teamwork, or a time you failed) until the action steps are crisp.');
  practiceTips.push('Record a Quick mode session weekly and compare average answer length and specificity.');
  if (mode !== 'behavioral') {
    practiceTips.push('Do a Behavioral-only mode next to stress-test conflict, teamwork, and failure questions.');
  } else {
    practiceTips.push('Do a Motivation mode next to sharpen why dentistry / access / school-fit answers.');
  }
  if (missed.length > 0) {
    practiceTips.push(
      `Prepare a bridge into: “${missed[0]}” — only use it when the question invites it.`
    );
  }

  // Overall
  let overallImpression: string;
  if (avgWords >= 40 && specificCount >= Math.ceil(answerCount * 0.5) && storiesHit.length >= 2) {
    overallImpression = `Strong practice session (${mode} mode, ${answerCount} answers). You sounded prepared and grounded in real experiences. Keep polishing structure and endings so every answer closes with purpose.`;
  } else if (answerCount >= 3 && avgWords >= 30) {
    overallImpression = `Solid effort in ${mode} mode with ${answerCount} answers. Content is developing; focus next on specificity and linking each story to the kind of dentist you want to become.`;
  } else {
    overallImpression = `Good start in ${mode} mode. Push for fuller, example-rich answers in the next round — committees remember concrete moments more than general statements.`;
  }

  const ttsSummary = [
    overallImpression.split('.')[0] + '.',
    strengths[0] ? `Strength: ${strengths[0]}` : '',
    improveAreas[0] ? `Focus area: ${improveAreas[0]}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return {
    overallImpression,
    strengths,
    improveAreas,
    contentVsStoryBank,
    deliveryTips,
    practiceTips: practiceTips.slice(0, 5),
    storiesHit,
    storiesMissedSuggestions: missed.slice(0, 4),
    metrics: { answerCount, avgWords, shortAnswers },
    ttsSummary,
  };
}
