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
  /** Per-answer coaching for up to 4 Q/A pairs. */
  answerNotes: { question: string; note: string }[];
  metrics: {
    answerCount: number;
    avgWords: number;
    shortAnswers: number;
    textAnswers: number;
    voiceAnswers: number;
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
  const fillers = new Set([
    'um',
    'uh',
    'like',
    'basically',
    'literally',
  ]);
  let count = 0;
  for (const w of words) {
    if (fillers.has(w.replace(/[,.]/g, ''))) count++;
  }
  const lower = text.toLowerCase();
  for (const f of ['you know', 'sort of', 'kind of']) {
    const m = lower.match(new RegExp(f, 'g'));
    if (m) count += m.length;
  }
  return count / words.length;
}

function hasSpecificity(text: string): boolean {
  return /\b(when|because|for example|one time|specifically|dr\.|clinic|patient|shadow|lab|retake)\b/i.test(
    text
  );
}

function hasResultLanguage(text: string): boolean {
  return /\b(result|outcome|because of|what changed|led to|ended up|learned|impact|so that|as a result)\b/i.test(
    text
  );
}

function hasActionLanguage(text: string): boolean {
  return /\b(i (did|asked|organized|led|helped|created|explained|decided|spoke|called|started|worked))\b/i.test(
    text
  );
}

function pairQuestionsAndAnswers(
  turns: TranscriptTurn[]
): { question: string; answer: string }[] {
  const pairs: { question: string; answer: string }[] = [];
  let lastQ = '';
  for (const t of turns) {
    if (t.role === 'interviewer') {
      lastQ = t.text;
    } else if (t.role === 'brynn') {
      pairs.push({ question: lastQ || 'Previous question', answer: t.text });
    }
  }
  return pairs;
}

function coachNoteForAnswer(_question: string, answer: string): string {
  const wc = wordCount(answer);

  if (wc < 20) {
    return 'Too short — expand with a brief situation, what you did, and one outcome or reflection.';
  }
  if (!hasSpecificity(answer) && wc < 50) {
    return 'Add one concrete detail (setting, person, or moment) so the answer is memorable.';
  }
  if (hasActionLanguage(answer) && !hasResultLanguage(answer)) {
    return 'You described what you did — finish with what changed or what you learned.';
  }
  if (wc >= 100) {
    return 'Strong length — practice a crisp closing sentence so you can land cleanly.';
  }
  if (hasSpecificity(answer) && wc >= 40) {
    return 'Good specificity. Keep that level of concrete detail in spoken practice.';
  }
  if (wc >= 25 && wc < 40) {
    return 'Solid start — push one more beat (action or result) to reach interview depth.';
  }
  return 'Clear enough — next pass, link the closing line explicitly to dentistry or growth.';
}

function buildAnswerNotes(
  turns: TranscriptTurn[],
  limit = 4
): { question: string; note: string }[] {
  return pairQuestionsAndAnswers(turns)
    .slice(0, limit)
    .map(({ question, answer }) => ({
      question,
      note: coachNoteForAnswer(question, answer),
    }));
}

