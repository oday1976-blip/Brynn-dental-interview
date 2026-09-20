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
  onSubmitVoice: (text: string) => void;
  onSkipSpeaking: () => void;
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
  onSubmitVoice,
  onSkipSpeaking,
  onEnd,
  processing,
}: Props) {
  const [textFallback, setTextFallback] = useState('');
  const [showFallback, setShowFallback] = useState(!speechSupported);
  const [promptCount, setPromptCount] = useState(0);
  const lastSpokenRef = useRef<string>('');
  const listening = speechPhase === 'listening';
  const speaking = speechPhase === 'speaking';

  // Auto-expand text fallback when speech is unsupported or errors
  useEffect(() => {
    if (!speechSupported || speechError) {
      setShowFallback(true);
    }
  }, [speechSupported, speechError]);

  // Auto-speak new interviewer prompts
  useEffect(() => {
    const prompt = state.currentPrompt;
    if (!prompt) return;
    if (state.status !== 'asking' && state.status !== 'awaiting_answer') return;
    if (prompt === lastSpokenRef.current) return;
    lastSpokenRef.current = prompt;
    setPromptCount((c) => c + 1);
    void onSpeakPrompt(prompt);
  }, [state.currentPrompt, state.status, onSpeakPrompt]);

  // After the first prompt, keep a compact text box available for discoverability
  useEffect(() => {
    if (promptCount >= 1) {
      setShowFallback(true);
    }
  }, [promptCount]);

  const handleMicStart = useCallback(() => {
    if (speaking || processing) return;
    onStartListen();
  }, [speaking, processing, onStartListen]);

  const handleMicEnd = useCallback(() => {
    const text = onFinishListen();
    const combined = (text || finalText).trim();
    if (combined) onSubmitVoice(combined);
  }, [onFinishListen, finalText, onSubmitVoice]);

  const statusLabel = speaking
    ? 'Interviewer speaking…'
    : listening
      ? 'Listening to you…'
      : processing
        ? 'Thinking…'
        : 'Your turn — tap the mic or type below';

  const micLabel = speaking
    ? 'Wait for interviewer…'
    : listening
      ? 'Listening… tap again to send'
      : processing
        ? 'Please wait…'
        : 'Tap to talk';

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

      <div className="mic-row">
        <MicButton
          listening={listening}
          disabled={speaking || processing || !state.currentPrompt}
          waiting={speaking}
          label={micLabel}
          onPressStart={handleMicStart}
          onPressEnd={handleMicEnd}
        />
        {speaking && (
          <button type="button" className="btn secondary skip-btn" onClick={onSkipSpeaking}>
            Skip
          </button>
        )}
      </div>

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
          {showFallback ? 'Hide text answer box' : 'Type your answer instead'}
        </button>
        {showFallback && (
          <form
            className="fallback-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!textFallback.trim() || processing) return;
              if (speaking) onSkipSpeaking();
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
                  ? 'Type an answer if you prefer — or if the mic mishears…'
                  : 'Speech recognition unavailable — type your answer here.'
              }
            />
            <button
              type="submit"
              className="btn primary"
              disabled={!textFallback.trim() || processing}
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
