const VOICE_PREFERENCES_KEY = 'anc_voice_preferences';
const PREFERENCES_VERSION = 1;

export interface VoicePreferences {
  voiceActivationEnabled: boolean;
  spokenRepliesEnabled: boolean;
  version: number;
}

const DEFAULT_PREFERENCES: VoicePreferences = {
  voiceActivationEnabled: false,
  spokenRepliesEnabled: false,
  version: PREFERENCES_VERSION,
};

export function getVoicePreferences(): VoicePreferences {
  try {
    const stored = localStorage.getItem(VOICE_PREFERENCES_KEY);
    if (!stored) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(stored) as VoicePreferences;
    
    // Check version and migrate if needed
    if (parsed.version !== PREFERENCES_VERSION) {
      return DEFAULT_PREFERENCES;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to load voice preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

export function setVoicePreferences(preferences: Partial<VoicePreferences>): void {
  try {
    const current = getVoicePreferences();
    const updated = {
      ...current,
      ...preferences,
      version: PREFERENCES_VERSION,
    };
    localStorage.setItem(VOICE_PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save voice preferences:', error);
  }
}

export function setVoiceActivationEnabled(enabled: boolean): void {
  setVoicePreferences({ voiceActivationEnabled: enabled });
}

export function setSpokenRepliesEnabled(enabled: boolean): void {
  setVoicePreferences({ spokenRepliesEnabled: enabled });
}
