import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ShoppingItem, StripeConfiguration, AssistantKnowledgeEntry, UnansweredQuestion } from '../backend';
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

// Mock implementations for methods not yet in backend
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
      console.warn('saveCallerUserProfile not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      // Backend method not implemented yet
      return false;
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
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRoleSummary() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['roleSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      return {
        adminCount: BigInt(0),
        userCount: BigInt(0),
        guestCount: BigInt(0),
        startupMemberCount: BigInt(0),
        b2bMemberCount: BigInt(0),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAssignUserAccessRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, newRole }: { userPrincipal: Principal; newRole: AccessRole }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('assignUserAccessRole not implemented in backend');
      return;
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
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('assignCallerUserRole not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allUsersWithRoles'] });
      queryClient.invalidateQueries({ queryKey: ['roleSummary'] });
      queryClient.invalidateQueries({ queryKey: ['callerUserRole'] });
    },
  });
}

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
      console.warn('addOrUpdateProduct not implemented in backend');
      return;
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
      console.warn('deleteProduct not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

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
      console.warn('registerUserWithPaidPlan not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
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

export function useGetUserLessons() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Lesson[]>({
    queryKey: ['userLessons', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      // Backend method not implemented yet
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
      // Backend method not implemented yet
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
      // Backend method not implemented yet
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
      // Backend method not implemented yet
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
      // Backend method not implemented yet
      console.warn('completeLesson not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('completeActivity not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('updateBusinessVerificationStatus not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('updateCreditBureauRegistrationStatus not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('addLesson not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('updateLesson not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('deleteLesson not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('addVirtualMeeting not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('updateVirtualMeeting not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('deleteVirtualMeeting not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('addActivity not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('updateActivity not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('deleteActivity not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });
}

export function useListB2BServices() {
  const { actor, isFetching } = useActor();

  return useQuery<B2BService[]>({
    queryKey: ['b2bServices'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddB2BService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: B2BService) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('addB2BService not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
    },
  });
}

export function useUpdateB2BService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: B2BService) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('updateB2BService not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('deleteB2BService not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
    },
  });
}

export function useToggleB2BServiceStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('toggleB2BServiceStatus not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
    },
  });
}

export function useListDropshippingPartners() {
  const { actor, isFetching } = useActor();

  return useQuery<DropshippingPartner[]>({
    queryKey: ['dropshippingPartners'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddDropshippingPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: DropshippingPartner) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('addDropshippingPartner not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
    },
  });
}

export function useUpdateDropshippingPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: DropshippingPartner) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('updateDropshippingPartner not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('deleteDropshippingPartner not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
    },
  });
}

export function useListAppIntegrations() {
  const { actor, isFetching } = useActor();

  return useQuery<AppIntegration[]>({
    queryKey: ['appIntegrations'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAppIntegration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (integration: AppIntegration) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('addAppIntegration not implemented in backend');
      return;
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
    mutationFn: async (integration: AppIntegration) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('updateAppIntegration not implemented in backend');
      return;
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
      // Backend method not implemented yet
      console.warn('deleteAppIntegration not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
    },
  });
}

export function useToggleAppIntegrationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ integrationId, isActive }: { integrationId: string; isActive: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('toggleAppIntegrationStatus not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
    },
  });
}

export function useGetAdminDashboardStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      return {
        totalUsers: BigInt(0),
        totalProducts: BigInt(0),
        totalOrders: BigInt(0),
        totalRevenue: BigInt(0),
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPendingOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<EcomOrder[]>({
    queryKey: ['pendingOrders'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllAppIntegrations() {
  const { actor, isFetching } = useActor();

  return useQuery<AppIntegrationRecord[]>({
    queryKey: ['allAppIntegrations'],
    queryFn: async () => {
      if (!actor) return [];
      // Backend method not implemented yet
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAppIntegrationRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: AppIntegrationRecord) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('addAppIntegrationRecord not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppIntegrations'] });
    },
  });
}

export function useUpdateAppIntegrationRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: AppIntegrationRecord) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('updateAppIntegrationRecord not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppIntegrations'] });
    },
  });
}

export function useRemoveAppIntegrationRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('removeAppIntegrationRecord not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppIntegrations'] });
    },
  });
}

export function useAddWebhookIntegrationRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (webhookUrl: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('addWebhookIntegrationRecord not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppIntegrations'] });
    },
  });
}

export function useGetMerchantFunnelPartner() {
  const { actor, isFetching } = useActor();

  return useQuery<FunnelPartner>({
    queryKey: ['merchantFunnelPartner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      return {
        partnerName: 'funnels',
        partnerLink: 'https://app.funnels.link',
      };
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetMerchantFunnelPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ partnerName, partnerLink }: { partnerName: string; partnerLink: string }) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('setMerchantFunnelPartner not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantFunnelPartner'] });
    },
  });
}

export function useGetStoreBuilderConfig() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<StoreBuilderConfig | null>({
    queryKey: ['storeBuilderConfig', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      // Backend method not implemented yet
      return null;
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useSaveStoreBuilderConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (config: StoreBuilderConfig) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('saveStoreBuilderConfig not implemented in backend');
      return;
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
      // Backend method not implemented yet - return mock templates
      return [
        {
          id: 'ecom-1',
          name: 'Modern E-commerce',
          description: 'Clean and modern e-commerce template',
          previewImage: '/assets/generated/template-ecom-1-thumb.dim_800x600.png',
          type_: { __kind__: 'ecommerce' },
        },
        {
          id: 'ecom-2',
          name: 'Classic Shop',
          description: 'Traditional online store layout',
          previewImage: '/assets/generated/template-ecom-2-thumb.dim_800x600.png',
          type_: { __kind__: 'ecommerce' },
        },
        {
          id: 'service-1',
          name: 'Professional Services',
          description: 'Perfect for service-based businesses',
          previewImage: '/assets/generated/template-service-1-thumb.dim_800x600.png',
          type_: { __kind__: 'service' },
        },
        {
          id: 'service-2',
          name: 'Consulting Agency',
          description: 'Ideal for consulting and agencies',
          previewImage: '/assets/generated/template-service-2-thumb.dim_800x600.png',
          type_: { __kind__: 'service' },
        },
      ];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateDomainPurchaseLink() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (link: string) => {
      if (!actor) throw new Error('Actor not available');
      // Backend method not implemented yet
      console.warn('updateDomainPurchaseLink not implemented in backend');
      return;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['globalDomainPurchaseLink'] });
    },
  });
}

export function useGetGlobalDomainPurchaseLink() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['globalDomainPurchaseLink'],
    queryFn: async () => {
      if (!actor) return null;
      // Backend method not implemented yet
      return null;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAssistantKnowledgeBase() {
  const { actor, isFetching } = useActor();

  return useQuery<AssistantKnowledgeEntry[]>({
    queryKey: ['assistantKnowledgeBase'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAssistantKnowledgeBase();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddAssistantKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: AssistantKnowledgeEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAssistantKnowledgeEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

export function useUpdateAssistantKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: AssistantKnowledgeEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAssistantKnowledgeEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

export function useRemoveAssistantKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeAssistantKnowledgeEntry(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}

export function useGetUnansweredQuestions() {
  const { actor, isFetching } = useActor();

  return useQuery<UnansweredQuestion[]>({
    queryKey: ['unansweredQuestions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUnansweredQuestions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkQuestionAsAnswered() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markQuestionAsAnswered(questionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unansweredQuestions'] });
    },
  });
}

export function useConvertQuestionToKnowledgeEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, answer, category }: { questionId: string; answer: string; category: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.convertQuestionToKnowledgeEntry(questionId, answer, category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unansweredQuestions'] });
      queryClient.invalidateQueries({ queryKey: ['assistantKnowledgeBase'] });
    },
  });
}
