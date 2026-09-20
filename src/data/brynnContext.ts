/**
 * Grounding context for Brynn O'Day's dental school mock interview.
 * Never invent facts beyond what appears here.
 */

export const BRYNN_CONTEXT_MARKDOWN = `# Brynn O'Day — dental school interview context

Use this only as background so the interviewer can ask grounded follow-ups. Do not recite it back as a script. Prefer natural conversation.

## Personal statement themes
- Early curiosity about teeth (tooth fairy / wiggly teeth); pediatric dentist also named Brynn called her "mini me"
- Shadowing Dr. Simeonova: composite bonding vs veneers — treatment matched to the person; patient confidence / smile transformation
- Shadowing Dr. Wolfe: implants, 3D imaging, digital crowns; explaining scans to nervous patients builds trust
- Hands-on hobbies: bracelet knotting, violin; competitive Irish dance (discipline, resilience)
- Wants to give care like the dentist who inspired her

## Secondaries / story bank (UNC, ECU, and general)
- Why UNC: Impressions Day, community, student orgs, technology in curriculum
- Personal mission: continual growth + meaningful relationships; dentistry fits lifelong learning + patient connection
- Access to care: free clinic volunteering — demand exceeds providers; prevention/education in schools
- Ethical dilemma: calculus quiz peer pressure — left then returned to take quiz
- Clinical: periodontal disease case with Dr. Simeonova — empathy when options are limited
- Conflict: restaurant rush with cook — calm, clear communication
- Teamwork: cell/molecular bio lab project — timeline and roles fixed coordination
- Failure: Irish dance — many second places before advancing; love of craft over results
- Leadership: founded university Irish dance club; event manager on campus
- Communication growth: customer service, public speaking class, watching dentists explain procedures
- GPA/DAT: retake after first DAT; Organic Chemistry II retake helped

## Interview practice goals
- Behavioral + motivational questions typical of dental school (MMI-style and traditional)
- Follow-ups that dig into specifics without being hostile
- Warm but professional dental-school admissions interviewer persona
`;

/** Keywords/phrases from her story bank for heuristic matching */
export const STORY_BANK = [
  {
    id: 'early-curiosity',
    labels: ['tooth fairy', 'wiggly', 'mini me', 'pediatric', 'early curiosity'],
    summary: 'Early curiosity about teeth; pediatric dentist named Brynn',
  },
  {
    id: 'simeonova',
    labels: ['simeonova', 'composite', 'veneer', 'bonding', 'smile'],
    summary: 'Shadowing Dr. Simeonova — bonding vs veneers, patient confidence',
  },
  {
    id: 'wolfe',
    labels: ['wolfe', 'implant', '3d', 'imaging', 'digital crown', 'scan'],
    summary: 'Shadowing Dr. Wolfe — implants, 3D imaging, explaining scans',
  },
  {
    id: 'irish-dance',
    labels: ['irish', 'dance', 'second place', 'resilience', 'discipline'],
    summary: 'Competitive Irish dance — discipline, resilience, failure to advance',
  },
  {
    id: 'hobbies',
    labels: ['bracelet', 'knotting', 'violin', 'hands-on', 'hobby'],
    summary: 'Hands-on hobbies: bracelet knotting, violin',
  },
  {
    id: 'unc',
    labels: ['unc', 'impressions day', 'chapel hill', 'student org'],
    summary: 'Why UNC — Impressions Day, community, technology',
  },
  {
    id: 'access',
    labels: ['free clinic', 'access', 'prevention', 'underserved', 'volunteer'],
    summary: 'Access to care — free clinic volunteering',
  },
  {
    id: 'ethics-quiz',
    labels: ['calculus', 'quiz', 'peer pressure', 'ethic', 'integrity'],
    summary: 'Ethical dilemma — calculus quiz peer pressure',
  },
  {
    id: 'perio',
    labels: ['periodontal', 'perio', 'limited options', 'empathy'],
    summary: 'Periodontal disease case with Dr. Simeonova',
  },
  {
    id: 'restaurant',
    labels: ['restaurant', 'cook', 'rush', 'conflict'],
    summary: 'Restaurant conflict with cook — calm communication',
  },
  {
    id: 'lab-team',
    labels: ['lab', 'cell', 'molecular', 'teamwork', 'timeline', 'roles'],
    summary: 'Cell/molecular bio lab teamwork',
  },
  {
    id: 'leadership',
    labels: ['founded', 'irish dance club', 'event manager', 'leadership'],
    summary: 'Founded Irish dance club; event manager',
  },
  {
    id: 'communication',
    labels: ['customer service', 'public speaking', 'explain procedure'],
    summary: 'Communication growth — customer service, public speaking',
  },
  {
    id: 'dat-gpa',
    labels: ['dat', 'retake', 'organic', 'gpa', 'orgo'],
    summary: 'DAT retake; Organic Chemistry II retake',
  },
  {
    id: 'mission',
    labels: ['lifelong learning', 'relationships', 'growth', 'mission'],
    summary: 'Personal mission — growth + relationships; lifelong learning',
  },
] as const;

export const INTERVIEWER_PERSONA = `You are a warm, professional dental school admissions interviewer speaking with Brynn O'Day.
Be encouraging but substantive. Ask natural follow-ups grounded only in facts she shares or her known story bank.
Never invent experiences she did not describe. Mix traditional and MMI-style questions.
Keep questions concise (1–3 sentences). Address her as Brynn.`;
