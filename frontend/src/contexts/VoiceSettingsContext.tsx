import React, { createContext, useContext, ReactNode } from 'react';
import { useMicrophonePermission, MicrophonePermissionStatus } from '../hooks/useMicrophonePermission';
import { useVoicePreferences } from '../hooks/useVoicePreferences';
import { VoicePreferences } from '../lib/voice/voicePreferences';

interface VoiceSettingsContextValue {
  // Microphone permission
  micPermissionStatus: MicrophonePermissionStatus;
  isRequestingPermission: boolean;
  isMicSupported: boolean;
  requestMicPermission: () => Promise<boolean>;
  retryMicPermission: () => Promise<boolean>;
  
  // Voice preferences
  preferences: VoicePreferences;
  setVoiceActivationEnabled: (enabled: boolean) => void;
  setSpokenRepliesEnabled: (enabled: boolean) => void;
}

const VoiceSettingsContext = createContext<VoiceSettingsContextValue | null>(null);

export function VoiceSettingsProvider({ children }: { children: ReactNode }) {
  const {
    status: micPermissionStatus,
    isRequesting: isRequestingPermission,
    isSupported: isMicSupported,
    requestPermission: requestMicPermission,
    retry: retryMicPermission,
  } = useMicrophonePermission();

  const {
    preferences,
    setVoiceActivationEnabled,
    setSpokenRepliesEnabled,
  } = useVoicePreferences();

  const value: VoiceSettingsContextValue = {
    micPermissionStatus,
    isRequestingPermission,
    isMicSupported,
    requestMicPermission,
    retryMicPermission,
    preferences,
    setVoiceActivationEnabled,
    setSpokenRepliesEnabled,
  };

  return (
    <VoiceSettingsContext.Provider value={value}>
      {children}
    </VoiceSettingsContext.Provider>
  );
}

export function useVoiceSettings() {
  const context = useContext(VoiceSettingsContext);
  if (!context) {
    throw new Error('useVoiceSettings must be used within VoiceSettingsProvider');
  }
  return context;
}
