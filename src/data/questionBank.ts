export type InterviewMode = 'full' | 'quick' | 'behavioral' | 'motivation';

export type QuestionCategory =
  | 'motivation'
  | 'behavioral'
  | 'mmi'
  | 'clinical'
  | 'school'
  | 'closing';

export interface BankQuestion {
  id: string;
  text: string;
  category: QuestionCategory;
  modes: InterviewMode[];
  /** Story-bank themes this Q can connect to for follow-ups */
  storyHints?: string[];
  followUpTemplates?: string[];
}

export const QUESTION_BANK: BankQuestion[] = [
  // Motivation / why dentistry
  {
    id: 'why-dentistry',
    text: "Brynn, thank you for joining me today. To start, what first drew you to dentistry, and what has kept that interest growing?",
    category: 'motivation',
    modes: ['full', 'quick', 'motivation'],
    storyHints: ['early-curiosity', 'simeonova', 'wolfe'],
    followUpTemplates: [
      "That's lovely — can you share a specific moment from shadowing that made dentistry feel like the right fit?",
      "How did that early curiosity evolve once you started seeing patients in a clinical setting?",
    ],
  },
  {
    id: 'why-you',
    text: "What strengths or experiences do you think will make you a strong dental student and, later, a caring clinician?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['irish-dance', 'leadership', 'communication', 'hobbies'],
    followUpTemplates: [
      "Can you give me one concrete example where that strength showed up under pressure?",
    ],
  },
  {
    id: 'patient-connection',
    text: "Dentistry is both technical and relational. How do you see yourself building trust with patients who are anxious or unsure?",
    category: 'motivation',
    modes: ['full', 'quick', 'motivation'],
    storyHints: ['wolfe', 'simeonova', 'communication'],
    followUpTemplates: [
      "Was there a particular patient encounter — even while shadowing — that taught you something about explaining care clearly?",
    ],
  },
  {
    id: 'mission',
    text: "Looking ahead, what kind of dentist do you hope to become, and what values would guide your practice?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['mission', 'access', 'simeonova'],
    followUpTemplates: [
      "How have volunteering or community experiences shaped that vision?",
    ],
  },
  {
    id: 'why-unc',
    text: "If you were interviewing for a school like UNC, why would that program be a strong match for you?",
    category: 'school',
    modes: ['full', 'motivation'],
    storyHints: ['unc'],
    followUpTemplates: [
      "What stood out to you about the community or curriculum when you visited or learned about the school?",
    ],
  },
  {
    id: 'access-care',
    text: "Access to oral health care remains uneven. How have you seen that challenge, and what role do you want to play in addressing it?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['access'],
    followUpTemplates: [
      "What did volunteering in a free clinic teach you about prevention and education?",
    ],
  },

  // Behavioral
  {
    id: 'tell-challenge',
    text: "Tell me about a time you faced a significant challenge or setback. How did you respond, and what did you learn?",
    category: 'behavioral',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['irish-dance', 'dat-gpa'],
    followUpTemplates: [
      "What specifically did you change in your approach after that experience?",
      "How might that lesson show up in dental school when courses get demanding?",
    ],
  },
  {
    id: 'ethics',
    text: "Describe a situation where you faced an ethical decision or peer pressure to do something you knew wasn't right. What did you do?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['ethics-quiz'],
    followUpTemplates: [
      "Looking back, is there anything you would handle differently — or that reinforced why integrity matters in healthcare?",
    ],
  },
  {
    id: 'conflict',
    text: "Tell me about a time you had a conflict with a coworker or teammate. How did you navigate it?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['restaurant', 'lab-team'],
    followUpTemplates: [
      "What communication approach worked best in that moment?",
    ],
  },
  {
    id: 'teamwork',
    text: "Describe a team project where coordination mattered. What was your role, and how did the group succeed — or struggle?",
    category: 'behavioral',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['lab-team', 'leadership'],
    followUpTemplates: [
      "How did you handle deadlines or unclear roles if they came up?",
    ],
  },
  {
    id: 'leadership',
    text: "Can you share an example of leadership — formal or informal — and what you learned from leading others?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['leadership'],
    followUpTemplates: [
      "How did you motivate people when interest or energy dipped?",
    ],
  },
  {
    id: 'failure',
    text: "Tell me about a time you didn't achieve a goal you cared about. How did you process that, and what kept you going?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['irish-dance', 'dat-gpa'],
    followUpTemplates: [
      "How do you balance loving the craft with wanting results?",
    ],
  },
  {
    id: 'dat-growth',
    text: "Academic paths aren't always linear. Can you talk about a time you had to adjust your study approach or retake something important?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['dat-gpa'],
    followUpTemplates: [
      "What study habits or support systems made the difference the second time?",
    ],
  },
  {
    id: 'communication-growth',
    text: "How have you worked to grow as a communicator — especially explaining complex ideas clearly?",
    category: 'behavioral',
    modes: ['full', 'behavioral', 'motivation'],
    storyHints: ['communication', 'wolfe'],
    followUpTemplates: [
      "Have you watched dentists explain procedures to nervous patients? What did you take from that?",
    ],
  },

  // MMI-style
  {
    id: 'mmi-anxious',
    text: "Imagine a patient arrives very anxious about a procedure and says they almost cancelled. How would you approach that conversation as a student or future dentist?",
    category: 'mmi',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['wolfe', 'communication'],
    followUpTemplates: [
      "What would you avoid saying in that moment?",
    ],
  },
  {
    id: 'mmi-teammate',
    text: "In clinic, a classmate repeatedly leaves documentation incomplete, which slows the team. How would you handle this?",
    category: 'mmi',
    modes: ['full', 'behavioral'],
    storyHints: ['lab-team', 'restaurant'],
    followUpTemplates: [
      "If a direct conversation didn't help, what would your next step be?",
    ],
  },
  {
    id: 'mmi-limited',
    text: "A patient needs treatment but has limited options due to cost or health constraints. How would you think through supporting them with empathy?",
    category: 'mmi',
    modes: ['full', 'motivation'],
    storyHints: ['perio', 'simeonova', 'access'],
    followUpTemplates: [
      "Have you observed a clinician navigate a similar situation?",
    ],
  },
  {
    id: 'mmi-feedback',
    text: "You receive critical feedback from a faculty member on a clinical skill. Walk me through how you'd respond in the moment and afterward.",
    category: 'mmi',
    modes: ['full', 'behavioral'],
    storyHints: ['irish-dance', 'dat-gpa', 'mission'],
    followUpTemplates: [
      "How do you usually turn feedback into a concrete practice plan?",
    ],
  },
  {
    id: 'hands-on',
    text: "Dentistry rewards fine motor skill and patience. What experiences outside of academics have prepared you for that kind of work?",
    category: 'clinical',
    modes: ['full', 'motivation'],
    storyHints: ['hobbies', 'irish-dance'],
    followUpTemplates: [
      "How do those hobbies translate to the precision and focus dentistry needs?",
    ],
  },
  {
    id: 'shadowing-tech',
    text: "Technology is changing dentistry quickly — imaging, digital crowns, implants. What have you seen that excited you, and why?",
    category: 'clinical',
    modes: ['full', 'motivation'],
    storyHints: ['wolfe'],
    followUpTemplates: [
      "How do you balance embracing new tools with keeping the patient at the center?",
    ],
  },

  // Closing
  {
    id: 'questions-for-us',
    text: "We're nearly at the end. What questions do you have for a dental school admissions committee — or what else should we know about you?",
    category: 'closing',
    modes: ['full', 'quick', 'behavioral', 'motivation'],
    followUpTemplates: [],
  },
  {
    id: 'anything-else',
    text: "Is there a story or experience we haven't covered that you especially want the committee to hear?",
    category: 'closing',
    modes: ['full', 'motivation'],
    followUpTemplates: [],
  },
];

