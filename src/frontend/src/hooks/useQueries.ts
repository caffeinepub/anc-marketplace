import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, StripeConfiguration, SellerOnboardingProgress, AdminDashboardData, TransactionRecord } from '../backend';
import type { UserRoleSummary, RoleApplication, SellerEarningsSummary, TimeFrame, AdminCenterAnalytics } from '../types';
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

// Stub hooks for role applications - backend methods not yet implemented
export function useSubmitRoleApplication() {
  return useMutation({
    mutationFn: async ({ requestedRole, reason }: { requestedRole: string; reason: string }) => {
      console.warn('[useSubmitRoleApplication] Backend method not implemented');
      throw new Error('Role application submission not yet implemented');
    },
  });
}

export function useGetPendingRoleApplications() {
  return useQuery<RoleApplication[]>({
    queryKey: ['roleApplications'],
    queryFn: async () => {
      console.warn('[useGetPendingRoleApplications] Backend method not implemented');
      return [];
    },
    enabled: false,
  });
}

export function useApproveRoleApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      console.warn('[useApproveRoleApplication] Backend method not implemented');
      throw new Error('Role application approval not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleApplications'] });
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });
    },
  });
}

export function useRejectRoleApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      console.warn('[useRejectRoleApplication] Backend method not implemented');
      throw new Error('Role application rejection not yet implemented');
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
      const summary = await actor.getUserRoleSummary();
      return {
        adminCount: summary.adminCount,
        userCount: summary.userCount,
        guestCount: summary.guestCount,
      };
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
      return actor.getFinancialOverview();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAdminDashboardData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.warn('[useUpdateAdminDashboardData] Backend method not implemented');
      throw new Error('Dashboard data update not yet implemented');
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (wizardState: SellerOnboardingProgress) => {
      console.warn('[useSaveOnboarding] Backend method not implemented');
      throw new Error('Onboarding save not yet implemented');
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
      return actor.getTransactionLedger();
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
  return useQuery<SellerEarningsSummary>({
    queryKey: ['sellerEarningsSummary', timeFrame],
    queryFn: async () => {
      console.warn('[useGetSellerEarningsSummary] Backend method not implemented');
      return {
        totalEarnings: BigInt(0),
        totalShippingCosts: BigInt(0),
        totalOrders: BigInt(0),
      };
    },
    enabled: false,
  });
}

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAdminCenterAnalytics() {
  return useQuery<AdminCenterAnalytics>({
    queryKey: ['adminCenterAnalytics'],
    queryFn: async () => {
      console.warn('[useGetAdminCenterAnalytics] Backend method not implemented');
      return {
        totalTransactions: BigInt(0),
        totalRevenueCents: BigInt(0),
        successfulPayments: BigInt(0),
        failedPayments: BigInt(0),
        pendingPayments: BigInt(0),
        averageTransactionAmountCents: 0,
        failedToSuccessRatio: 0,
        attemptsPerSuccessfulTransaction: 0,
      };
    },
    enabled: false,
  });
}
