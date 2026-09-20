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
  storyHints?: string[];
  followUpTemplates?: string[];
}

export const QUESTION_BANK: BankQuestion[] = [
  {
    id: 'why-dentistry',
    text: "Thank you for joining me today. To start, what first drew you to dentistry, and what has kept that interest growing?",
    category: 'motivation',
    modes: ['full', 'quick', 'motivation'],
    storyHints: ['why-dentistry', 'shadowing'],
    followUpTemplates: [
      "That is helpful — can you share a specific moment from shadowing or clinical observation that made dentistry feel like the right fit?",
      "How did that early interest evolve once you started seeing real patient care?",
    ],
  },
  {
    id: 'why-you',
    text: "What strengths or experiences do you think will make you a strong dental student and, later, a caring clinician?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['leadership', 'communication', 'challenge'],
    followUpTemplates: [
      "Can you give me one concrete example where that strength showed up under pressure?",
    ],
  },
  {
    id: 'patient-connection',
    text: "Dentistry is both technical and relational. How do you see yourself building trust with patients who are anxious or unsure?",
    category: 'motivation',
    modes: ['full', 'quick', 'motivation'],
    storyHints: ['shadowing', 'communication'],
    followUpTemplates: [
      "Was there a particular patient encounter — even while shadowing — that taught you something about explaining care clearly?",
    ],
  },
  {
    id: 'mission',
    text: "Looking ahead, what kind of dentist do you hope to become, and what values would guide your practice?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry', 'service'],
    followUpTemplates: [
      "How have volunteering or community experiences shaped that vision?",
    ],
  },
  {
    id: 'why-school',
    text: "When you think about dental school fit, what matters most to you in a program — and why?",
    category: 'school',
    modes: ['full', 'motivation'],
    storyHints: ['school-fit'],
    followUpTemplates: [
      "What stood out to you about community, curriculum, or clinical training when you researched programs?",
    ],
  },
  {
    id: 'access-care',
    text: "Access to oral health care remains uneven. How have you seen that challenge, and what role do you want to play in addressing it?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['service'],
    followUpTemplates: [
      "What did community service or clinic volunteering teach you about prevention and education?",
    ],
  },
  {
    id: 'tell-challenge',
    text: "Tell me about a time you faced a significant challenge or setback. How did you respond, and what did you learn?",
    category: 'behavioral',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: [
      "What specifically did you change in your approach after that experience?",
      "How might that lesson show up in dental school when courses get demanding?",
    ],
  },
  {
    id: 'ethics',
    text: "Describe a situation where you faced an ethical decision or peer pressure to do something you knew was not right. What did you do?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['ethics'],
    followUpTemplates: [
      "Looking back, is there anything you would handle differently — or that reinforced why integrity matters in healthcare?",
    ],
  },
  {
    id: 'conflict',
    text: "Tell me about a time you had a conflict with a coworker or teammate. How did you navigate it?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['teamwork', 'communication'],
    followUpTemplates: ["What communication approach worked best in that moment?"],
  },
  {
    id: 'teamwork',
    text: "Describe a team project where coordination mattered. What was your role, and how did the group succeed — or struggle?",
    category: 'behavioral',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['teamwork', 'leadership'],
    followUpTemplates: ["How did you handle deadlines or unclear roles if they came up?"],
  },
  {
    id: 'leadership',
    text: "Can you share an example of leadership — formal or informal — and what you learned from leading others?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['leadership'],
    followUpTemplates: ["How did you motivate people when interest or energy dipped?"],
  },
  {
    id: 'failure',
    text: "Tell me about a time you did not achieve a goal you cared about. How did you process that, and what kept you going?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: [
      "How do you balance caring about results with staying grounded in the process?",
    ],
  },
  {
    id: 'academic-growth',
    text: "Academic paths are not always linear. Can you talk about a time you had to adjust your study approach or recover from a tough course?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: ["What study habits or support systems made the difference afterward?"],
  },
  {
    id: 'communication-growth',
    text: "How have you worked to grow as a communicator — especially explaining complex ideas clearly?",
    category: 'behavioral',
    modes: ['full', 'behavioral', 'motivation'],
    storyHints: ['communication', 'shadowing'],
    followUpTemplates: [
      "Have you watched clinicians explain procedures to nervous patients? What did you take from that?",
    ],
  },
  {
    id: 'mmi-anxious',
    text: "Imagine a patient arrives very anxious about a procedure and says they almost cancelled. How would you approach that conversation as a student or future dentist?",
    category: 'mmi',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['communication', 'shadowing'],
    followUpTemplates: ["What would you avoid saying in that moment?"],
  },
  {
    id: 'mmi-teammate',
    text: "In clinic, a classmate repeatedly leaves documentation incomplete, which slows the team. How would you handle this?",
    category: 'mmi',
    modes: ['full', 'behavioral'],
    storyHints: ['teamwork', 'ethics'],
    followUpTemplates: ["If a direct conversation did not help, what would your next step be?"],
  },
  {
    id: 'mmi-limited',
    text: "A patient needs treatment but has limited options due to cost or health constraints. How would you think through supporting them with empathy?",
    category: 'mmi',
    modes: ['full', 'motivation'],
    storyHints: ['service', 'shadowing'],
    followUpTemplates: ["Have you observed a clinician navigate a similar situation?"],
  },
  {
    id: 'mmi-feedback',
    text: "You receive critical feedback from a faculty member on a clinical skill. Walk me through how you would respond in the moment and afterward.",
    category: 'mmi',
    modes: ['full', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: ["How do you usually turn feedback into a concrete practice plan?"],
  },
  {
    id: 'hands-on',
    text: "Dentistry rewards fine motor skill and patience. What experiences outside of academics have prepared you for that kind of work?",
    category: 'clinical',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry'],
    followUpTemplates: [
      "How do those experiences translate to the precision and focus dentistry needs?",
    ],
  },
  {
    id: 'shadowing-tech',
    text: "Technology is changing dentistry quickly — imaging, digital restorations, implants. What have you seen that excited you, and why?",
    category: 'clinical',
    modes: ['full', 'motivation'],
    storyHints: ['shadowing'],
    followUpTemplates: [
      "How do you balance embracing new tools with keeping the patient at the center?",
    ],
  },
  {
    id: 'questions-for-us',
    text: "We are nearly at the end. What questions do you have for a dental school admissions committee — or what else should we know about you?",
    category: 'closing',
    modes: ['full', 'quick', 'behavioral', 'motivation'],
    followUpTemplates: [],
  },
  {
    id: 'anything-else',
    text: "Is there a story or experience we have not covered that you especially want the committee to hear?",
    category: 'closing',
    modes: ['full', 'motivation'],
    followUpTemplates: [],
  },
  {
    id: 'tell-us-about-yourself',
    text: "Thank you for being here. To begin, could you tell us a little about yourself — the path that brought you to this interview today?",
    category: 'motivation',
    modes: ['full', 'quick', 'motivation'],
    storyHints: ['why-dentistry', 'leadership', 'service'],
    followUpTemplates: [
      "What part of that journey feels most important for a dental school to understand?",
    ],
  },
  {
    id: 'why-vcu',
    text: "Why VCU School of Dentistry in particular? What about our community, curriculum, or clinical training draws you here?",
    category: 'school',
    modes: ['full', 'motivation'],
    storyHints: ['school-fit'],
    followUpTemplates: [
      "Is there a specific aspect of VCU — service, research, clinical exposure, or culture — that feels like the strongest fit for you?",
    ],
  },
  {
    id: 'why-not-medicine',
    text: "Some applicants consider medicine as well as dentistry. What led you toward dentistry rather than medicine or another health profession?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry', 'shadowing'],
    followUpTemplates: [
      "Was there a moment in shadowing or patient care that made that distinction feel clear?",
    ],
  },
  {
    id: 'five-qualities',
    text: "In your view, what are five qualities of a good dentist — and which of those do you already practice today?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['communication', 'ethics', 'why-dentistry'],
    followUpTemplates: [
      "Can you share a concrete example of one of those qualities showing up in your own experience?",
    ],
  },
  {
    id: 'biggest-strength',
    text: "What do you see as your biggest strength, and how would it help you succeed as a dental student and clinician?",
    category: 'motivation',
    modes: ['full', 'quick', 'motivation'],
    storyHints: ['leadership', 'communication', 'challenge'],
    followUpTemplates: [
      "Tell me about a time that strength was tested.",
    ],
  },
  {
    id: 'biggest-weakness',
    text: "What would you say is your biggest weakness or area for growth, and how are you working on it?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: [
      "How will you continue that growth once dental school becomes especially demanding?",
    ],
  },
  {
    id: 'stand-out',
    text: "Dental school applicants are often highly accomplished. What makes you stand out from other applicants?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['leadership', 'service', 'why-dentistry'],
    followUpTemplates: [
      "How would that distinctive quality show up day to day in clinic or with classmates?",
    ],
  },
  {
    id: 'ten-years',
    text: "Where do you see yourself in ten years — as a clinician, a colleague, and a member of your community?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry', 'service', 'school-fit'],
    followUpTemplates: [
      "How does dental school fit into that longer arc?",
    ],
  },
  {
    id: 'plan-to-specialize',
    text: "Do you plan to specialize after dental school, or are you more drawn to general practice right now — and why?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry', 'shadowing'],
    followUpTemplates: [
      "What experiences so far have shaped that preference?",
    ],
  },
  {
    id: 'where-else-applied',
    text: "Where else have you applied, and how are you thinking about where VCU fits among your choices?",
    category: 'school',
    modes: ['full', 'motivation'],
    storyHints: ['school-fit'],
    followUpTemplates: [
      "What would make VCU feel like the right place for you if you had multiple options?",
    ],
  },
  {
    id: 'classmate-cheating',
    text: "What would you do if you discovered a fellow student was cheating on an exam or clinical requirement?",
    category: 'mmi',
    modes: ['full', 'behavioral'],
    storyHints: ['ethics'],
    followUpTemplates: [
      "How would you balance loyalty to a peer with responsibility to patients and the profession?",
    ],
  },
  {
    id: 'why-biology',
    text: "What led you to major in biology, and how has that coursework prepared you for dentistry?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry', 'challenge'],
    followUpTemplates: [
      "Was there a particular course or lab experience that connected science to patient care for you?",
    ],
  },
  {
    id: 'biggest-challenge-dentistry',
    text: "What do you see as the biggest challenge facing dentistry today, and how do you hope to contribute as a future dentist?",
    category: 'motivation',
    modes: ['full', 'motivation'],
    storyHints: ['service', 'why-dentistry'],
    followUpTemplates: [
      "How have your experiences so far shaped that view of the profession's challenges?",
    ],
  },
  {
    id: 'team-problem-solve',
    text: "Tell me about a time you had to work as a team to solve a problem. What was your role, and what was the outcome?",
    category: 'behavioral',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['teamwork', 'leadership'],
    followUpTemplates: [
      "What did you personally do when the group got stuck?",
    ],
  },
  {
    id: 'handle-stress',
    text: "Dental school and clinical practice can be stressful. How do you handle stress, and what helps you stay effective under pressure?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: [
      "Can you share a specific high-pressure situation and how you got through it?",
    ],
  },
  {
    id: 'manual-dexterity',
    text: "How have you practiced or developed manual dexterity in ways that prepare you for dentistry?",
    category: 'clinical',
    modes: ['full', 'motivation'],
    storyHints: ['why-dentistry'],
    followUpTemplates: [
      "How do those activities translate to the fine motor skill and patience clinical dentistry asks for?",
    ],
  },
  {
    id: 'ethical-dilemma',
    text: "Talk about a time you faced an ethical dilemma. What was at stake, and how did you decide what to do?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['ethics'],
    followUpTemplates: [
      "Looking back, what did that experience teach you about integrity in healthcare?",
    ],
  },
  {
    id: 'deal-with-conflict',
    text: "Talk about a time you had to deal with conflict — with a peer, supervisor, or teammate. How did you handle it?",
    category: 'behavioral',
    modes: ['full', 'quick', 'behavioral'],
    storyHints: ['teamwork', 'communication'],
    followUpTemplates: [
      "What would you do differently if a similar conflict arose in clinic?",
    ],
  },
  {
    id: 'dat-retake-improvement',
    text: "If you retook the DAT, what did you change the second time to improve your score — and what did that process teach you?",
    category: 'behavioral',
    modes: ['full', 'behavioral'],
    storyHints: ['challenge'],
    followUpTemplates: [
      "How might that approach to feedback and improvement show up in dental school?",
    ],
  },
];

