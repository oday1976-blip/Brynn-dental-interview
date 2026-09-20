import type { InterviewMode } from '../data/questionBank';

const MODES: { id: InterviewMode; title: string; blurb: string }[] = [
  {
    id: 'full',
    title: 'Full mock',
    blurb: '8–12 questions · traditional + MMI · follow-ups',
  },
  {
    id: 'quick',
    title: 'Quick',
    blurb: '3–4 questions · warm-up before the real thing',
  },
  {
    id: 'behavioral',
    title: 'Behavioral',
    blurb: 'STAR stories · conflict, teamwork, ethics, failure',
  },
  {
    id: 'motivation',
    title: 'Motivation',
    blurb: 'Why dentistry · patient care · school fit · access',
  },
];

interface Props {
  onSelect: (mode: InterviewMode) => void;
  onOpenSettings: () => void;
}

export function ModePicker({ onSelect, onOpenSettings }: Props) {
  return (
    <div className="mode-picker">
      <header className="hero">
        <p className="eyebrow">Dental school admissions practice</p>
        <h1>Dental school mock interview</h1>
        <p className="lede">
          Voice-only practice with a warm, professional interviewer. Tap the mic to answer —
          no typing required. Feedback lands at the end.
        </p>
      </header>

      <div className="mode-grid">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className="mode-card"
            onClick={() => onSelect(m.id)}
          >
            <span className="mode-title">{m.title}</span>
            <span className="mode-blurb">{m.blurb}</span>
          </button>
        ))}
      </div>

      <div className="home-actions">
        <button type="button" className="linkish" onClick={onOpenSettings}>
          Settings (optional API key)
        </button>
      </div>

      <p className="hint">
        Chrome or Edge recommended for speech recognition. Allow microphone access when prompted.
      </p>
    </div>
  );
}
