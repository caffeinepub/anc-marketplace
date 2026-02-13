import { useState, useEffect, useCallback } from 'react';

export type MicrophonePermissionStatus = 'prompt' | 'granted' | 'denied' | 'unavailable';

export function useMicrophonePermission() {
  const [status, setStatus] = useState<MicrophonePermissionStatus>('prompt');
  const [isRequesting, setIsRequesting] = useState(false);

  // Check if browser supports getUserMedia
  const isSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

  // Check current permission status
  const checkPermission = useCallback(async () => {
    if (!isSupported) {
      setStatus('unavailable');
      return;
    }

    try {
      // Try to query permission state if available
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setStatus(result.state as MicrophonePermissionStatus);
        
        // Listen for permission changes
        result.onchange = () => {
          setStatus(result.state as MicrophonePermissionStatus);
        };
      }
    } catch (error) {
      // Some browsers don't support permission query for microphone
      console.log('Permission query not supported, will check on request');
    }
  }, [isSupported]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  // Request microphone permission (must be called from user gesture)
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setStatus('unavailable');
      return false;
    }

    setIsRequesting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach(track => track.stop());
      setStatus('granted');
      return true;
    } catch (error: any) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setStatus('denied');
      } else {
        setStatus('unavailable');
      }
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [isSupported]);

  // Retry permission request
  const retry = useCallback(() => {
    return requestPermission();
  }, [requestPermission]);

  return {
    status,
    isRequesting,
    isSupported,
    requestPermission,
    retry,
    checkPermission,
  };
}
