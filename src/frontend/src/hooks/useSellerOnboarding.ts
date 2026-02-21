import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { SellerOnboardingProgress } from '../backend';

export function useGetOnboarding() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerOnboardingProgress | null>({
    queryKey: ['sellerOnboarding'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getOnboarding();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wizardState: SellerOnboardingProgress) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveOnboarding(wizardState);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerOnboarding'] });
    },
  });
}
