import type { SessionFeedback } from '../lib/feedback';

interface Props {
  feedback: SessionFeedback;
  onSpeakSummary: () => void;
  onRestart: () => void;
  speaking?: boolean;
}

export function FeedbackView({ feedback, onSpeakSummary, onRestart, speaking }: Props) {
  return (
    <div className="feedback">
      <header>
        <p className="eyebrow">End-of-session feedback</p>
        <h2>How it went</h2>
        <p className="overall">{feedback.overallImpression}</p>
        <div className="feedback-actions">
          <button type="button" className="btn secondary" onClick={onSpeakSummary} disabled={speaking}>
            {speaking ? 'Speaking…' : 'Hear short summary'}
          </button>
          <button type="button" className="btn primary" onClick={onRestart}>
            Practice again
          </button>
        </div>
      </header>

      <section>
        <h3>Strengths</h3>
        <ul>
          {feedback.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Areas to improve</h3>
        <ul>
          {feedback.improveAreas.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Themes in your answers</h3>
        <p>{feedback.contentVsStoryBank}</p>
      </section>

      {feedback.answerNotes.length > 0 && (
        <section>
          <h3>Answer-by-answer notes</h3>
          <ul className="answer-notes">
            {feedback.answerNotes.map((n, i) => (
              <li key={i}>
                <strong className="note-q">{n.question}</strong>
                <span className="note-body">{n.note}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <h3>Delivery tips</h3>
        <ul>
          {feedback.deliveryTips.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Practice tips</h3>
        <ul>
          {feedback.practiceTips.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      <p className="metrics">
        Answers: {feedback.metrics.answerCount} · Avg words:{' '}
        {feedback.metrics.avgWords} · Short answers: {feedback.metrics.shortAnswers}
        {feedback.metrics.textAnswers > 0 || feedback.metrics.voiceAnswers > 0
          ? ` · Typed: ${feedback.metrics.textAnswers} · Spoken: ${feedback.metrics.voiceAnswers}`
          : ''}
      </p>
    </div>
  );
}
