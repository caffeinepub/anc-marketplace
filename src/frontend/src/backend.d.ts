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
export interface MarketplaceRoadmap {
    progressPercentage: bigint;
    name: string;
    completed: boolean;
    lastUpdated: bigint;
    roadmapId: string;
    notes: string;
}
export interface AdminPageSectionStatus {
    status: Variant_completed_comingSoon_inProgress;
    section: AdminPageSection;
    details?: AdminPageStatusDetails;
}
export interface http_header {
    value: string;
    name: string;
}
export interface AssistantKnowledgeEntry {
    id: string;
    question: string;
    usageCount: bigint;
    lastUpdated: bigint;
    answer: string;
    isActive: boolean;
    category: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
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
export interface AdminPageStatusDetails {
    version: string;
    notes: string;
}
export interface UserRoleSummary {
    guestCount: bigint;
    adminCount: bigint;
    userCount: bigint;
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
    askAssistant(question: string, category: string): Promise<string | null>;
    assignRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAdminDashboardData(): Promise<AdminDashboardData>;
    getAssistantKnowledgeBase(): Promise<Array<AssistantKnowledgeEntry>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserRoleSummary(): Promise<UserRoleSummary>;
    initializeAccessControl(): Promise<void>;
    isStripeConfigured(): Promise<boolean>;
    setOwnerPrincipal(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAdminDashboardData(): Promise<void>;
    updateMarketplaceRoadmap(): Promise<void>;
}
