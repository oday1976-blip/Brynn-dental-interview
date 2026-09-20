import { useState } from 'react';
import { loadApiSettings, saveApiSettings, type ApiSettings } from '../lib/openai';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: Props) {
  const [settings, setSettings] = useState<ApiSettings>(() => loadApiSettings());
  const [saved, setSaved] = useState(false);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Settings">
      <div className="modal">
        <h2>Settings</h2>
        <p className="muted">
          The app works fully offline of API keys using a curated question bank and heuristic
          feedback. Optionally add an OpenAI-compatible key for smarter follow-ups and feedback.
        </p>
        <label>
          API key
          <input
            type="password"
            autoComplete="off"
            value={settings.apiKey}
            onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
            placeholder="sk-…"
          />
        </label>
        <label>
          Base URL
          <input
            type="url"
            value={settings.baseUrl}
            onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
            placeholder="https://api.openai.com/v1"
          />
        </label>
        <label>
          Model
          <input
            type="text"
            value={settings.model}
            onChange={(e) => setSettings({ ...settings, model: e.target.value })}
            placeholder="gpt-4o-mini"
          />
        </label>
        <div className="modal-actions">
          <button
            type="button"
            className="btn primary"
            onClick={() => {
              saveApiSettings(settings);
              setSaved(true);
              setTimeout(() => setSaved(false), 1500);
            }}
          >
            {saved ? 'Saved' : 'Save'}
          </button>
          <button type="button" className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
