import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Product, EcomOrder, ShoppingItem, StripeConfiguration, AccessRole, Lesson, VirtualMeeting, Activity, BusinessCreditData, StartupProgramData, B2BService, DropshippingPartner, AppIntegration, UserWithRole, UserRole, AppIntegrationRecord, FunnelPartner } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

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

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery<UserRole>({
    queryKey: ['callerUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
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
      return actor.listAllUsersWithRoles();
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
      return actor.getRoleSummary();
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
      return actor.assignUserAccessRole(userPrincipal, newRole);
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
      return actor.assignCallerUserRole(user, role);
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
      return actor.listProductsByName();
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
      return actor.addOrUpdateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useAddToCart() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addToCart(productId);
    },
  });
}

export function useCheckoutCart() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (stripeSessionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkoutCart(stripeSessionId);
    },
  });
}

export function useGetUserOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<EcomOrder[]>({
    queryKey: ['userOrders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ items, successUrl, cancelUrl }: { items: ShoppingItem[]; successUrl: string; cancelUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);
      const session = JSON.parse(result) as { id: string; url: string };
      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }
      return session;
    },
  });
}

export function useRegisterUserWithPaidPlan() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ email, fullName, role, stripeSessionId }: { email: string; fullName: string; role: AccessRole; stripeSessionId: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUserWithPaidPlan(email, fullName, role, stripeSessionId);
    },
  });
}

export function useUpdateSubscriptionRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userPrincipal, newRole }: { userPrincipal: Principal; newRole: AccessRole }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateSubscriptionRole(userPrincipal, newRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['stripeConfigured'],
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
      queryClient.invalidateQueries({ queryKey: ['stripeConfigured'] });
    },
  });
}

export function useGetAdminDashboardStats() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAdminDashboardStats();
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
      return actor.getPendingOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddLesson() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLesson(lesson);
    },
  });
}

export function useUpdateLesson() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (lesson: Lesson) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLesson(lesson);
    },
  });
}

export function useDeleteLesson() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLesson(lessonId);
    },
  });
}

export function useAddVirtualMeeting() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (meeting: VirtualMeeting) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addVirtualMeeting(meeting);
    },
  });
}

export function useUpdateVirtualMeeting() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (meeting: VirtualMeeting) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateVirtualMeeting(meeting);
    },
  });
}

export function useDeleteVirtualMeeting() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (meetingId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteVirtualMeeting(meetingId);
    },
  });
}

export function useAddActivity() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (activity: Activity) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addActivity(activity);
    },
  });
}

export function useUpdateActivity() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (activity: Activity) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateActivity(activity);
    },
  });
}

export function useDeleteActivity() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (activityId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteActivity(activityId);
    },
  });
}

export function useListB2BServices() {
  const { actor, isFetching } = useActor();

  return useQuery<B2BService[]>({
    queryKey: ['b2bServices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listB2BServices();
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
      return actor.addB2BService(service);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useUpdateB2BService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: B2BService) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateB2BService(service);
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
      return actor.deleteB2BService(serviceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['b2bServices'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useToggleB2BServiceStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, isActive }: { serviceId: string; isActive: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleB2BServiceStatus(serviceId, isActive);
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
      return actor.listDropshippingPartners();
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
      return actor.addDropshippingPartner(partner);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useUpdateDropshippingPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (partner: DropshippingPartner) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDropshippingPartner(partner);
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
      return actor.deleteDropshippingPartner(partnerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dropshippingPartners'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useListAppIntegrations() {
  const { actor, isFetching } = useActor();

  return useQuery<AppIntegration[]>({
    queryKey: ['appIntegrations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listAppIntegrations();
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
      return actor.addAppIntegration(integration);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useUpdateAppIntegration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (integration: AppIntegration) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAppIntegration(integration);
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
      return actor.deleteAppIntegration(integrationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboardStats'] });
    },
  });
}

export function useToggleAppIntegrationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ integrationId, isActive }: { integrationId: string; isActive: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.toggleAppIntegrationStatus(integrationId, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appIntegrations'] });
    },
  });
}

// App Center hooks for AppIntegrationRecord
export function useGetAllAppIntegrations() {
  const { actor, isFetching } = useActor();

  return useQuery<AppIntegrationRecord[]>({
    queryKey: ['allAppIntegrations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllAppIntegrations();
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
      return actor.addAppIntegrationRecord(record);
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
      return actor.updateAppIntegrationRecord(record);
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
      return actor.removeAppIntegrationRecord(id);
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
      return actor.addWebhookIntegrationRecord(webhookUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppIntegrations'] });
    },
  });
}

// Funnel Partner hooks
export function useGetMerchantFunnelPartner() {
  const { actor, isFetching } = useActor();

  return useQuery<FunnelPartner>({
    queryKey: ['merchantFunnelPartner'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMerchantFunnelPartner();
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
      return actor.setMerchantFunnelPartner(partnerName, partnerLink);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchantFunnelPartner'] });
    },
  });
}

// Startup Program hooks for user-specific data
export function useGetUserLessons(userPrincipal: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['userLessons', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const data = await actor.getStartupProgramData(userPrincipal);
      return data?.educationalContent.lessons || [];
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useCompleteLesson() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lessonId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeLesson(lessonId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLessons'] });
    },
  });
}

export function useGetUserVirtualMeetings(userPrincipal: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<VirtualMeeting[]>({
    queryKey: ['userVirtualMeetings', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const data = await actor.getStartupProgramData(userPrincipal);
      return data?.educationalContent.virtualMeetings || [];
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useGetUserActivities(userPrincipal: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Activity[]>({
    queryKey: ['userActivities', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return [];
      const data = await actor.getStartupProgramData(userPrincipal);
      return data?.educationalContent.activities || [];
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useCompleteActivity() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activityId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeActivity(activityId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userActivities'] });
    },
  });
}

export function useGetUserBusinessCredit(userPrincipal: Principal | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<BusinessCreditData | null>({
    queryKey: ['userBusinessCredit', userPrincipal?.toString()],
    queryFn: async () => {
      if (!actor || !userPrincipal) return null;
      const data = await actor.getStartupProgramData(userPrincipal);
      return data?.businessCredit || null;
    },
    enabled: !!actor && !isFetching && !!userPrincipal,
  });
}

export function useUpdateBusinessVerificationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBusinessVerificationStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBusinessCredit'] });
    },
  });
}

export function useUpdateCreditBureauRegistrationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCreditBureauRegistrationStatus(status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userBusinessCredit'] });
    },
  });
}
