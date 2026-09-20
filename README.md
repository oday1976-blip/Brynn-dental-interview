# Brynn O’Day — Dental School Mock Interview

Voice-first mock interview practice for Brynn O’Day’s dental school admissions prep.

- **Browser TTS** (`speechSynthesis`) speaks interviewer questions
- **Web Speech API** (`SpeechRecognition`) captures spoken answers
- Large **tap-to-talk** mic — typing optional only as fallback
- Modes: **Full mock**, **Quick** (3–4 Qs), **Behavioral**, **Motivation**
- End-of-session written feedback (heuristic; optional smarter API)
- Grounded in Brynn’s story bank — the app does **not** invent facts she didn’t share

## Quick start

```bash
cd brynn-dental-interview
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

Production build:

```bash
npm run build
npm run preview
```

## Browser & microphone

| Need | Recommendation |
|------|----------------|
| Speech recognition | **Chrome** or **Edge** (Chromium). Safari/Firefox support is limited or missing. |
| Microphone | Allow mic permission for the site when prompted. HTTPS or `localhost` required. |
| TTS | Works in most modern browsers via `speechSynthesis`. |

If recognition fails, use **Optional text fallback** on the interview screen.

## How a session works

1. Pick a mode on the home screen.
2. The interviewer speaks a question (and shows it on screen).
3. **Tap the mic** to answer; **tap again** to send.
4. Rule-based (or API) follow-ups may dig into specifics once per question.
5. **End session** anytime, or finish the planned questions.
6. Read feedback: overall impression, strengths, improve areas, story-bank fit, delivery + practice tips. Optionally **Hear short summary**.

## Optional OpenAI-compatible API

Works **without any API key** using a curated question bank, rule-based follow-ups, and heuristic feedback.

To enable smarter turns/feedback:

1. Open **Settings (optional API key)** on the home screen.
2. Paste an API key (OpenAI or compatible).
3. Optionally set Base URL and Model (defaults: `https://api.openai.com/v1`, `gpt-4o-mini`).

You can also set env vars at build time:

```bash
VITE_OPENAI_API_KEY=sk-...
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-4o-mini
```

Keys entered in Settings are stored in `localStorage` on this device only.

## Grounding / privacy

Context lives in `src/data/brynnContext.ts` (from `brynn-context.md`). Follow-ups and feedback are instructed never to invent experiences outside that bank or what Brynn says in-session.

Speech stays in the browser unless you enable an API key (then answer text is sent to that API for follow-ups/feedback).

## Project scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Serve the production build |
| `npm run lint` | Oxlint |

## Stack

Vite + React + TypeScript. No backend required for the default (offline-of-keys) mode.
