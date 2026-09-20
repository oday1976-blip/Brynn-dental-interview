import { useCallback, useRef, useState } from 'react';
import {
  selectQuestions,
  getModeTarget,
  type BankQuestion,
  type InterviewMode,
} from '../data/questionBank';
import { chooseFollowUp, type TranscriptTurn } from '../lib/followUps';
import { generateHeuristicFeedback, type SessionFeedback } from '../lib/feedback';
import {
  generateAiFeedback,
  generateAiFollowUp,
  loadApiSettings,
} from '../lib/openai';

export type InterviewStatus =
  | 'idle'
  | 'intro'
  | 'asking'
  | 'awaiting_answer'
  | 'processing'
  | 'feedback'
  | 'ended';

export interface InterviewState {
  status: InterviewStatus;
  mode: InterviewMode | null;
  questions: BankQuestion[];
  questionIndex: number;
  currentPrompt: string;
  isFollowUp: boolean;
  followedUpForCurrent: boolean;
  turns: TranscriptTurn[];
  feedback: SessionFeedback | null;
  progressLabel: string;
}

const initial: InterviewState = {
  status: 'idle',
  mode: null,
  questions: [],
  questionIndex: 0,
  currentPrompt: '',
  isFollowUp: false,
  followedUpForCurrent: false,
  turns: [],
  feedback: null,
  progressLabel: '',
};

function progressLabel(index: number, total: number, isFollowUp: boolean): string {
  if (isFollowUp) return `Follow-up · Question ${index + 1} of ${total}`;
  return `Question ${index + 1} of ${total}`;
}

export function useInterview() {
  const [state, setState] = useState<InterviewState>(initial);
  const stateRef = useRef(state);
  stateRef.current = state;

  const start = useCallback((mode: InterviewMode) => {
    const questions = selectQuestions(mode);
    const first = questions[0];
    const prompt = first?.text ?? 'Thank you for your time today.';
    setState({
      status: 'asking',
      mode,
      questions,
      questionIndex: 0,
      currentPrompt: prompt,
      isFollowUp: false,
      followedUpForCurrent: false,
      turns: [{ role: 'interviewer', text: prompt, questionId: first?.id }],
      feedback: null,
      progressLabel: progressLabel(0, questions.length, false),
    });
  }, []);

  const submitAnswer = useCallback(
    async (
      answerText: string,
      inputMode: 'voice' | 'text' = 'voice'
    ): Promise<string | null> => {
    const trimmed = answerText.trim();
    if (!trimmed) return null;

    const s = stateRef.current;
    if (s.status !== 'asking' && s.status !== 'awaiting_answer' && s.status !== 'processing') {
      // allow from awaiting
    }

    const answerTurn = { role: 'brynn' as const, text: trimmed, inputMode };

    setState((prev) => ({
      ...prev,
      status: 'processing',
      turns: [...prev.turns, answerTurn],
    }));

    const currentQ = s.questions[s.questionIndex];
    const api = loadApiSettings();
    let followUp: string | null = null;

    if (!s.followedUpForCurrent && currentQ) {
      if (api.apiKey) {
        try {
          followUp = await generateAiFollowUp(
            api,
            s.currentPrompt,
            trimmed,
            [...s.turns, answerTurn]
          );
        } catch {
          followUp = chooseFollowUp(currentQ, trimmed, s.followedUpForCurrent);
        }
      } else {
        followUp = chooseFollowUp(currentQ, trimmed, s.followedUpForCurrent);
      }
    }

    if (followUp) {
      setState((prev) => ({
        ...prev,
        status: 'asking',
        currentPrompt: followUp!,
        isFollowUp: true,
        followedUpForCurrent: true,
        turns: [
          ...prev.turns,
          { role: 'interviewer', text: followUp!, questionId: currentQ?.id, isFollowUp: true },
        ],
        progressLabel: progressLabel(prev.questionIndex, prev.questions.length, true),
      }));
      return followUp;
    }

    // Advance to next main question
    const nextIndex = s.questionIndex + 1;
    if (nextIndex >= s.questions.length) {
      // Will finalize externally via endSession — mark ready for feedback
      setState((prev) => ({
        ...prev,
        status: 'ended',
        currentPrompt: '',
        isFollowUp: false,
        progressLabel: 'Session complete',
      }));
      return null;
    }

    const nextQ = s.questions[nextIndex];
    const nextPrompt = nextQ.text;
    setState((prev) => ({
      ...prev,
      status: 'asking',
      questionIndex: nextIndex,
      currentPrompt: nextPrompt,
      isFollowUp: false,
      followedUpForCurrent: false,
      turns: [
        ...prev.turns,
        { role: 'interviewer', text: nextPrompt, questionId: nextQ.id },
      ],
      progressLabel: progressLabel(nextIndex, prev.questions.length, false),
    }));
    return nextPrompt;
  }, []);

  const endSession = useCallback(async (): Promise<SessionFeedback> => {
    const s = stateRef.current;
    const mode = s.mode ?? 'full';
    let feedback = generateHeuristicFeedback(s.turns, mode);
    const api = loadApiSettings();
    if (api.apiKey && s.turns.some((t) => t.role === 'brynn')) {
      try {
        feedback = await generateAiFeedback(api, s.turns, mode, feedback);
      } catch {
        /* keep heuristic */
      }
    }
    setState((prev) => ({
      ...prev,
      status: 'feedback',
      feedback,
      currentPrompt: '',
      progressLabel: 'Feedback',
    }));
    return feedback;
  }, []);

  const reset = useCallback(() => {
    setState(initial);
  }, []);

  const markAwaiting = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'awaiting_answer' }));
  }, []);

  return {
    state,
    start,
    submitAnswer,
    endSession,
    reset,
    markAwaiting,
    getModeTarget,
  };
}
