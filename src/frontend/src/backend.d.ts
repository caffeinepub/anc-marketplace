import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export interface TransformationOutput {
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
export interface UnansweredQuestion {
    id: string;
    question: string;
    creationTime: bigint;
    interactionCount: bigint;
    categorySuggestion: string;
}
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface backendInterface {
    addAssistantKnowledgeEntry(entry: AssistantKnowledgeEntry): Promise<void>;
    askAssistant(question: string, category: string): Promise<string | null>;
    convertQuestionToKnowledgeEntry(questionId: string, answer: string, category: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAssistantKnowledgeBase(): Promise<Array<AssistantKnowledgeEntry>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUnansweredQuestions(): Promise<Array<UnansweredQuestion>>;
    initializeAccessControl(): Promise<void>;
    isStripeConfigured(): Promise<boolean>;
    markQuestionAsAnswered(questionId: string): Promise<void>;
    removeAssistantKnowledgeEntry(id: string): Promise<void>;
    setOwnerPrincipal(): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAssistantKnowledgeEntry(entry: AssistantKnowledgeEntry): Promise<void>;
}
