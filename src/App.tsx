import { useCallback, useEffect, useRef, useState } from 'react';
import { ModePicker } from './components/ModePicker';
import { InterviewScreen } from './components/InterviewScreen';
import { FeedbackView } from './components/FeedbackView';
import { SettingsModal } from './components/SettingsModal';
import { useInterview } from './hooks/useInterview';
import { useSpeech } from './hooks/useSpeech';
import type { InterviewMode } from './data/questionBank';
import './App.css';

export default function App() {
  const interview = useInterview();
  const speech = useSpeech();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const endingRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.getVoices();
    const onVoices = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener('voiceschanged', onVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
  }, []);

  const runEndSession = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    speech.stopSpeaking();
    speech.stopListening();
    setProcessing(true);
    try {
      await interview.endSession();
    } finally {
      setProcessing(false);
      endingRef.current = false;
    }
  }, [interview, speech]);

  // When questions run out, auto-generate feedback
  useEffect(() => {
    if (interview.state.status !== 'ended') return;
    void runEndSession();
  }, [interview.state.status, runEndSession]);

  const handleSelectMode = useCallback(
    (mode: InterviewMode) => {
      endingRef.current = false;
      speech.stopSpeaking();
      speech.resetTranscript();
      interview.start(mode);
    },
    [interview, speech]
  );

  const handleSpeakPrompt = useCallback(
    async (text: string) => {
      speech.stopListening();
      await speech.speak(text);
      interview.markAwaiting();
    },
    [speech, interview]
  );

  const handleSubmit = useCallback(
    async (text: string) => {
      if (!text.trim() || processing) return;
      setProcessing(true);
      speech.resetTranscript();
      try {
        await interview.submitAnswer(text);
      } finally {
        setProcessing(false);
      }
    },
    [interview, speech, processing]
  );

  const handleRestart = useCallback(() => {
    endingRef.current = false;
    speech.stopSpeaking();
    speech.resetTranscript();
    interview.reset();
  }, [interview, speech]);

  const { state } = interview;
  const inInterview =
    state.status === 'asking' ||
    state.status === 'awaiting_answer' ||
    state.status === 'processing';

  return (
    <div className="app-shell">
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />

      {state.status === 'idle' && (
        <ModePicker
          onSelect={handleSelectMode}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      {inInterview && (
        <InterviewScreen
          state={state}
          speechPhase={speech.phase}
          interim={speech.interim}
          finalText={speech.finalText}
          speechError={speech.error}
          speechSupported={speech.supported}
          onSpeakPrompt={handleSpeakPrompt}
          onStartListen={() => {
            speech.resetTranscript();
            speech.startListening();
          }}
          onFinishListen={() => speech.finishListening()}
          onSubmitText={(t) => void handleSubmit(t)}
          onEnd={() => void runEndSession()}
          processing={processing || state.status === 'processing'}
        />
      )}

      {state.status === 'ended' && (
        <div className="wrapping">
          <div className="status-pill processing">
            <span className="dot" />
            Generating feedback…
          </div>
        </div>
      )}

      {state.status === 'feedback' && state.feedback && (
        <FeedbackView
          feedback={state.feedback}
          speaking={speech.phase === 'speaking'}
          onSpeakSummary={() => void speech.speak(state.feedback!.ttsSummary)}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
