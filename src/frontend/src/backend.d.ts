import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface BusinessCreditCardApplication {
    id: string;
    sellerPrincipal: Principal;
    submissionTimestamp: bigint;
    businessName: string;
    approvalTimestamp?: bigint;
    applicationStatus: CreditCardApplicationStatus;
    rejectionTimestamp?: bigint;
    reviewTimestamp?: bigint;
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
export interface PolicySignatureRecord {
    signerName: string;
    signature: string;
    policyVersion: string;
    policyIdentifier: PolicyIdentifier;
    timestamp: bigint;
}
export interface UnansweredQuestion {
    id: string;
    question: string;
    creationTime: bigint;
    interactionCount: bigint;
    categorySuggestion: string;
}
export interface AdminPageSectionStatus {
    status: Variant_completed_comingSoon_inProgress;
    section: AdminPageSection;
    details?: AdminPageStatusDetails;
}
export interface SellerPayoutProfile {
    sellerPrincipal: Principal;
    createdAt: bigint;
    lastUpdated: bigint;
    designatedPayoutAccount: string;
    internalBalanceCents: bigint;
}
export interface AccountAssignment {
    sellerPrincipal: Principal;
    active: boolean;
    createdAt: bigint;
    accountNumber: string;
}
export interface BusinessDebitCardRequest {
    id: string;
    sellerPrincipal: Principal;
    submissionTimestamp: bigint;
    businessName: string;
    approvalTimestamp?: bigint;
    rejectionTimestamp?: bigint;
    requestStatus: DebitCardRequestStatus;
    reviewTimestamp?: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface AdminDashboardData {
    adminSections: Array<AdminPageSectionStatus>;
    marketplaceRoadmap: Array<MarketplaceRoadmap>;
}
export interface AdminPageStatusDetails {
    version: string;
    notes: string;
}
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
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
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
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
export interface FunnelPartner {
    partnerName: string;
    signupLink: string;
    profileLink: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
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
export enum AdminPageSection {
    b2b = "b2b",
    marketplace = "marketplace",
    startups = "startups",
    assistants = "assistants",
    businessDetails = "businessDetails",
    affiliate = "affiliate",
    funding = "funding"
}
export enum DebitCardRequestStatus {
    submitted = "submitted",
    approved = "approved",
    rejected = "rejected",
    under_review = "under_review",
    draft = "draft"
}
export enum PayoutTransferStatus {
    pending = "pending",
    processed = "processed",
    failed = "failed"
}
export enum PolicyIdentifier {
    terms = "terms",
    shipping = "shipping",
    privacy = "privacy",
    marketplaceWide = "marketplaceWide",
    returns = "returns"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_completed_comingSoon_inProgress {
    completed = "completed",
    comingSoon = "comingSoon",
    inProgress = "inProgress"
}
export interface backendInterface {
    addKnowledgeEntry(entry: AssistantKnowledgeEntry): Promise<void>;
    askAssistant(question: string, category: string): Promise<string | null>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createOrGetAccountNumber(): Promise<AccountAssignment>;
    createOrUpdatePayoutProfile(payoutAccount: string): Promise<SellerPayoutProfile>;
    getAccountNumber(): Promise<string | null>;
    getActiveKnowledgeByCategory(category: string): Promise<Array<AssistantKnowledgeEntry>>;
    getAdminDashboardData(): Promise<AdminDashboardData>;
    getAssistantKnowledgeBase(): Promise<Array<AssistantKnowledgeEntry>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFunnelPartner(): Promise<FunnelPartner>;
    getPayoutProfile(): Promise<SellerPayoutProfile | null>;
    getSignatureByPolicy(policyIdentifier: PolicyIdentifier): Promise<PolicySignatureRecord | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUnansweredQuestions(): Promise<Array<UnansweredQuestion>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRoleSummary(): Promise<UserRoleSummary>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordCredit(amountCents: bigint): Promise<void>;
    recordPayoutTransfer(amountCents: bigint, payoutAccount: string): Promise<SellerPayoutTransferRecord>;
    requestBusinessDebitCard(businessName: string): Promise<BusinessDebitCardRequest>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setOwnerPrincipal(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    signPolicy(policyRecord: PolicySignatureRecord): Promise<void>;
    submitBusinessCreditCardApplication(businessName: string): Promise<BusinessCreditCardApplication>;
    submitBusinessOpsQuestion(question: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAdminDashboardData(): Promise<void>;
    updateFunnelPartner(partner: FunnelPartner): Promise<void>;
    updateKnowledgeEntry(id: string, newAnswer: string): Promise<void>;
    updateMarketplaceRoadmap(): Promise<void>;
    verifyPolicySignature(policyIdentifier: PolicyIdentifier, policyVersion: string): Promise<boolean>;
}
