import { useState } from 'react';
import type { TranscriptTurn } from '../lib/followUps';

interface Props {
  turns: TranscriptTurn[];
  interim?: string;
}

export function Transcript({ turns, interim }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="transcript">
      <button
        type="button"
        className="transcript-toggle"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {open ? 'Hide transcript' : 'Show transcript'}
        <span className="count">{turns.length}</span>
      </button>
      {open && (
        <ol className="transcript-list">
          {turns.map((t, i) => (
            <li key={i} className={`turn turn-${t.role}`}>
              <span className="who">{t.role === 'interviewer' ? 'Interviewer' : 'Brynn'}</span>
              <p>{t.text}</p>
            </li>
          ))}
          {interim ? (
            <li className="turn turn-brynn interim">
              <span className="who">Brynn (live)</span>
              <p>{interim}</p>
            </li>
          ) : null}
        </ol>
      )}
    </div>
  );
}
