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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wizardState: SellerOnboardingProgress) => {
      console.warn('[useSaveOnboarding] Backend method not implemented');
      throw new Error('Onboarding save not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sellerOnboarding'] });
    },
  });
}
