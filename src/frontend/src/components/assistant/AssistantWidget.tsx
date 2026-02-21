import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import AssistantChatPanel from './AssistantChatPanel';

export default function AssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)]">
          <AssistantChatPanel isOpen={isOpen} />
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="lg"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg bg-white border-2 border-menu-border hover:bg-menu-item-hover"
        aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
      >
        {isOpen ? <X className="h-6 w-6 text-foreground" /> : <MessageCircle className="h-6 w-6 text-foreground" />}
      </Button>
    </>
  );
}
