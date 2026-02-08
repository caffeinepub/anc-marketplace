import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ShoppingCart {
    products: Array<string>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface EducationalContent {
    virtualMeetings: Array<VirtualMeeting>;
    activities: Array<Activity>;
    lessons: Array<Lesson>;
}
export interface DropshippingPartner {
    id: string;
    healthMetrics: {
        failedSyncs: bigint;
        successfulSyncs: bigint;
        uptimePercent: number;
        lastSyncTime?: bigint;
    };
    name: string;
    apiKey: string;
    apiUrl: string;
    connectionStatus: Variant_disconnected_connected;
}
export interface B2BService {
    id: string;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    updatedAt: bigint;
    category: string;
    pricingModel: string;
}
export interface Lesson {
    id: string;
    title: string;
    content: string;
    description: string;
    videoLink?: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface AppIntegration {
    id: string;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    updatedAt: bigint;
    apiCredentials: string;
    category: string;
}
export interface AppIntegrationRecord {
    id: string;
    status: Variant_active_inactive_error_syncing;
    name: string;
    createdAt: bigint;
    description: string;
    updatedAt: bigint;
    iconUrl: string;
    webhookUrl: string;
}
export interface UserWithRole {
    principal: Principal;
    profile: UserProfile;
    systemRole: UserRole;
}
export interface EcomOrder {
    status: OrderStatus;
    customerPrincipal?: Principal;
    orderId: string;
    totalAmount: bigint;
    products: Array<string>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Activity {
    id: string;
    title: string;
    isCompleted: boolean;
    description: string;
    resourceLink: string;
}
export interface StartupProgramData {
    businessCredit: BusinessCreditData;
    educationalContent: EducationalContent;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface FunnelPartner {
    partnerLink: string;
    partnerName: string;
}
export interface BusinessCreditData {
    completionPercentage: number;
    businessVerificationStatus: string;
    creditBureauRegistrationStatus: string;
}
export interface VirtualMeeting {
    id: string;
    title: string;
    scheduledTime: bigint;
    description: string;
    meetingLink: string;
}
export interface Product {
    id: string;
    inStock: bigint;
    name: string;
    description: string;
    image?: string;
    priceCents: bigint;
}
export interface UserProfile {
    accountCreated: bigint;
    fullName: string;
    email: string;
    subscriptionId?: string;
    activeRole: AccessRole;
}
export enum AccessRole {
    b2bMember = "b2bMember",
    startUpMember = "startUpMember",
    guest = "guest"
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_active_inactive_error_syncing {
    active = "active",
    inactive = "inactive",
    error = "error",
    syncing = "syncing"
}
export enum Variant_disconnected_connected {
    disconnected = "disconnected",
    connected = "connected"
}
export interface backendInterface {
    addActivity(activity: Activity): Promise<void>;
    addAppIntegration(integration: AppIntegration): Promise<void>;
    addAppIntegrationRecord(record: AppIntegrationRecord): Promise<void>;
    addB2BService(service: B2BService): Promise<void>;
    addDropshippingPartner(partner: DropshippingPartner): Promise<void>;
    addLesson(lesson: Lesson): Promise<void>;
    addOrUpdateProduct(product: Product): Promise<void>;
    addToCart(productId: string): Promise<void>;
    addVirtualMeeting(meeting: VirtualMeeting): Promise<void>;
    addWebhookIntegrationRecord(webhookUrl: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignUserAccessRole(userPrincipal: Principal, newRole: AccessRole): Promise<void>;
    checkoutCart(_stripeSessionId: string): Promise<string | null>;
    clearCart(): Promise<void>;
    completeActivity(activityId: string): Promise<void>;
    completeLesson(lessonId: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteActivity(activityId: string): Promise<void>;
    deleteAppIntegration(integrationId: string): Promise<void>;
    deleteB2BService(serviceId: string): Promise<void>;
    deleteDropshippingPartner(partnerId: string): Promise<void>;
    deleteLesson(lessonId: string): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    deleteVirtualMeeting(meetingId: string): Promise<void>;
    getAdminDashboardStats(): Promise<{
        cartCount: bigint;
        pendingOrderCount: bigint;
        productCount: bigint;
        appIntegrationCount: bigint;
        orderCount: bigint;
        b2bServiceCount: bigint;
        dropshippingPartnerCount: bigint;
        completedOrderCount: bigint;
        userCount: bigint;
    }>;
    getAllAppIntegrations(): Promise<Array<AppIntegrationRecord>>;
    getAppIntegration(integrationId: string): Promise<AppIntegration | null>;
    getAppIntegrationRecord(id: string): Promise<AppIntegrationRecord | null>;
    getB2BService(serviceId: string): Promise<B2BService | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<ShoppingCart | null>;
    getDropshippingPartner(partnerId: string): Promise<DropshippingPartner | null>;
    getMerchantFunnelPartner(): Promise<FunnelPartner>;
    getOrder(orderId: string): Promise<EcomOrder | null>;
    getPendingOrders(): Promise<Array<EcomOrder>>;
    getProduct(productId: string): Promise<Product | null>;
    getRoleSummary(): Promise<{
        guestCount: bigint;
        startupMemberCount: bigint;
        b2bMemberCount: bigint;
        adminCount: bigint;
        userCount: bigint;
    }>;
    getServiceFee(priceCents: bigint): Promise<bigint>;
    getServiceFeePercentage(): Promise<number>;
    getStartupProgramData(userPrincipal: Principal): Promise<StartupProgramData | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserOrders(): Promise<Array<EcomOrder>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isAuthenticated(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isOwner(): Promise<boolean>;
    isServiceFeeActive(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listAllOrders(): Promise<Array<EcomOrder>>;
    listAllUsers(): Promise<Array<UserProfile>>;
    listAllUsersWithRoles(): Promise<Array<UserWithRole>>;
    listAppIntegrations(): Promise<Array<AppIntegration>>;
    listB2BServices(): Promise<Array<B2BService>>;
    listDropshippingPartners(): Promise<Array<DropshippingPartner>>;
    listProductsByName(): Promise<Array<Product>>;
    listProductsByPrice(): Promise<Array<Product>>;
    registerUserWithPaidPlan(email: string, fullName: string, role: AccessRole, _stripeSessionId: string): Promise<void>;
    removeAppIntegrationRecord(id: string): Promise<void>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveStartupProgramData(startupData: StartupProgramData): Promise<void>;
    setMerchantFunnelPartner(partnerName: string, partnerLink: string): Promise<void>;
    setOwnerPrincipal(): Promise<void>;
    setServiceFeePercentage(percentage: number): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    toggleAppIntegrationStatus(integrationId: string, isActive: boolean): Promise<void>;
    toggleB2BServiceStatus(serviceId: string, isActive: boolean): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateActivity(activity: Activity): Promise<void>;
    updateAppIntegration(integration: AppIntegration): Promise<void>;
    updateAppIntegrationRecord(record: AppIntegrationRecord): Promise<void>;
    updateB2BService(service: B2BService): Promise<void>;
    updateBusinessVerificationStatus(status: string): Promise<void>;
    updateCreditBureauRegistrationStatus(status: string): Promise<void>;
    updateDropshippingPartner(partner: DropshippingPartner): Promise<void>;
    updateDropshippingPartnerHealthMetrics(partnerId: string, successfulSyncs: bigint, failedSyncs: bigint, lastSyncTime: bigint | null, uptimePercent: number): Promise<void>;
    updateLesson(lesson: Lesson): Promise<void>;
    updateOrderStatus(orderId: string, status: OrderStatus): Promise<void>;
    updateSubscriptionRole(userPrincipal: Principal, newRole: AccessRole): Promise<void>;
    updateVirtualMeeting(meeting: VirtualMeeting): Promise<void>;
}
