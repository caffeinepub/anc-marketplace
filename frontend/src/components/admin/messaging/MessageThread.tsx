import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, ArrowLeft } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderName: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
}

interface MessageThreadProps {
  recipientName: string;
  messages: Message[];
  onBack: () => void;
  onReply: (content: string) => void;
}

export default function MessageThread({ recipientName, messages, onBack, onReply }: MessageThreadProps) {
  const [replyContent, setReplyContent] = React.useState('');

  const handleReply = () => {
    if (!replyContent.trim()) return;
    onReply(replyContent);
    setReplyContent('');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <CardTitle>Conversation with {recipientName}</CardTitle>
            <CardDescription>{messages.length} messages</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isAdmin ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 space-y-1 ${message.isAdmin ? 'text-right' : 'text-left'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{message.senderName}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                </div>
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.isAdmin
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-4 border-t">
          <Textarea
            placeholder="Type your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button onClick={handleReply} disabled={!replyContent.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
