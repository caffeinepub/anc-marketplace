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
export interface AdminPageStatusDetails {
    version: string;
    notes: string;
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
export interface MarketplaceRoadmap {
    progressPercentage: bigint;
    name: string;
    completed: boolean;
    lastUpdated: bigint;
    roadmapId: string;
    notes: string;
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
    approveRoleApplication(applicant: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignRole(user: Principal, role: UserRole__1): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAdminDashboardData(): Promise<AdminDashboardData>;
    getAdminFinancialState(): Promise<AdminFinancialState>;
    getAllTransactionHistory(): Promise<Array<TransactionRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getOnboarding(): Promise<SellerOnboardingProgress | null>;
    getPendingRoleApplications(): Promise<Array<RoleApplication>>;
    getSellerEarningsSummary(timeFrame: TimeFrame): Promise<SellerEarningsSummary>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTransactionRecordById(transactionId: string): Promise<TransactionRecord | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRoleSummary(): Promise<UserRoleSummary>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isCallerOwnerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    rejectRoleApplication(applicant: Principal): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveOnboarding(wizardState: SellerOnboardingProgress): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitRoleApplication(requestedRole: UserRole, reason: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAdminDashboardData(): Promise<void>;
    updateAdminFinancialState(newState: AdminFinancialState): Promise<void>;
}
