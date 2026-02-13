import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Phone, Mic, MicOff, Volume2, VolumeX, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAskAssistant } from '../../hooks/useAssistant';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import { usePageActivity } from '../../hooks/usePageActivity';
import { useVoiceSettings } from '../../contexts/VoiceSettingsContext';
import { isSpeechRecognitionSupported, isSpeechSynthesisSupported } from '../../lib/voice/browserVoice';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showEscalation?: boolean;
};

type AssistantMode = 'Customer' | 'Seller' | 'Website/App Builder' | 'Business Operations';

const MODE_PLACEHOLDERS: Record<AssistantMode, string> = {
  'Customer': 'Ask about customer help...',
  'Seller': 'Ask about seller help...',
  'Website/App Builder': 'Ask about website & app builder...',
  'Business Operations': 'Ask about funnels, reports, onboarding, advertising...',
};

interface AssistantChatPanelProps {
  isOpen: boolean;
}

export default function AssistantChatPanel({ isOpen }: AssistantChatPanelProps) {
  const [mode, setMode] = useState<AssistantMode>('Customer');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the ANC Assistant. I can help customers with purchasing and support, sellers with onboarding and selling, guide you through our Website & App Builder, and assist with business operations like funnels, reports, onboarding, and advertising. Select your mode above and ask me anything!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const askAssistant = useAskAssistant();

  // Voice settings from context
  const {
    micPermissionStatus,
    requestMicPermission,
    preferences,
    setVoiceActivationEnabled,
    setSpokenRepliesEnabled,
  } = useVoiceSettings();

  const isPageActive = usePageActivity();

  // Speech recognition
  const {
    isListening,
    transcript,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechRecognitionAvailable,
    canStart: canStartRecognition,
    start: startRecognition,
    stop: stopRecognition,
    reset: resetTranscript,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    restartOnEnd: preferences.voiceActivationEnabled,
    permissionStatus: micPermissionStatus,
    onResult: (text, isFinal) => {
      if (isFinal && text.trim()) {
        setInput((prev) => prev + text);
      }
    },
  });

  // Text-to-speech
  const {
    speak,
    stop: stopSpeech,
    isSpeaking,
    currentMessageId,
    isSupported: isTTSAvailable,
  } = useTextToSpeech();

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, interimTranscript]);

  // Handle voice activation mode
  useEffect(() => {
    if (preferences.voiceActivationEnabled && isOpen && isPageActive && canStartRecognition) {
      if (!isListening) {
        startRecognition();
      }
    } else {
      if (isListening) {
        stopRecognition();
      }
    }
  }, [preferences.voiceActivationEnabled, isOpen, isPageActive, canStartRecognition, isListening, startRecognition, stopRecognition]);

  // Stop speech when widget closes
  useEffect(() => {
    if (!isOpen) {
      stopRecognition();
      stopSpeech();
    }
  }, [isOpen, stopRecognition, stopSpeech]);

  // Handle transcript updates
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Stop any ongoing speech
    stopSpeech();

    try {
      const answer = await askAssistant.mutateAsync({
        question: input.trim(),
        category: mode,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answer || 'I apologize, but I don\'t have enough information to answer that question confidently.',
        showEscalation: !answer,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak the response if enabled
      if (preferences.spokenRepliesEnabled && answer && isTTSAvailable) {
        speak(answer, assistantMessage.id);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'m sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicToggle = async () => {
    if (micPermissionStatus !== 'granted') {
      const granted = await requestMicPermission();
      if (!granted) return;
    }

    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  };

  const handleVoiceActivationToggle = async (enabled: boolean) => {
    if (enabled && micPermissionStatus !== 'granted') {
      const granted = await requestMicPermission();
      if (!granted) {
        return;
      }
    }
    setVoiceActivationEnabled(enabled);
  };

  const handleSpokenRepliesToggle = (enabled: boolean) => {
    setSpokenRepliesEnabled(enabled);
    if (!enabled) {
      stopSpeech();
    }
  };

  const handlePlayMessage = (message: Message) => {
    if (currentMessageId === message.id && isSpeaking) {
      stopSpeech();
    } else {
      speak(message.content, message.id);
    }
  };

  const voiceFeaturesAvailable = isSpeechRecognitionAvailable && isTTSAvailable;

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/30 space-y-3">
        <div className="space-y-2">
          <Label htmlFor="assistant-mode" className="text-sm font-medium">
            Assistant Mode
          </Label>
          <Select value={mode} onValueChange={(value) => setMode(value as AssistantMode)}>
            <SelectTrigger id="assistant-mode" className="w-full">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Customer">Customer Help</SelectItem>
              <SelectItem value="Seller">Seller Help</SelectItem>
              <SelectItem value="Website/App Builder">Website & App Builder</SelectItem>
              <SelectItem value="Business Operations">Business Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voice Controls */}
        {voiceFeaturesAvailable && micPermissionStatus === 'granted' && (
          <div className="space-y-2 pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                <Label htmlFor="voice-activation" className="text-sm font-medium cursor-pointer">
                  Voice Activation
                </Label>
              </div>
              <Switch
                id="voice-activation"
                checked={preferences.voiceActivationEnabled}
                onCheckedChange={handleVoiceActivationToggle}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <Label htmlFor="spoken-replies" className="text-sm font-medium cursor-pointer">
                  Spoken Replies
                </Label>
              </div>
              <Switch
                id="spoken-replies"
                checked={preferences.spokenRepliesEnabled}
                onCheckedChange={handleSpokenRepliesToggle}
              />
            </div>
          </div>
        )}

        {/* Listening Indicator */}
        {isListening && (
          <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
            <Mic className="h-4 w-4" />
            <span className="font-medium">Listening...</span>
          </div>
        )}

        {/* Voice Feature Unavailable Alert */}
        {!voiceFeaturesAvailable && (
          <Alert className="py-2">
            <AlertDescription className="text-xs">
              Voice features are not available in your current browser. Please use Chrome, Edge, or Safari for voice support.
            </AlertDescription>
          </Alert>
        )}

        {/* Permission Denied Alert */}
        {micPermissionStatus === 'denied' && voiceFeaturesAvailable && (
          <Alert className="py-2">
            <AlertDescription className="text-xs">
              Microphone access denied. Please enable it in your browser settings to use voice features.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex flex-col gap-2 max-w-[80%]">
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                  {message.role === 'assistant' && preferences.spokenRepliesEnabled && isTTSAvailable && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePlayMessage(message)}
                      className="self-start h-6 px-2 text-xs"
                    >
                      {currentMessageId === message.id && isSpeaking ? (
                        <>
                          <VolumeX className="h-3 w-3 mr-1" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3 w-3 mr-1" />
                          Play
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
              {message.showEscalation && (
                <div className="mt-3 ml-2">
                  <Alert className="border-primary/50">
                    <Phone className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <p className="font-semibold mb-2">Need to speak with management?</p>
                      <p className="mb-2">
                        If you'd like to discuss this with a supervisor, please contact us at:
                      </p>
                      <p className="font-mono font-bold text-base">352-480-9856</p>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          {interimTranscript && (
            <div className="flex justify-end">
              <div className="bg-primary/50 text-primary-foreground rounded-lg px-4 py-2 max-w-[80%]">
                <p className="text-sm italic">{interimTranscript}</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          {voiceFeaturesAvailable && (
            <Button
              onClick={handleMicToggle}
              disabled={isTyping || micPermissionStatus === 'unavailable'}
              size="icon"
              variant={isListening ? 'default' : 'outline'}
              className={isListening ? 'bg-primary animate-pulse' : ''}
            >
              {isListening ? (
                <MicOff className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
            </Button>
          )}
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={MODE_PLACEHOLDERS[mode]}
            disabled={isTyping}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {speechError && (
          <p className="text-xs text-destructive mt-2">{speechError}</p>
        )}
      </div>
    </div>
  );
}
