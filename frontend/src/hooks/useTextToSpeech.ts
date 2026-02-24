import { useState, useCallback, useEffect, useRef } from 'react';
import { createTTSController, isSpeechSynthesisSupported } from '../lib/voice/browserVoice';

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | null>(null);
  const controllerRef = useRef(createTTSController());
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isSupported = isSpeechSynthesisSupported();

  // Monitor speaking state
  useEffect(() => {
    if (!isSupported || !controllerRef.current) return;

    checkIntervalRef.current = setInterval(() => {
      const speaking = controllerRef.current?.isSpeaking() || false;
      setIsSpeaking(speaking);
      if (!speaking) {
        setCurrentMessageId(null);
      }
    }, 100);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, [isSupported]);

  const speak = useCallback((text: string, messageId?: string) => {
    if (!isSupported || !controllerRef.current) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Stop any current speech
    controllerRef.current.stop();

    // Start new speech
    controllerRef.current.speak(text);
    setIsSpeaking(true);
    if (messageId) {
      setCurrentMessageId(messageId);
    }
  }, [isSupported]);

  const stop = useCallback(() => {
    if (!controllerRef.current) return;
    controllerRef.current.stop();
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  const cancel = useCallback(() => {
    if (!controllerRef.current) return;
    controllerRef.current.cancel();
    setIsSpeaking(false);
    setCurrentMessageId(null);
  }, []);

  return {
    speak,
    stop,
    cancel,
    isSpeaking,
    currentMessageId,
    isSupported,
  };
}
