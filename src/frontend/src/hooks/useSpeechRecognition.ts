import { useState, useEffect, useCallback, useRef } from 'react';
import { createSpeechRecognition, isSpeechRecognitionSupported } from '../lib/voice/browserVoice';
import { MicrophonePermissionStatus } from './useMicrophonePermission';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  restartOnEnd?: boolean;
  permissionStatus?: MicrophonePermissionStatus;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    continuous = false,
    interimResults = true,
    lang = 'en-US',
    onResult,
    onError,
    restartOnEnd = false,
    permissionStatus = 'prompt',
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldRestartRef = useRef(false);

  const isSupported = isSpeechRecognitionSupported();
  const canStart = isSupported && permissionStatus === 'granted';

  // Initialize recognition
  useEffect(() => {
    if (!isSupported) return;

    const recognition = createSpeechRecognition();
    if (!recognition) return;

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event) => {
      let interimText = '';
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;

        if (result.isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
        onResult?.(finalText, true);
      }

      if (interimText) {
        setInterimTranscript(interimText);
        onResult?.(interimText, false);
      }
    };

    recognition.onerror = (event) => {
      const errorMessage = `Speech recognition error: ${event.error}`;
      setError(errorMessage);
      onError?.(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');

      // Restart if continuous mode and shouldRestart flag is set
      if (shouldRestartRef.current && restartOnEnd) {
        try {
          recognition.start();
          setIsListening(true);
        } catch (err) {
          console.error('Failed to restart recognition:', err);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [isSupported, continuous, interimResults, lang, onResult, onError, restartOnEnd]);

  const start = useCallback(() => {
    if (!canStart || !recognitionRef.current) {
      setError('Cannot start: microphone permission not granted or not supported');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      shouldRestartRef.current = true;
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err: any) {
      if (err.name !== 'InvalidStateError') {
        setError(`Failed to start recognition: ${err.message}`);
      }
    }
  }, [canStart]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      shouldRestartRef.current = false;
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Failed to stop recognition:', err);
    }
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    canStart,
    start,
    stop,
    reset,
  };
}
