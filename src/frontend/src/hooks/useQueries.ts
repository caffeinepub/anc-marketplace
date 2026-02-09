import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ShoppingItem, StripeConfiguration, AssistantKnowledgeEntry, AdminDashboardData, MarketplaceRoadmap, UserRole as BackendUserRole } from '../backend';
import type {
  UserProfile,
  Product,
  EcomOrder,
  AccessRole,
  Lesson,
  VirtualMeeting,
  Activity,
  BusinessCreditData,
  StartupProgramData,
  B2BService,
  DropshippingPartner,
  AppIntegration,
  UserWithRole,
  AppIntegrationRecord,
  FunnelPartner,
  StoreBuilderConfig,
  StoreTemplate,
} from '../types';
import { UserRole } from '../types';
import type { Principal } from '@icp-sdk/core/principal';

// Helper to normalize backend authorization errors
function normalizeAuthError(error: any): Error {
  const message = error?.message || String(error);
  if (message.includes('Unauthorized') || message.includes('Only admins')) {
    return new Error('Permission denied: Admin access required');
  }
  return error;
}

// Admin bootstrap hooks
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
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['roleSummary'] });
    },
  });
}

export function useSetOwnerPrincipal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      await actor.setOwnerPrincipal();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['isAdmin'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
      queryClient.invalidateQueries({ queryKey: ['roleSummary'] });
    },
  });
}

// User Profile hooks - Backend methods not yet implemented
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      return null;
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
      // Backend method not implemented yet
      throw new Error('User profile management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        await actor.getAdminDashboardData();
        return true;
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Admin Dashboard Data
export function useGetAdminDashboardData() {
  const { actor, isFetching } = useActor();

  return useQuery<AdminDashboardData>({
    queryKey: ['adminDashboardData'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAdminDashboardData();
      } catch (error) {
        throw normalizeAuthError(error);
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateMarketplaceRoadmap() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.updateMarketplaceRoadmap();
      } catch (error) {
        throw normalizeAuthError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminDashboardData'] });
    },
  });
}

// Role management hooks
export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      return UserRole.guest;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useListAllUsersWithRoles() {
  const { actor, isFetching } = useActor();

  return useQuery<UserWithRole[]>({
    queryKey: ['allUsersWithRoles'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet - placeholder
      return [];
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetRoleSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['roleSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getUserRoleSummary();
      } catch (error) {
        throw normalizeAuthError(error);
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAssignUserAccessRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, newRole }: { userPrincipal: Principal; newRole: AccessRole }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('User role assignment not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsersWithRoles'] });
      queryClient.invalidateQueries({ queryKey: ['roleSummary'] });
    },
  });
}

export function useAssignCallerUserRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: BackendUserRole }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        await actor.assignRole(user, role);
      } catch (error) {
        throw normalizeAuthError(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsersWithRoles'] });
      queryClient.invalidateQueries({ queryKey: ['roleSummary'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
    },
  });
}

// Customer Wishlist & Favorites - Backend methods not yet implemented
export function useGetCustomerWishlist() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['customerWishlist', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      // Backend method not implemented yet
      throw new Error('Wishlist feature not yet available');
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useAddToWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Wishlist feature not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerWishlist', identity?.getPrincipal().toString()] });
    },
  });
}

export function useRemoveFromWishlist() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (itemId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Wishlist feature not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerWishlist', identity?.getPrincipal().toString()] });
    },
  });
}

export function useGetCustomerFavorites() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<string[]>({
    queryKey: ['customerFavorites', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      // Backend method not implemented yet
      throw new Error('Favorites feature not yet available');
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useAddToFavorites() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (sellerId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Favorites feature not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerFavorites', identity?.getPrincipal().toString()] });
    },
  });
}

export function useRemoveFromFavorites() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (sellerId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Favorites feature not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customerFavorites', identity?.getPrincipal().toString()] });
    },
  });
}

// Product hooks - Backend methods not yet implemented
export function useListProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Product management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('Product management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Checkout hooks
export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useCreateStoreBuilderCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (): Promise<CheckoutSession> => {
      if (!actor) throw new Error('Actor not available');
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;
      
      const storeBuilderItem: ShoppingItem = {
        productName: 'Store Builder Subscription',
        productDescription: 'Monthly subscription for Store Builder features',
        priceInCents: BigInt(1000),
        quantity: BigInt(1),
        currency: 'usd',
      };
      
      const result = await actor.createCheckoutSession([storeBuilderItem], successUrl, cancelUrl);
      const session = JSON.parse(result) as CheckoutSession;
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useRegisterUserWithPaidPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      fullName,
      role,
      stripeSessionId,
    }: {
      email: string;
      fullName: string;
      role: AccessRole;
      stripeSessionId: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      throw new Error('User registration not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Stripe configuration
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

// Startup program hooks - Backend methods not yet implemented
export function useGetUserLessons() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Lesson[]>({
    queryKey: ['userLessons', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return [];
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetUserVirtualMeetings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<VirtualMeeting[]>({
    queryKey: ['userVirtualMeetings', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return [];
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetUserActivities() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Activity[]>({
    queryKey: ['userActivities', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return [];
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useGetUserBusinessCredit() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<BusinessCreditData | null>({
    queryKey: ['userBusinessCredit', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return null;
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Lesson completion not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLessons', identity?.getPrincipal().toString()] });
    },
  });
}

export function useCompleteActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (activityId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Activity completion not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities', identity?.getPrincipal().toString()] });
    },
  });
}

export function useUpdateBusinessVerificationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Business verification not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBusinessCredit', identity?.getPrincipal().toString()] });
    },
  });
}

export function useUpdateCreditBureauRegistrationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Credit bureau registration not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBusinessCredit', identity?.getPrincipal().toString()] });
    },
  });
}