const MODE_TARGETS: Record<InterviewMode, { min: number; max: number }> = {
  full: { min: 8, max: 12 },
  quick: { min: 3, max: 4 },
  behavioral: { min: 6, max: 8 },
  motivation: { min: 5, max: 7 },
};

export function getModeTarget(mode: InterviewMode): { min: number; max: number } {
  return MODE_TARGETS[mode];
}

/** Build an ordered question list for a mode (deterministic shuffle by seed-ish order) */
export function selectQuestions(mode: InterviewMode): BankQuestion[] {
  const pool = QUESTION_BANK.filter((q) => q.modes.includes(mode));
  const { max } = MODE_TARGETS[mode];

  const byCategory = (cats: QuestionCategory[]) =>
    pool.filter((q) => cats.includes(q.category));

  let selected: BankQuestion[] = [];

  if (mode === 'quick') {
    selected = [
      ...byCategory(['motivation']).slice(0, 1),
      ...byCategory(['behavioral']).slice(0, 1),
      ...byCategory(['mmi']).slice(0, 1),
      ...byCategory(['closing']).slice(0, 1),
    ];
  } else if (mode === 'behavioral') {
    selected = [
      ...byCategory(['behavioral']),
      ...byCategory(['mmi']).slice(0, 2),
      ...byCategory(['closing']).slice(0, 1),
    ];
  } else if (mode === 'motivation') {
    selected = [
      ...byCategory(['motivation', 'school', 'clinical']),
      ...byCategory(['closing']).slice(0, 1),
    ];
  } else {
    // full: opener + mix + closing
    const opener = byCategory(['motivation']).slice(0, 2);
    const mid = [
      ...byCategory(['behavioral']).slice(0, 3),
      ...byCategory(['mmi']).slice(0, 2),
      ...byCategory(['clinical', 'school']).slice(0, 2),
      ...byCategory(['motivation']).slice(2, 4),
    ];
    const closer = byCategory(['closing']).slice(0, 1);
    selected = [...opener, ...mid, ...closer];
  }

  // Dedupe by id, cap at max
  const seen = new Set<string>();
  const unique = selected.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  return unique.slice(0, max);
}
