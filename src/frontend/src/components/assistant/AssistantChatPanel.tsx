import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAskAssistant } from '../../hooks/useAssistant';
import { Alert, AlertDescription } from '@/components/ui/alert';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showEscalation?: boolean;
};

type AssistantMode = 'Customer' | 'Seller' | 'Website/App Builder';

export default function AssistantChatPanel() {
  const [mode, setMode] = useState<AssistantMode>('Customer');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m the ANC Assistant. I can help customers with purchasing and support, sellers with onboarding and selling, and guide you through our Website & App Builder. Select your mode above and ask me anything!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const askAssistant = useAskAssistant();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-muted/30">
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
            </SelectContent>
          </Select>
        </div>
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
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask about ${mode.toLowerCase()} help...`}
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
      </div>
    </div>
  );
}