const MODE_TARGETS: Record<InterviewMode, { min: number; max: number }> = {
  full: { min: 8, max: 12 },
  quick: { min: 3, max: 4 },
  behavioral: { min: 6, max: 8 },
  motivation: { min: 5, max: 7 },
};

export function getModeTarget(mode: InterviewMode) {
  return MODE_TARGETS[mode];
}

export function selectQuestions(mode: InterviewMode): BankQuestion[] {
  const pool = QUESTION_BANK.filter((q) => q.modes.includes(mode));
  const { max } = MODE_TARGETS[mode];
  const byCat = (cats: QuestionCategory[]) => pool.filter((q) => cats.includes(q.category));

  let ordered: BankQuestion[] = [];
  if (mode === 'quick') {
    ordered = [
      ...byCat(['motivation']).slice(0, 1),
      ...byCat(['behavioral']).slice(0, 1),
      ...byCat(['mmi']).slice(0, 1),
      ...byCat(['closing']).slice(0, 1),
    ];
  } else if (mode === 'behavioral') {
    ordered = [...byCat(['behavioral']), ...byCat(['mmi']).slice(0, 2), ...byCat(['closing']).slice(0, 1)];
  } else if (mode === 'motivation') {
    ordered = [...byCat(['motivation', 'school', 'clinical']), ...byCat(['closing']).slice(0, 1)];
  } else {
    const motivation = byCat(['motivation']).slice(0, 2);
    const behavioral = [...byCat(['behavioral']).slice(0, 3), ...byCat(['mmi']).slice(0, 2)];
    const clinical = byCat(['clinical', 'school']).slice(0, 2);
    const closing = byCat(['closing']).slice(0, 1);
    ordered = [...motivation, ...behavioral, ...clinical, ...closing];
  }

  const seen = new Set<string>();
  const out: BankQuestion[] = [];
  for (const q of ordered) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    out.push(q);
    if (out.length >= max) break;
  }
  for (const q of pool) {
    if (out.length >= max) break;
    if (seen.has(q.id)) continue;
    seen.add(q.id);
    out.push(q);
  }
  return out;
}

export const pickQuestions = selectQuestions;
