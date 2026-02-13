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
  SellerPayoutProfile,
  AccountAssignment,
  BusinessDebitCardRequest,
  BusinessCreditCardApplication,
  AdminFinancialState,
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
    case 'marketplaceWide':
      return { marketplaceWide: null } as unknown as BackendPolicyIdentifier;
    default:
      console.error(`Unknown policy identifier: ${identifier}`);
      throw new Error(`Unknown policy identifier: ${identifier}`);
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
    },
  });
}

export function useVerifyPolicySignature(policy: PolicyMetadata) {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['policySignature', policy.identifier, policy.version],
    queryFn: async () => {
      if (!actor) return false;
      try {
        const backendIdentifier = policyIdentifierToBackend(policy.identifier);
        return await actor.verifyPolicySignature(backendIdentifier, policy.version);
      } catch (error) {
        console.error('Error verifying policy signature:', error);
        return false;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Admin Financial State Hooks

export function useGetAdminFinancialState() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminFinancialState>({
    queryKey: ['adminFinancialState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAdminFinancialState();
      } catch (error) {
        if (isPermissionError(error)) {
          throw new Error('Unauthorized: Only admins can access financial data');
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// Seller Payout Hooks

export function useGetPayoutProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerPayoutProfile | null>({
    queryKey: ['payoutProfile'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPayoutProfile();
      } catch (error) {
        if (isPermissionError(error)) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrUpdatePayoutProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payoutAccount: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createOrUpdatePayoutProfile(payoutAccount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutProfile'] });
    },
  });
}

export function useGetAccountNumber() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['accountNumber'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getAccountNumber();
      } catch (error) {
        if (isPermissionError(error)) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateOrGetAccountNumber() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createOrGetAccountNumber();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountNumber'] });
    },
  });
}

export function useRequestBusinessDebitCard() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (businessName: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.requestBusinessDebitCard(businessName);
    },
  });
}

export function useSubmitBusinessCreditCardApplication() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (businessName: string) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.submitBusinessCreditCardApplication(businessName);
    },
  });
}
