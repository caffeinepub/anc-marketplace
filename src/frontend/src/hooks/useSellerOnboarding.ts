import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SellerOnboardingProgress } from "../backend";
import { useActor } from "./useActor";

export function useGetOnboarding() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerOnboardingProgress | null>({
    queryKey: ["sellerOnboarding"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return await actor.getOnboarding();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_wizardState: SellerOnboardingProgress) => {
      console.warn("[useSaveOnboarding] Backend method not implemented");
      throw new Error("Onboarding save not yet implemented");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOnboarding"] });
    },
  });
}
