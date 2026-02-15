import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import {
  UserRole,
  UserRoleSummary,
  AdminDashboardData,
  UserProfile,
  AccessRole,
  StripeConfiguration,
} from '../backend';

function isPermissionError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return message.includes('unauthorized') || message.includes('permission');
  }
  return false;
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

// Mock type for AdminFinancialState since it's not in backend yet
export type AdminFinancialState = {
  availableFundsCents: bigint;
  creditAccount: {
    creditLimitCents: bigint;
    usedAmountCents: bigint;
  };
};

export function useGetAdminFinancialState() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminFinancialState>({
    queryKey: ['adminFinancialState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Mock data until backend implements this
      return {
        availableFundsCents: BigInt(759757),
        creditAccount: {
          creditLimitCents: BigInt(1000000),
          usedAmountCents: BigInt(0),
        },
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isStripeConfigured'],
    queryFn: async () => {
      if (!actor) return false;
      return await actor.isStripeConfigured();
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
