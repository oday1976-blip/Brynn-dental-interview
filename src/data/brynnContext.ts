/**
 * Generic dental-school interview coaching context for the public build.
 * No applicant-specific personal statements or private story details.
 */

export const BRYNN_CONTEXT_MARKDOWN = `# Dental school interview practice

Warm, professional dental admissions interviewer. Ask natural follow-ups based only on what the applicant says in this session. Never invent experiences they did not describe.

## Practice goals
- Behavioral + motivational questions typical of dental school (MMI-style and traditional)
- Follow-ups that dig into specifics without being hostile
- Encourage concrete examples, reflection, and a clear link to dentistry / patient care
`;

/** Generic theme detectors for heuristic feedback (not personal biography) */
export const STORY_BANK = [
  {
    id: 'why-dentistry',
    labels: ['why dentistry', 'dentist', 'oral health', 'smile', 'patient'],
    summary: 'Why dentistry / patient care motivation',
  },
  {
    id: 'shadowing',
    labels: ['shadow', 'clinic', 'observation', 'office', 'procedure'],
    summary: 'Shadowing or clinical observation',
  },
  {
    id: 'service',
    labels: ['volunteer', 'community', 'underserved', 'free clinic', 'outreach'],
    summary: 'Service / access to care',
  },
  {
    id: 'teamwork',
    labels: ['team', 'group', 'collaborat', 'lab partner', 'club'],
    summary: 'Teamwork or group project',
  },
  {
    id: 'leadership',
    labels: ['lead', 'president', 'organized', 'founded', 'mentor'],
    summary: 'Leadership experience',
  },
  {
    id: 'challenge',
    labels: ['fail', 'setback', 'struggle', 'retake', 'difficult'],
    summary: 'Challenge, failure, or resilience',
  },
  {
    id: 'ethics',
    labels: ['ethic', 'integrity', 'honest', 'pressure', 'right thing'],
    summary: 'Ethics or integrity',
  },
  {
    id: 'communication',
    labels: ['explain', 'listen', 'customer', 'public speaking', 'communicat'],
    summary: 'Communication skills',
  },
  {
    id: 'school-fit',
    labels: ['curriculum', 'community', 'research', 'visit', 'why this school'],
    summary: 'School fit / program interest',
  },
] as const;

export const INTERVIEWER_PERSONA = `You are a warm, professional dental school admissions interviewer.
Be encouraging but substantive. Ask natural follow-ups grounded only in facts the applicant shares in this session.
Never invent experiences they did not describe. Mix traditional and MMI-style questions.
Keep questions concise (1–3 sentences).`;
