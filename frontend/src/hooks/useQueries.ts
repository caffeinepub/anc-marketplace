import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import type {
  UserProfile,
  SellerOnboardingProgress,
  AdminDashboardData,
  AdminFinancialState,
  TransactionRecord,
  PayoutTransactionRecord,
  UserRoleSummary,
  UserWithRole,
  EcomOrder,
  AssistantKnowledgeEntry,
  SellerPayoutProfile,
  SellerPayoutTransferRecord,
  DepositTransaction,
} from "../backend";
import { UserRole__1 } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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

export function useGetUserProfile(user: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ["userProfile", user?.toString()],
    queryFn: async () => {
      if (!actor || !user) return null;
      return actor.getUserProfile(user);
    },
    enabled: !!actor && !isFetching && !!user,
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error("Actor not available");
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Access Control ──────────────────────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isCallerAdmin();
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

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole__1>({
    queryKey: ["callerUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      user,
      role,
    }: {
      user: Principal;
      role: UserRole__1;
    }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerUserRole"] });
      queryClient.invalidateQueries({ queryKey: ["isCallerAdmin"] });
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}

// ─── Onboarding ──────────────────────────────────────────────────────────────

export function useGetOnboarding() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerOnboardingProgress | null>({
    queryKey: ["onboarding"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getOnboarding();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

export function useGetAdminDashboardData() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardData>({
    queryKey: ["adminDashboardData"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getFinancialOverview();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateAdminDashboardData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (_data?: unknown) => {
      // Stub: backend update not yet implemented
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDashboardData"] });
    },
  });
}

// ─── Admin Financial ─────────────────────────────────────────────────────────

export function useGetAdminFinancialState() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminFinancialState>({
    queryKey: ["adminFinancialState"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAdminFinancialState();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Transaction Ledger ──────────────────────────────────────────────────────

export function useGetTransactionLedger() {
  const { actor, isFetching } = useActor();

  return useQuery<TransactionRecord[]>({
    queryKey: ["transactionLedger"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTransactionLedger();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useGetAllTransactionHistory = useGetTransactionLedger;

export function useGetTransactionRecordById(transactionId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<TransactionRecord | null>({
    queryKey: ["transactionRecord", transactionId],
    queryFn: async () => {
      if (!actor || !transactionId) return null;
      return actor.getTransactionRecordById(transactionId);
    },
    enabled: !!actor && !isFetching && !!transactionId,
  });
}

// ─── Payout Transactions ─────────────────────────────────────────────────────

export function useGetTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<PayoutTransactionRecord[]>({
    queryKey: ["payoutTransactions"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias for backward compatibility
export const useGetPayoutTransactions = useGetTransactions;

export function useRecordTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transaction: PayoutTransactionRecord) => {
      if (!actor) throw new Error("Actor not available");
      await actor.recordTransaction(transaction);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payoutTransactions"] });
      queryClient.invalidateQueries({ queryKey: ["sellerBalance"] });
    },
  });
}

// ─── Seller Balance ──────────────────────────────────────────────────────────

export function useGetSellerBalance() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ["sellerBalance"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSellerBalance();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── User Role Summary ───────────────────────────────────────────────────────

export function useGetUserRoleSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRoleSummary>({
    queryKey: ["userRoleSummary"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getUserRoleSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── All Users ───────────────────────────────────────────────────────────────

export function useGetAllUsers() {
  const { actor, isFetching } = useActor();

  return useQuery<UserWithRole[]>({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export function useGetAllOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<EcomOrder[]>({
    queryKey: ["allOrders"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSellerOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<EcomOrder[]>({
    queryKey: ["sellerOrders"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSellerOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomerOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<EcomOrder[]>({
    queryKey: ["customerOrders"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCustomerOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Stripe ──────────────────────────────────────────────────────────────────

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isStripeConfigured"],
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
    mutationFn: async (config: { secretKey: string; allowedCountries: string[] }) => {
      if (!actor) throw new Error("Actor not available");
      await actor.setStripeConfiguration(config);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["isStripeConfigured"] });
    },
  });
}

// ─── Knowledge Base ──────────────────────────────────────────────────────────

export function useGetKnowledgeBase() {
  const { actor, isFetching } = useActor();

  return useQuery<AssistantKnowledgeEntry[]>({
    queryKey: ["knowledgeBase"],
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
    mutationFn: async (_entry: Partial<AssistantKnowledgeEntry>) => {
      // Stub: backend update not yet implemented
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledgeBase"] });
    },
  });
}

// ─── Unanswered Questions (stub) ─────────────────────────────────────────────

export interface UnansweredQuestion {
  id: string;
  question: string;
  categorySuggestion: string;
  creationTime: number;
  interactionCount: number;
}

export function useGetUnansweredQuestions() {
  return useQuery<UnansweredQuestion[]>({
    queryKey: ["unansweredQuestions"],
    queryFn: async () => {
      // Stub: no backend method yet
      return [] as UnansweredQuestion[];
    },
  });
}

// ─── Seller Payout Profile ───────────────────────────────────────────────────

export function useGetSellerPayoutProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerPayoutProfile | null>({
    queryKey: ["sellerPayoutProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSellerPayoutProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllSellerPayoutProfiles() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerPayoutProfile[]>({
    queryKey: ["allSellerPayoutProfiles"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllSellerPayoutProfiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSellerPayoutTransfers() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerPayoutTransferRecord[]>({
    queryKey: ["sellerPayoutTransfers"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getSellerPayoutTransfers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllPayoutTransfers() {
  const { actor, isFetching } = useActor();

  return useQuery<SellerPayoutTransferRecord[]>({
    queryKey: ["allPayoutTransfers"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getAllPayoutTransfers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Deposit Ledger ──────────────────────────────────────────────────────────

export function useGetDepositLedger() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositTransaction[]>({
    queryKey: ["depositLedger"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getDepositLedger();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerDepositTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<DepositTransaction[]>({
    queryKey: ["callerDepositTransactions"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerDepositTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Seller Earnings Summary (stub) ─────────────────────────────────────────

export interface SellerEarningsSummary {
  totalEarnings: bigint;
  totalShippingCosts: bigint;
  totalOrders: bigint;
}

export function useGetSellerEarningsSummary() {
  return useQuery<SellerEarningsSummary>({
    queryKey: ["sellerEarningsSummary"],
    queryFn: async () => {
      return {
        totalEarnings: BigInt(0),
        totalShippingCosts: BigInt(0),
        totalOrders: BigInt(0),
      };
    },
  });
}

// ─── Admin Center Analytics (stub) ──────────────────────────────────────────

export function useGetAdminCenterAnalytics() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["adminCenterAnalytics"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      // Derive analytics from transaction ledger
      const transactions = await actor.getTransactionLedger();
      const totalTransactions = transactions.length;
      const successful = transactions.filter((t) => t.status === "successful");
      const failed = transactions.filter((t) => t.status === "failed");
      const totalRevenueCents = successful.reduce(
        (sum, t) => sum + Number(t.amountCents),
        0
      );
      return {
        totalTransactions,
        totalRevenueCents,
        successfulPayments: successful.length,
        failedPayments: failed.length,
        pendingPayments: 0,
        averageTransactionAmountCents:
          successful.length > 0 ? totalRevenueCents / successful.length : 0,
        failedToSuccessRatio:
          successful.length > 0 ? failed.length / successful.length : 0,
        attemptsPerSuccessfulTransaction:
          successful.length > 0 ? totalTransactions / successful.length : 0,
      };
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Pending Role Applications (stub) ────────────────────────────────────────

export interface RoleApplication {
  applicant: string;
  requestedRole: string;
  reason: string;
  applicationDate: number;
  status: "pending" | "approved" | "rejected";
}

export function useGetPendingRoleApplications() {
  return useQuery<RoleApplication[]>({
    queryKey: ["pendingRoleApplications"],
    queryFn: async () => {
      return [] as RoleApplication[];
    },
  });
}

export function useApproveRoleApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_applicant: Principal) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRoleApplications"] });
    },
  });
}

export function useRejectRoleApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_applicant: Principal) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingRoleApplications"] });
    },
  });
}

// ─── Business Verification (stub) ────────────────────────────────────────────

export function useUpdateBusinessVerificationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_status: string) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["businessVerification"] });
    },
  });
}

// ─── User Activities (stub) ──────────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  isCompleted: boolean;
}

export function useGetUserActivities() {
  return useQuery<Activity[]>({
    queryKey: ["userActivities"],
    queryFn: async () => {
      return [] as Activity[];
    },
  });
}

// ─── Funnel Partner ──────────────────────────────────────────────────────────

export interface FunnelPartner {
  partnerName: string;
  signupLink: string;
  profileLink: string;
}

export function useGetFunnelPartner() {
  return useQuery<FunnelPartner>({
    queryKey: ["funnelPartner"],
    queryFn: async () => {
      return {
        partnerName: "ClickFunnels",
        signupLink:
          "https://clickfunnels.com/signup-flow?aff=anc_marketplace_sellers",
        profileLink: "https://app.clickfunnels.com/my-profile",
      };
    },
  });
}

export function useUpdateFunnelPartner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (_partner: FunnelPartner) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funnelPartner"] });
    },
  });
}
