import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

export type AssistantCategory = 'Customer' | 'Seller' | 'Website/App Builder' | 'Business Operations';

export function useAskAssistant() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ question, category }: { question: string; category?: AssistantCategory }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not yet implemented - return placeholder
      return 'The AI assistant feature is currently being developed. Please contact support at ancelectronicsnservices@gmail.com for assistance.';
    },
  });
}
