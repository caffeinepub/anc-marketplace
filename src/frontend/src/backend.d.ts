import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CreditAccount {
    creditLimitCents: bigint;
    usedAmountCents: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface SellerPayoutTransferRecord {
    id: string;
    status: PayoutTransferStatus;
    sellerPrincipal: Principal;
    createdAt: bigint;
    errorMessage?: string;
    amountCents: bigint;
    processedAt?: bigint;
    payoutAccount: string;
}
export interface AdminPageSectionStatus {
    status: Variant_completed_comingSoon_inProgress;
    section: AdminPageSection;
    details?: AdminPageStatusDetails;
}
export interface SellerOnboardingProgress {
    isCompleted: boolean;
    lastUpdated: bigint;
    timestamps: Array<[SellerOnboardingStep, bigint]>;
    currentStep: SellerOnboardingStep;
    completedSteps: Array<SellerOnboardingStep>;
}
export interface SellerPayoutProfile {
    sellerPrincipal: Principal;
    createdAt: bigint;
    lastUpdated: bigint;
    designatedPayoutAccount: string;
    internalBalanceCents: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface SellerEarningsSummary {
    totalOrders: bigint;
    totalEarnings: bigint;
    totalShippingCosts: bigint;
}
export interface AdminDashboardData {
    adminSections: Array<AdminPageSectionStatus>;
    marketplaceRoadmap: Array<MarketplaceRoadmap>;
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
export interface UserRoleSummary {
    guestCount: bigint;
    adminCount: bigint;
    userCount: bigint;
}
export interface AdminPageStatusDetails {
    version: string;
    notes: string;
}
export interface UserWithRole {
    principal: Principal;
    profile: UserProfile;
    systemRole: UserRole__1;
}
export interface MarketplaceRoadmap {
    progressPercentage: bigint;
    name: string;
    completed: boolean;
    lastUpdated: bigint;
    roadmapId: string;
    notes: string;
}
export interface EcomOrder {
    status: OrderStatus;
    sellerPrincipal?: Principal;
    shippingCostCents: bigint;
    customerPrincipal?: Principal;
    orderId: string;
    totalAmount: bigint;
    products: Array<string>;
}
export interface AdminCenterAnalytics {
    pendingPayments: bigint;
    averageTransactionAmountCents: number;
    failedToSuccessRatio: number;
    failedPayments: bigint;
    successfulPayments: bigint;
    attemptsPerSuccessfulTransaction: number;
    totalTransactions: bigint;
    totalRevenueCents: bigint;
}
export interface http_header {
    value: string;
    name: string;
}
export interface TransactionRecord {
    id: string;
    status: Variant_successful_failed;
    transactionType: Variant_creditFunding_deposit;
    source: string;
    date: string;
    amountCents: bigint;
    transactionId: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface RoleApplication {
    status: RoleApplicationStatus;
    applicant: Principal;
    requestedRole: UserRole;
    applicationDate: bigint;
    reason: string;
}
export interface AssistantKnowledgeEntry {
    id: string;
    question: string;
    isBusinessOps: boolean;
    usageCount: bigint;
    lastUpdated: bigint;
    answer: string;
    isActive: boolean;
    category: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface AdminFinancialState {
    creditAccount: CreditAccount;
    availableFundsCents: bigint;
}
export interface UserProfile {
    accountCreated: bigint;
    fullName: string;
    email: string;
    subscriptionId?: string;
    activeRole: UserRole;
}
export enum AdminPageSection {
    b2b = "b2b",
    marketplace = "marketplace",
    startups = "startups",
    assistants = "assistants",
    businessDetails = "businessDetails",
    affiliate = "affiliate",
    funding = "funding"
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    inProgress = "inProgress"
}
export enum PayoutTransferStatus {
    pending = "pending",
    processed = "processed",
    failed = "failed"
}
export enum RoleApplicationStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum SellerOnboardingStep {
    marketing = "marketing",
    termsAndConditions = "termsAndConditions",
    signup = "signup",
    storeSetup = "storeSetup",
    websiteIntegration = "websiteIntegration",
    companyDetails = "companyDetails"
}
export enum TimeFrame {
    today = "today",
    thisWeek = "thisWeek",
    allTime = "allTime",
    thisMonth = "thisMonth"
}
export enum UserRole {
    admin = "admin",
    customer = "customer",
    seller = "seller",
    employee = "employee",
    marketer = "marketer",
    guest = "guest",
    business = "business"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_completed_comingSoon_inProgress {
    completed = "completed",
    comingSoon = "comingSoon",
    inProgress = "inProgress"
}
export enum Variant_creditFunding_deposit {
    creditFunding = "creditFunding",
    deposit = "deposit"
}
export enum Variant_successful_failed {
    successful = "successful",
    failed = "failed"
}
export interface backendInterface {
    addKnowledgeEntry(entry: AssistantKnowledgeEntry): Promise<void>;
    approveRoleApplication(applicant: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignRole(user: Principal, role: UserRole__1): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createPayoutTransfer(amountCents: bigint): Promise<string>;
    deleteKnowledgeEntry(entryId: string): Promise<void>;
    getAdminCenterAnalytics(): Promise<AdminCenterAnalytics>;
    getAdminDashboardData(): Promise<AdminDashboardData>;
    getAdminFinancialState(): Promise<AdminFinancialState>;
    getAllOrders(): Promise<Array<EcomOrder>>;
    getAllPayoutTransfers(): Promise<Array<SellerPayoutTransferRecord>>;
    getAllSellerPayoutProfiles(): Promise<Array<SellerPayoutProfile>>;
    getAllTransactionHistory(): Promise<Array<TransactionRecord>>;
    getAllUsers(): Promise<Array<UserWithRole>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getCustomerOrders(): Promise<Array<EcomOrder>>;
    getKnowledgeBase(): Promise<Array<AssistantKnowledgeEntry>>;
    getOnboarding(): Promise<SellerOnboardingProgress | null>;
    getOwnerEmail(): Promise<string>;
    getPendingRoleApplications(): Promise<Array<RoleApplication>>;
    getSellerEarningsSummary(timeFrame: TimeFrame): Promise<SellerEarningsSummary>;
    getSellerOrders(): Promise<Array<EcomOrder>>;
    getSellerPayoutProfile(): Promise<SellerPayoutProfile | null>;
    getSellerPayoutTransfers(): Promise<Array<SellerPayoutTransferRecord>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTransactionRecordById(transactionId: string): Promise<TransactionRecord | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRoleSummary(): Promise<UserRoleSummary>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerOwnerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    processPayoutTransfer(transferId: string, success: boolean, errorMessage: string | null): Promise<void>;
    rejectRoleApplication(applicant: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveOnboarding(wizardState: SellerOnboardingProgress): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitRoleApplication(requestedRole: UserRole, reason: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAdminDashboardData(): Promise<void>;
    updateAdminFinancialState(newState: AdminFinancialState): Promise<void>;
    updateKnowledgeEntry(entry: AssistantKnowledgeEntry): Promise<void>;
    updateSellerPayoutProfile(profile: SellerPayoutProfile): Promise<void>;
}
