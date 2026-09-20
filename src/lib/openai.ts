import { BRYNN_CONTEXT_MARKDOWN, INTERVIEWER_PERSONA } from '../data/brynnContext';
import type { TranscriptTurn } from './followUps';
import type { SessionFeedback } from './feedback';
import type { InterviewMode } from '../data/questionBank';

export interface ApiSettings {
  apiKey: string;
  baseUrl: string;
  model: string;
}

const DEFAULT_BASE = 'https://api.openai.com/v1';
const DEFAULT_MODEL = 'gpt-4o-mini';

export function loadApiSettings(): ApiSettings {
  try {
    const raw = localStorage.getItem('brynn-interview-api');
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ApiSettings>;
      return {
        apiKey: parsed.apiKey || '',
        baseUrl: parsed.baseUrl || DEFAULT_BASE,
        model: parsed.model || DEFAULT_MODEL,
      };
    }
  } catch {
    /* ignore */
  }
  return {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    baseUrl: import.meta.env.VITE_OPENAI_BASE_URL || DEFAULT_BASE,
    model: import.meta.env.VITE_OPENAI_MODEL || DEFAULT_MODEL,
  };
}

export function saveApiSettings(settings: ApiSettings): void {
  localStorage.setItem('brynn-interview-api', JSON.stringify(settings));
}

async function chatCompletion(
  settings: ApiSettings,
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  temperature = 0.6
): Promise<string> {
  const url = `${settings.baseUrl.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model,
      temperature,
      messages,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${errText.slice(0, 200)}`);
  }
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return data.choices?.[0]?.message?.content?.trim() || '';
}

export async function generateAiFollowUp(
  settings: ApiSettings,
  question: string,
  answer: string,
  prior: TranscriptTurn[]
): Promise<string | null> {
  const recent = prior
    .slice(-6)
    .map((t) => `${t.role === 'interviewer' ? 'Interviewer' : 'Brynn'}: ${t.text}`)
    .join('\n');

  const content = await chatCompletion(settings, [
    {
      role: 'system',
      content: `${INTERVIEWER_PERSONA}

CONTEXT (facts only — never invent beyond this or what Brynn just said):
${BRYNN_CONTEXT_MARKDOWN}

If a follow-up is useful, reply with ONLY the follow-up question (one or two sentences).
If no follow-up is needed, reply with exactly: NONE`,
    },
    {
      role: 'user',
      content: `Recent transcript:
${recent}

Current question: ${question}
Brynn's answer: ${answer}

Follow-up or NONE:`,
    },
  ]);

  if (!content || /^none\b/i.test(content)) return null;
  return content.replace(/^["']|["']$/g, '').trim();
}

export async function generateAiFeedback(
  settings: ApiSettings,
  turns: TranscriptTurn[],
  mode: InterviewMode,
  heuristic: SessionFeedback
): Promise<SessionFeedback> {
  const transcript = turns
    .map((t) => `${t.role === 'interviewer' ? 'Interviewer' : 'Brynn'}: ${t.text}`)
    .join('\n');

  const content = await chatCompletion(
    settings,
    [
      {
        role: 'system',
        content: `You are a supportive dental admissions coach giving written feedback to Brynn O'Day after a mock interview.
Use ONLY the transcript and this context — never invent experiences she did not mention:
${BRYNN_CONTEXT_MARKDOWN}

Respond with valid JSON only, matching this shape:
{
  "overallImpression": string,
  "strengths": string[],
  "improveAreas": string[],
  "contentVsStoryBank": string,
  "deliveryTips": string[],
  "practiceTips": string[],
  "ttsSummary": string
}
practiceTips should have 3-5 items. ttsSummary should be 2-3 short spoken sentences.`,
      },
      {
        role: 'user',
        content: `Mode: ${mode}

Transcript:
${transcript}

Heuristic notes (you may refine, do not contradict clear transcript facts):
${JSON.stringify({
  strengths: heuristic.strengths,
  improveAreas: heuristic.improveAreas,
  storiesHit: heuristic.storiesHit,
  metrics: heuristic.metrics,
})}`,
      },
    ],
    0.5
  );

  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('no json');
    const parsed = JSON.parse(jsonMatch[0]) as Partial<SessionFeedback>;
    return {
      ...heuristic,
      overallImpression: parsed.overallImpression || heuristic.overallImpression,
      strengths: parsed.strengths?.length ? parsed.strengths : heuristic.strengths,
      improveAreas: parsed.improveAreas?.length ? parsed.improveAreas : heuristic.improveAreas,
      contentVsStoryBank: parsed.contentVsStoryBank || heuristic.contentVsStoryBank,
      deliveryTips: parsed.deliveryTips?.length ? parsed.deliveryTips : heuristic.deliveryTips,
      practiceTips: parsed.practiceTips?.length ? parsed.practiceTips : heuristic.practiceTips,
      ttsSummary: parsed.ttsSummary || heuristic.ttsSummary,
    };
  } catch {
    return heuristic;
  }
}