export function generateHeuristicFeedback(
  turns: TranscriptTurn[],
  mode: InterviewMode
): SessionFeedback {
  const answerTurns = turns.filter((t) => t.role === 'brynn');
  const answers = answerTurns.map((t) => t.text);
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

  const textAnswers = answerTurns.filter((t) => t.inputMode === 'text').length;
  const voiceAnswers = answerTurns.filter((t) => t.inputMode === 'voice').length;
  const knownModality = textAnswers + voiceAnswers;
  const typedSession =
    knownModality > 0 ? textAnswers >= Math.ceil(knownModality * 0.6) : false;

  const storiesHit = storiesMentioned(answers);
  const allSummaries = STORY_BANK.map((s) => s.summary);
  const missed = allSummaries.filter((s) => !storiesHit.includes(s));
  const answerNotes = buildAnswerNotes(turns, 4);

  const strengths: string[] = [];
  const improveAreas: string[] = [];
  const deliveryTips: string[] = [];
  const practiceTips: string[] = [];

  if (answerCount === 0) {
    return {
      overallImpression:
        'The session ended before any answers were recorded. Try a Quick practice when you are ready — mic or text both work.',
      strengths: [],
      improveAreas: ['Complete at least a few answers so we can give useful feedback.'],
      contentVsStoryBank: 'No answers yet to compare against common interview themes.',
      deliveryTips: [
        'Allow microphone access and use Chrome or Edge for best speech recognition, or type answers in the text box.',
      ],
      practiceTips: [
        'Start with Quick mode (3–4 questions) to get comfortable.',
        'Keep a short list of real experiences nearby for the first few practice runs.',
        'Practice answering aloud in 60–90 seconds per question when you do a spoken pass.',
      ],
      storiesHit: [],
      storiesMissedSuggestions: missed.slice(0, 3),
      answerNotes: [],
      metrics: {
        answerCount: 0,
        avgWords: 0,
        shortAnswers: 0,
        textAnswers: 0,
        voiceAnswers: 0,
      },
      ttsSummary:
        'No answers were recorded this session. Try a short Quick practice when you are ready.',
    };
  }

  if (avgWords >= 40 && avgWords <= 120) {
    strengths.push(
      'Answer length was generally interview-appropriate — enough detail without rambling.'
    );
  }
  if (specificCount >= Math.ceil(answerCount * 0.5)) {
    strengths.push(
      'You often included concrete details (people, settings, or moments), which helps committees remember you.'
    );
  }
  if (storiesHit.length >= 2) {
    strengths.push(
      `You naturally brought in relevant themes (${storiesHit.length} detected), which keeps answers grounded.`
    );
  }
  if (!typedSession && avgFiller < 0.04) {
    strengths.push(
      'Delivery sounded relatively clean, with limited filler-word density in the transcript.'
    );
  }
  if (typedSession) {
    strengths.push(
      'You practiced content clearly via typing — useful for structuring answers before a spoken pass.'
    );
  }
  if (shortAnswers === 0) {
    strengths.push(
      'You avoided very short answers — good commitment to developing each response.'
    );
  }
  if (strengths.length === 0) {
    strengths.push(
      typedSession
        ? 'You showed up and practiced with typed answers — that builds content clarity.'
        : 'You showed up and practiced aloud — that alone builds interview stamina.'
    );
  }

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
  if (!typedSession && avgFiller >= 0.06) {
    improveAreas.push(
      'The transcript shows noticeable fillers (um/like/you know). A short pause is better than a filler.'
    );
  }
  if (storiesHit.length <= 1 && answerCount >= 3) {
    improveAreas.push(
      'Only limited overlap with common dental-interview themes showed up. Before the next run, pick 2–3 real experiences to weave in deliberately.'
    );
  }
  if (typedSession) {
    improveAreas.push(
      'This session was mostly typed (content practice). Next, do a spoken pass with the mic to rehearse delivery and pacing.'
    );
  }
  if (improveAreas.length === 0) {
    improveAreas.push(
      'Tighten the “so what” at the end of each answer — one sentence linking the story to dentistry or growth.'
    );
  }

  let contentVsStoryBank: string;
  if (storiesHit.length === 0) {
    contentVsStoryBank =
      'This session did not clearly surface common dental-interview themes (shadowing, service, teamwork, ethics, leadership, etc.). That is fine for a first pass — next time, map questions to real experiences you already have. Do not invent new experiences.';
  } else {
    contentVsStoryBank = `Themes in your answers: ${storiesHit.join('; ')}.`;
    if (missed.length > 0) {
      contentVsStoryBank += ` Themes you might still draw on in future interviews (only if relevant — never force them): ${missed
        .slice(0, 4)
        .join('; ')}.`;
    }
  }

  if (typedSession) {
    deliveryTips.push(
      'Answers were typed this session — treat this as content practice, then rehearse the same answers aloud.'
    );
    deliveryTips.push(
      'On a spoken pass: lead with a one-line thesis, then one example, then a brief reflection.'
    );
    deliveryTips.push(
      'Use Skip while the interviewer is speaking if you prefer to read the prompt and answer immediately.'
    );
  } else {
    deliveryTips.push(
      'Lead with a one-line thesis, then one example, then a brief reflection tied to dentistry.'
    );
    deliveryTips.push(
      'If you blank, restate the question in your own words — it buys thinking time without fillers.'
    );
    if (avgFiller >= 0.04) {
      deliveryTips.push('Practice 10 seconds of silence after a hard question before speaking.');
    } else {
      deliveryTips.push(
        'Keep eye contact with the camera (or interviewer) and smile briefly after finishing — it lands warmth.'
      );
    }
  }

  practiceTips.push(
    'Rehearse your “why dentistry” and one shadowing story until both fit in ~90 seconds.'
  );
  practiceTips.push(
    'Drill one behavioral STAR story (conflict, teamwork, or a time you failed) until the action steps are crisp.'
  );
  if (typedSession) {
    practiceTips.push(
      'Do the same Quick mode again by voice to practice delivery on answers you already structured.'
    );
  } else {
    practiceTips.push(
      'Record a Quick mode session weekly and compare average answer length and specificity.'
    );
  }
  if (mode !== 'behavioral') {
    practiceTips.push(
      'Do a Behavioral-only mode next to stress-test conflict, teamwork, and failure questions.'
    );
  } else {
    practiceTips.push(
      'Do a Motivation mode next to sharpen why dentistry / access / school-fit answers.'
    );
  }
  if (missed.length > 0) {
    practiceTips.push(
      `Prepare a bridge into: “${missed[0]}” — only use it when the question invites it.`
    );
  }

  let overallImpression: string;
  if (typedSession) {
    if (avgWords >= 40 && specificCount >= Math.ceil(answerCount * 0.5)) {
      overallImpression = `Strong typed practice session (${mode} mode, ${answerCount} answers). Content looks prepared and grounded. Next, do a spoken pass to rehearse delivery and timing.`;
    } else if (answerCount >= 3 && avgWords >= 30) {
      overallImpression = `Solid typed practice in ${mode} mode with ${answerCount} answers. Content is developing; focus next on specificity, then try answering aloud.`;
    } else {
      overallImpression = `Good typed start in ${mode} mode. Push for fuller, example-rich answers, then practice the same questions by voice.`;
    }
  } else if (
    avgWords >= 40 &&
    specificCount >= Math.ceil(answerCount * 0.5) &&
    storiesHit.length >= 2
  ) {
    overallImpression = `Strong practice session (${mode} mode, ${answerCount} answers). You came across prepared and grounded in real experiences. Keep polishing structure and endings so every answer closes with purpose.`;
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
    answerNotes,
    metrics: {
      answerCount,
      avgWords,
      shortAnswers,
      textAnswers,
      voiceAnswers,
    },
    ttsSummary,
  };
}
