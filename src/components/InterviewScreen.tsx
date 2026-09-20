import { useCallback, useEffect, useRef, useState } from 'react';
import type { InterviewState } from '../hooks/useInterview';
import { MicButton } from './MicButton';
import { Transcript } from './Transcript';

interface Props {
  state: InterviewState;
  speechPhase: 'idle' | 'speaking' | 'listening';
  interim: string;
  finalText: string;
  speechError: string | null;
  speechSupported: boolean;
  onSpeakPrompt: (text: string) => Promise<void>;
  onStartListen: () => void;
  onFinishListen: () => string;
  onSubmitText: (text: string) => void;
  onEnd: () => void;
  processing: boolean;
}

export function InterviewScreen({
  state,
  speechPhase,
  interim,
  finalText,
  speechError,
  speechSupported,
  onSpeakPrompt,
  onStartListen,
  onFinishListen,
  onSubmitText,
  onEnd,
  processing,
}: Props) {
  const [textFallback, setTextFallback] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const lastSpokenRef = useRef<string>('');
  const listening = speechPhase === 'listening';
  const speaking = speechPhase === 'speaking';

  // Auto-speak new interviewer prompts
  useEffect(() => {
    const prompt = state.currentPrompt;
    if (!prompt) return;
    if (state.status !== 'asking' && state.status !== 'awaiting_answer') return;
    if (prompt === lastSpokenRef.current) return;
    lastSpokenRef.current = prompt;
    void onSpeakPrompt(prompt);
  }, [state.currentPrompt, state.status, onSpeakPrompt]);

  const handleMicStart = useCallback(() => {
    if (speaking || processing) return;
    onStartListen();
  }, [speaking, processing, onStartListen]);

  const handleMicEnd = useCallback(() => {
    const text = onFinishListen();
    const combined = (text || finalText).trim();
    if (combined) onSubmitText(combined);
  }, [onFinishListen, finalText, onSubmitText]);

  const statusLabel = speaking
    ? 'Interviewer speaking…'
    : listening
      ? 'Listening to you…'
      : processing
        ? 'Thinking…'
        : 'Your turn — tap the mic';

  return (
    <div className="interview">
      <div className="interview-top">
        <div>
          <p className="eyebrow">{state.progressLabel}</p>
          <h2 className="prompt">{state.currentPrompt || 'Wrapping up…'}</h2>
        </div>
        <button type="button" className="btn danger" onClick={onEnd}>
          End session
        </button>
      </div>

      <div className={`status-pill ${speechPhase} ${processing ? 'processing' : ''}`}>
        <span className="dot" />
        {statusLabel}
      </div>

      {speechError && <p className="error-banner">{speechError}</p>}

      <MicButton
        listening={listening}
        disabled={speaking || processing || !state.currentPrompt}
        onPressStart={handleMicStart}
        onPressEnd={handleMicEnd}
      />

      {(listening || finalText || interim) && (
        <p className="live-caption">
          {finalText} {interim && <em>{interim}</em>}
        </p>
      )}

      <div className="fallback-area">
        <button
          type="button"
          className="linkish"
          onClick={() => setShowFallback((s) => !s)}
        >
          {showFallback ? 'Hide text fallback' : 'Optional text fallback'}
        </button>
        {showFallback && (
          <form
            className="fallback-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!textFallback.trim() || speaking || processing) return;
              onSubmitText(textFallback.trim());
              setTextFallback('');
            }}
          >
            <textarea
              rows={3}
              value={textFallback}
              onChange={(e) => setTextFallback(e.target.value)}
              placeholder={
                speechSupported
                  ? 'Type an answer if the mic mishears…'
                  : 'Speech recognition unavailable — type your answer here.'
              }
            />
            <button
              type="submit"
              className="btn primary"
              disabled={!textFallback.trim() || speaking || processing}
            >
              Submit answer
            </button>
          </form>
        )}
      </div>

      <Transcript turns={state.turns} interim={listening ? interim : ''} />
    </div>
  );
}
