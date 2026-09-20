interface Props {
  listening: boolean;
  disabled?: boolean;
  waiting?: boolean;
  onPressStart: () => void;
  onPressEnd: () => void;
  label?: string;
}

/** Large tap-to-talk control — tap once to start, tap again to send. */
export function MicButton({
  listening,
  disabled,
  waiting,
  onPressStart,
  onPressEnd,
  label,
}: Props) {
  const classes = [
    'mic-btn',
    listening ? 'listening' : '',
    waiting || (disabled && !listening) ? 'waiting' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`mic-wrap ${waiting ? 'mic-wrap-waiting' : ''}`}>
      <button
        type="button"
        className={classes}
        disabled={disabled}
        aria-pressed={listening}
        aria-label={
          waiting
            ? 'Wait for interviewer'
            : listening
              ? 'Stop listening and send answer'
              : 'Tap to talk'
        }
        onClick={() => {
          if (disabled) return;
          if (listening) onPressEnd();
          else onPressStart();
        }}
      >
        <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"
          />
        </svg>
      </button>
      <p className="mic-label">
        {label ?? (listening ? 'Listening… tap again to send' : 'Tap to talk')}
      </p>
    </div>
  );
}
