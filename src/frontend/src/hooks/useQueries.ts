import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, StripeConfiguration, SellerOnboardingProgress, AdminDashboardData, TransactionRecord, SellerEarningsSummary, TimeFrame, UserRoleSummary, RoleApplication, UserRole, UserWithRole, AdminCenterAnalytics } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

export interface AdminFinancialState {
  availableFundsCents: bigint;
  creditAccount: {
    creditLimitCents: bigint;
    usedAmountCents: bigint;
  };
  payrollSavingsCents: bigint;
}

export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log('[useInitializeAccessControl] Starting initialization', {
        actorAvailable: !!actor,
        timestamp: new Date().toISOString()
      });

      if (!actor) {
        console.error('[useInitializeAccessControl] Actor not available');
        throw new Error('Actor not available');
      }

      console.log('[useInitializeAccessControl] Calling actor.initializeAccessControl()');
      
      try {
        await actor.initializeAccessControl();
        console.log('[useInitializeAccessControl] Successfully completed');
      } catch (error: any) {
        console.error('[useInitializeAccessControl] Failed:', {
          error,
          message: error?.message,
          stack: error?.stack
        });
        throw error;
      }
    },
    onSuccess: () => {
      console.log('[useInitializeAccessControl] onSuccess - invalidating queries');
      // Invalidate admin check and user profile to refresh role status
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userRoleSummary'] });
    },
    onError: (error: any) => {
      console.error('[useInitializeAccessControl] onError:', error);
    }
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
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
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitRoleApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestedRole, reason }: { requestedRole: UserRole; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitRoleApplication(requestedRole, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleApplications'] });
    },
  });
}

export function useGetPendingRoleApplications() {
  const { actor, isFetching } = useActor();

  return useQuery<RoleApplication[]>({
    queryKey: ['roleApplications'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPendingRoleApplications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveRoleApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.approveRoleApplication(applicant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleApplications'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useRejectRoleApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.rejectRoleApplication(applicant);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleApplications'] });
    },
  });
}

export function useGetUserRoleSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRoleSummary>({
    queryKey: ['userRoleSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getUserRoleSummary();
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
      return actor.getAdminDashboardData();
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
      return actor.updateAdminDashboardData();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetStripeConfiguration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (config: StripeConfiguration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

export function useSaveOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wizardState: SellerOnboardingProgress) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveOnboarding(wizardState);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });
}

export function useGetOnboarding() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerOnboardingProgress | null>({
    queryKey: ['onboarding'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOnboarding();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTransactionHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<TransactionRecord[]>({
    queryKey: ['allTransactionHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactionHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminFinancialState() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminFinancialState>({
    queryKey: ['adminFinancialState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      const state = await actor.getAdminFinancialState();
      return {
        ...state,
        payrollSavingsCents: BigInt(0),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSellerEarningsSummary(timeFrame: TimeFrame) {
  const { actor, isFetching } = useActor();

  return useQuery<SellerEarningsSummary>({
    queryKey: ['sellerEarningsSummary', timeFrame],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSellerEarningsSummary(timeFrame);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserWithRole[]>({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminCenterAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminCenterAnalytics>({
    queryKey: ['adminCenterAnalytics'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminCenterAnalytics();
    },
    enabled: !!actor && !isFetching,
  });
}
