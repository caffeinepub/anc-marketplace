import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  TransactionRecord,
  PayoutTransactionRecord,
  AdminFinancialState,
  AssistantKnowledgeEntry,
  UserWithRole,
  AdminDashboardData,
  StripeConfiguration,
} from '../backend';
import type { SellerEarningsSummary, TimeFrame, AdminCenterAnalytics, RoleApplication } from '../types';
import { Principal } from '@icp-sdk/core/principal';

export type { UserWithRole };

export interface UnansweredQuestion {
  id: string;
  question: string;
  categorySuggestion: string;
  creationTime: number;
  interactionCount: number;
}

// ─── Access Control ──────────────────────────────────────────────────────────

export function useInitializeAccessControl() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.initializeAccessControl();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['userRoleSummary'] });
    },
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

// ─── User Profile ────────────────────────────────────────────────────────────

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

// ─── Role Applications ───────────────────────────────────────────────────────

export function useSubmitRoleApplication() {
  return useMutation({
    mutationFn: async (_params: { requestedRole: string; reason: string }) => {
      // Stub: backend method not yet implemented
      throw new Error('Role application submission not yet implemented');
    },
  });
}

export function useGetPendingRoleApplications() {
  return useQuery<RoleApplication[]>({
    queryKey: ['roleApplications'],
    queryFn: async () => [],
  });
}

export function useGetRoleApplications() {
  return useQuery<RoleApplication[]>({
    queryKey: ['roleApplications'],
    queryFn: async () => [],
  });
}

export function useApproveRoleApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (applicant: Principal) => {
      // Stub: backend method not yet implemented
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
      // Stub: backend method not yet implemented
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roleApplications'] });
    },
  });
}

// ─── User Role Summary ───────────────────────────────────────────────────────

export function useGetUserRoleSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['userRoleSummary'],
    queryFn: async () => {
      if (!actor) return { adminCount: BigInt(0), userCount: BigInt(0), guestCount: BigInt(0) };
      return actor.getUserRoleSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin Dashboard / Financial Overview ────────────────────────────────────

export function useGetAdminDashboardData() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardData>({
    queryKey: ['financialOverview'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFinancialOverview();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFinancialOverview() {
  return useGetAdminDashboardData();
}

export function useUpdateAdminDashboardData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Stub: no backend update method
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialOverview'] });
    },
  });
}

// ─── Admin Financial State ───────────────────────────────────────────────────

export function useGetAdminFinancialState() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminFinancialState>({
    queryKey: ['adminFinancialState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminFinancialState();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Transaction Ledger ──────────────────────────────────────────────────────

export function useGetAllTransactionHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<TransactionRecord[]>({
    queryKey: ['transactionLedger'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactionLedger();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTransactionLedger() {
  return useGetAllTransactionHistory();
}

// ─── Payout Transactions ─────────────────────────────────────────────────────

export function useGetPayoutTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<PayoutTransactionRecord[]>({
    queryKey: ['payoutTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSellerBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['sellerBalance'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getSellerBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: PayoutTransactionRecord) => {
      if (!actor) throw new Error('Actor not available');
      await actor.recordTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['sellerBalance'] });
      queryClient.invalidateQueries({ queryKey: ['adminFinancialState'] });
    },
  });
}

// ─── All Users ───────────────────────────────────────────────────────────────

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

// ─── Stripe ──────────────────────────────────────────────────────────────────

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
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isStripeConfigured'] });
    },
  });
}

// ─── Seller Earnings ─────────────────────────────────────────────────────────

export function useGetSellerEarningsSummary(_timeFrame: TimeFrame) {
  return useQuery<SellerEarningsSummary>({
    queryKey: ['sellerEarningsSummary', _timeFrame],
    queryFn: async () => ({
      totalEarnings: BigInt(0),
      totalShippingCosts: BigInt(0),
      totalOrders: BigInt(0),
    }),
    enabled: false,
  });
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────

export function useGetKnowledgeBase() {
  const { actor, isFetching } = useActor();

  return useQuery<AssistantKnowledgeEntry[]>({
    queryKey: ['knowledgeBase'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getKnowledgeBase();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateKnowledgeEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_params: { id: string; newAnswer: string }) => {
      // Stub: backend update not yet implemented
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeBase'] });
    },
  });
}

// ─── Unanswered Questions ────────────────────────────────────────────────────

export function useGetUnansweredQuestions() {
  return useQuery<UnansweredQuestion[]>({
    queryKey: ['unansweredQuestions'],
    queryFn: async () => [],
  });
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export function useGetAdminCenterAnalytics() {
  return useQuery<AdminCenterAnalytics>({
    queryKey: ['adminCenterAnalytics'],
    queryFn: async () => ({
      totalTransactions: BigInt(0),
      totalRevenueCents: BigInt(0),
      successfulPayments: BigInt(0),
      failedPayments: BigInt(0),
      pendingPayments: BigInt(0),
      averageTransactionAmountCents: 0,
      failedToSuccessRatio: 0,
      attemptsPerSuccessfulTransaction: 0,
    }),
  });
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export function useGetOnboarding() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['onboarding'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOnboarding();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_wizardState: any) => {
      // Stub: not yet implemented
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding'] });
    },
  });
}

// ─── Business Verification ───────────────────────────────────────────────────

export function useUpdateBusinessVerificationStatus() {
  return useMutation({
    mutationFn: async (_status: string) => {},
  });
}

// ─── Funnel Partner ──────────────────────────────────────────────────────────

export function useUpdateFunnelPartner() {
  return useMutation({
    mutationFn: async (_partner: { partnerName: string; signupLink: string; profileLink: string }) => {},
  });
}

// ─── User Activities ─────────────────────────────────────────────────────────

export function useGetUserActivities() {
  return useQuery({
    queryKey: ['userActivities'],
    queryFn: async () => [] as any[],
  });
}
