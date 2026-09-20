import { useCallback, useEffect, useRef, useState } from 'react';

export type SpeechPhase = 'idle' | 'speaking' | 'listening';

function getRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function speechRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export function useSpeech() {
  const [phase, setPhase] = useState<SpeechPhase>('idle');
  const [interim, setInterim] = useState('');
  const [finalText, setFinalText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speakingRef = useRef(false);
  const listenIntentRef = useRef(false);
  const finalAccumRef = useRef('');
  const interimRef = useRef('');

  useEffect(() => {
    setSupported(speechRecognitionSupported());
    return () => {
      try {
        recognitionRef.current?.abort();
      } catch {
        /* ignore */
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    speakingRef.current = false;
    setPhase((p) => (p === 'speaking' ? 'idle' : p));
  }, []);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.lang = 'en-US';

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => /Google US English|Samantha|Karen|Female|Natural/i.test(v.name)) ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utter.voice = preferred;

      speakingRef.current = true;
      setPhase('speaking');
      setError(null);

      utter.onend = () => {
        speakingRef.current = false;
        setPhase('idle');
        resolve();
      };
      utter.onerror = () => {
        speakingRef.current = false;
        setPhase('idle');
        resolve();
      };

      setTimeout(() => window.speechSynthesis.speak(utter), 50);
    });
  }, []);

  const stopListening = useCallback(() => {
    listenIntentRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    setPhase((p) => (p === 'listening' ? 'idle' : p));
  }, []);

  const startListening = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      setError(
        'Speech recognition is not supported in this browser. Use Chrome or Edge, or the text fallback.'
      );
      return;
    }

    try {
      recognitionRef.current?.abort();
    } catch {
      /* ignore */
    }

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    finalAccumRef.current = '';
    interimRef.current = '';
    setFinalText('');
    setInterim('');
    setError(null);
    listenIntentRef.current = true;
    setPhase('listening');

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimBuf = '';
      let finalBuf = '';
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) {
          finalBuf = `${finalBuf} ${transcript}`.trim();
        } else {
          interimBuf += transcript;
        }
      }
      finalAccumRef.current = finalBuf;
      interimRef.current = interimBuf;
      setFinalText(finalBuf);
      setInterim(interimBuf);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Allow the mic, or use the text fallback.');
      } else {
        setError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      if (listenIntentRef.current) {
        try {
          recognition.start();
          return;
        } catch {
          listenIntentRef.current = false;
        }
      }
      setPhase('idle');
    };

    recognitionRef.current = recognition;
    try {
      recognition.start();
    } catch {
      setError('Could not start the microphone. Check permissions and try again.');
      setPhase('idle');
      listenIntentRef.current = false;
    }
  }, []);

  const finishListening = useCallback((): string => {
    listenIntentRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch {
      /* ignore */
    }
    const text = `${finalAccumRef.current} ${interimRef.current}`.trim();
    setPhase('idle');
    setInterim('');
    return text;
  }, []);

  const resetTranscript = useCallback(() => {
    finalAccumRef.current = '';
    interimRef.current = '';
    setFinalText('');
    setInterim('');
  }, []);

  return {
    phase,
    interim,
    finalText,
    error,
    supported,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    finishListening,
    resetTranscript,
    setError,
  };
}
