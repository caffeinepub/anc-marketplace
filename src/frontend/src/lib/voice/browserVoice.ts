// Feature detection for Web Speech API
export function isSpeechRecognitionSupported(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

export function isSpeechSynthesisSupported(): boolean {
  return !!(typeof window !== 'undefined' && window.speechSynthesis);
}

// Factory for creating SpeechRecognition instance
export function createSpeechRecognition(): SpeechRecognition | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognitionAPI) {
    return null;
  }
  return new SpeechRecognitionAPI();
}

// Text-to-Speech controller interface
export interface TTSController {
  speak: (text: string) => void;
  stop: () => void;
  cancel: () => void;
  isSpeaking: () => boolean;
}

export function createTTSController(): TTSController | null {
  if (!isSpeechSynthesisSupported()) {
    return null;
  }

  return {
    speak: (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    },
    stop: () => {
      window.speechSynthesis.cancel();
    },
    cancel: () => {
      window.speechSynthesis.cancel();
    },
    isSpeaking: () => {
      return window.speechSynthesis.speaking;
    },
  };
}
