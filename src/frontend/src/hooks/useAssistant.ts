import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useAskAssistant() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ question, category }: { question: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      const answer = await actor.askAssistant(question, category);
      return answer;
    },
  });
}
