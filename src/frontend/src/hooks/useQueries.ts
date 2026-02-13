import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import {
  UserRole,
  UserRoleSummary,
  AdminDashboardData,
  FunnelPartner,
  AssistantKnowledgeEntry,
  UnansweredQuestion as BackendUnansweredQuestion,
  UserProfile,
  PolicyIdentifier as BackendPolicyIdentifier,
  PolicySignatureRecord,
  AccessRole,
} from '../backend';
import { PolicyMetadata } from '../lib/policies';

// Re-export types for use in components
export type { UnansweredQuestion } from '../backend';

function isPermissionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('unauthorized') || message.includes('permission');
  }
  return false;
}

function policyIdentifierToBackend(identifier: string): BackendPolicyIdentifier {
  // Create the variant type based on the identifier - use unknown for type safety
  switch (identifier) {
    case 'privacy':
      return { privacy: null } as unknown as BackendPolicyIdentifier;
    case 'shipping':
      return { shipping: null } as unknown as BackendPolicyIdentifier;
    case 'returns':
      return { returns: null } as unknown as BackendPolicyIdentifier;
    case 'terms':
      return { terms: null } as unknown as BackendPolicyIdentifier;
    default:
      return { privacy: null } as unknown as BackendPolicyIdentifier;
  }
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        if (isPermissionError(error)) {
          return false;
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getCallerUserRole();
      } catch (error) {
        if (isPermissionError(error)) {
          return UserRole.guest;
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.assignRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRoleSummary'] });
    },
  });
}

export function useGetUserRoleSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRoleSummary>({
    queryKey: ['userRoleSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getUserRoleSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminDashboardData() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardData>({
    queryKey: ['adminDashboardData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getAdminDashboardData();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAdminDashboardData() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateAdminDashboardData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
  });
}

export function useGetFunnelPartner() {
  const { actor, isFetching } = useActor();

  return useQuery<FunnelPartner>({
    queryKey: ['funnelPartner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getFunnelPartner();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateFunnelPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: FunnelPartner) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFunnelPartner(partner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funnelPartner'] });
    },
  });
}

export function useGetAssistantKnowledgeBase() {
  const { actor, isFetching } = useActor();

  return useQuery<AssistantKnowledgeEntry[]>({
    queryKey: ['assistantKnowledgeBase'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAssistantKnowledgeBase();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for compatibility
export const useGetKnowledgeBase = useGetAssistantKnowledgeBase;

export function useAddKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: AssistantKnowledgeEntry) => {
      if (!actor) throw new Error('Actor not available');
      await actor.addKnowledgeEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
      queryClient.invalidateQueries({ queryKey: ['unansweredQuestions'] });
    },
  });
}

export function useUpdateKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newAnswer }: { id: string; newAnswer: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateKnowledgeEntry(id, newAnswer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

export function useGetUnansweredQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<BackendUnansweredQuestion[]>({
    queryKey: ['unansweredQuestions'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getUnansweredQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSignPolicy() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (policyRecord: PolicySignatureRecord) => {
      if (!actor) throw new Error('Actor not available');
      await actor.signPolicy(policyRecord);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['policySignature'] });
      queryClient.invalidateQueries({ queryKey: ['policySignatureVerification'] });
    },
  });
}

export function useGetSignatureByPolicy(policyIdentifier: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PolicySignatureRecord | null>({
    queryKey: ['policySignature', policyIdentifier],
    queryFn: async () => {
      if (!actor) return null;
      const backendIdentifier = policyIdentifierToBackend(policyIdentifier);
      return await actor.getSignatureByPolicy(backendIdentifier);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useVerifyPolicySignature(policy: PolicyMetadata) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['policySignatureVerification', policy.identifier, policy.version],
    queryFn: async () => {
      if (!actor) return false;
      const backendIdentifier = policyIdentifierToBackend(policy.identifier);
      return await actor.verifyPolicySignature(backendIdentifier, policy.version);
    },
    enabled: !!actor && !isFetching,
  });
}
