import { useState, useCallback, useEffect } from 'react';
import { getVoicePreferences, setVoicePreferences, VoicePreferences } from '../lib/voice/voicePreferences';

export function useVoicePreferences() {
  const [preferences, setPreferencesState] = useState<VoicePreferences>(getVoicePreferences());

  // Sync with localStorage on mount
  useEffect(() => {
    setPreferencesState(getVoicePreferences());
  }, []);

  const updatePreferences = useCallback((updates: Partial<VoicePreferences>) => {
    setVoicePreferences(updates);
    setPreferencesState(getVoicePreferences());
  }, []);

  const setVoiceActivationEnabled = useCallback((enabled: boolean) => {
    updatePreferences({ voiceActivationEnabled: enabled });
  }, [updatePreferences]);

  const setSpokenRepliesEnabled = useCallback((enabled: boolean) => {
    updatePreferences({ spokenRepliesEnabled: enabled });
  }, [updatePreferences]);

  return {
    preferences,
    setVoiceActivationEnabled,
    setSpokenRepliesEnabled,
    updatePreferences,
  };
}