export function useAddLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Lesson management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLessons'] });
    },
  });
}

export function useUpdateLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Lesson management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLessons'] });
    },
  });
}

export function useDeleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Lesson management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLessons'] });
    },
  });
}

export function useAddVirtualMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meeting: VirtualMeeting) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Virtual meeting management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userVirtualMeetings'] });
    },
  });
}

export function useUpdateVirtualMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meeting: VirtualMeeting) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Virtual meeting management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userVirtualMeetings'] });
    },
  });
}

export function useDeleteVirtualMeeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meetingId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Virtual meeting management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userVirtualMeetings'] });
    },
  });
}

export function useAddActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Activity) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Activity management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });
}

export function useUpdateActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: Activity) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Activity management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });
}

export function useDeleteActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Activity management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });
}

// B2B Service hooks - Backend methods not yet implemented
export function useListB2BServices() {
  const { actor, isFetching } = useActor();

  return useQuery<B2BService[]>({
    queryKey: ['b2bServices'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateB2BService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: B2BService) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('B2B service management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
    },
  });
}

export function useDeleteB2BService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('B2B service management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
    },
  });
}

// Dropshipping hooks - Backend methods not yet implemented
export function useListDropshippingPartners() {
  const { actor, isFetching } = useActor();

  return useQuery<DropshippingPartner[]>({
    queryKey: ['dropshippingPartners'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateDropshippingPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: DropshippingPartner) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Dropshipping partner management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
    },
  });
}

export function useDeleteDropshippingPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partnerId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Dropshipping partner management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
    },
  });
}

export function useSyncDropshippingPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partnerId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Dropshipping sync not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
    },
  });
}

// App Integration hooks - Backend methods not yet implemented
export function useListAppIntegrations() {
  const { actor, isFetching } = useActor();

  return useQuery<AppIntegrationRecord[]>({
    queryKey: ['appIntegrations'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAppIntegration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (integration: Omit<AppIntegrationRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('App integration management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
    },
  });
}

export function useUpdateAppIntegration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (integration: AppIntegrationRecord) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('App integration management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
    },
  });
}

export function useDeleteAppIntegration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (integrationId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('App integration management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
    },
  });
}

// Funnel Partner hooks - Backend methods not yet implemented
export function useGetFunnelPartner() {
  const { actor, isFetching } = useActor();

  return useQuery<FunnelPartner | null>({
    queryKey: ['funnelPartner'],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetFunnelPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: FunnelPartner) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Funnel partner management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funnelPartner'] });
    },
  });
}

// Store Builder hooks - Backend methods not yet implemented
export function useGetStoreBuilderConfig() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<StoreBuilderConfig | null>({
    queryKey: ['storeBuilderConfig', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      return null;
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useUpdateStoreBuilderConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (config: StoreBuilderConfig) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Store builder configuration not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeBuilderConfig', identity?.getPrincipal().toString()] });
    },
  });
}

export function useListStoreTemplates() {
  const { actor, isFetching } = useActor();

  return useQuery<StoreTemplate[]>({
    queryKey: ['storeTemplates'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetGlobalDomainPurchaseLink() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['globalDomainPurchaseLink'],
    queryFn: async () => {
      if (!actor) return null;
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

// Assistant hooks
export function useGetAssistantKnowledgeBase() {
  const { actor, isFetching } = useActor();

  return useQuery<AssistantKnowledgeEntry[]>({
    queryKey: ['assistantKnowledgeBase'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAssistantKnowledgeBase();
      } catch (error) {
        throw normalizeAuthError(error);
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useAddKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: Omit<AssistantKnowledgeEntry, 'id' | 'lastUpdated' | 'usageCount'>) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Knowledge entry management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

export function useUpdateKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: AssistantKnowledgeEntry) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Knowledge entry management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

export function useDeleteKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entryId: string) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Knowledge entry management not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

// Frontend-only type for unanswered questions (not in backend yet)
export type UnansweredQuestion = {
  id: string;
  question: string;
  categorySuggestion: string;
  creationTime: bigint;
  interactionCount: bigint;
};

export function useGetUnansweredQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<UnansweredQuestion[]>({
    queryKey: ['unansweredQuestions'],
    queryFn: async () => {
      if (!actor) return [];
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useConvertQuestionToKnowledge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, answer }: { questionId: string; answer: string }) => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Question conversion not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unansweredQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}
