// Frontend type definitions for types not exported by backend
export enum UserRole {
  admin = 'admin',
  user = 'user',
  guest = 'guest',
}

export type AccessRole = {
  __kind__: 'guest';
} | {
  __kind__: 'startUpMember';
} | {
  __kind__: 'b2bMember';
};

export interface UserProfile {
  email: string;
  fullName: string;
  activeRole: string;
  subscriptionId: string | null;
  accountCreated: bigint;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: bigint;
  image: string | null;
  inStock: bigint;
}

export interface EcomOrder {
  orderId: string;
  products: string[];
  totalAmount: bigint;
  status: OrderStatus;
  customerPrincipal: string | null;
}

export type OrderStatus = {
  __kind__: 'pending';
} | {
  __kind__: 'inProgress';
} | {
  __kind__: 'completed';
} | {
  __kind__: 'cancelled';
};

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  videoLink: string | null;
}

export interface VirtualMeeting {
  id: string;
  title: string;
  description: string;
  meetingLink: string;
  scheduledTime: bigint;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  resourceLink: string;
  isCompleted: boolean;
}

export interface BusinessCreditData {
  businessVerificationStatus: string;
  creditBureauRegistrationStatus: string;
  completionPercentage: number;
}

export interface EducationalContent {
  lessons: Lesson[];
  virtualMeetings: VirtualMeeting[];
  activities: Activity[];
}

export interface StartupProgramData {
  educationalContent: EducationalContent;
  businessCredit: BusinessCreditData;
}

export interface B2BService {
  id: string;
  name: string;
  category: string;
  description: string;
  pricingModel: string;
  isActive: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface DropshippingPartner {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  connectionStatus: Variant_disconnected_connected;
  healthMetrics: {
    successfulSyncs: bigint;
    failedSyncs: bigint;
    lastSyncTime: bigint | null;
    uptimePercent: number;
  };
}

export type Variant_disconnected_connected = {
  __kind__: 'connected';
} | {
  __kind__: 'disconnected';
};

export interface AppIntegration {
  id: string;
  name: string;
  category: string;
  description: string;
  apiCredentials: string;
  isActive: boolean;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface UserWithRole {
  principal: string;
  profile: UserProfile;
  systemRole: UserRole;
}

export interface AppIntegrationRecord {
  id: string;
  name: string;
  description: string;
  webhookUrl: string;
  iconUrl: string;
  status: Variant_active_inactive_error_syncing;
  createdAt: bigint;
  updatedAt: bigint;
}

export type Variant_active_inactive_error_syncing = {
  __kind__: 'active';
} | {
  __kind__: 'inactive';
} | {
  __kind__: 'error';
} | {
  __kind__: 'syncing';
};

export interface FunnelPartner {
  partnerName: string;
  partnerLink: string;
}

export interface StoreTemplate {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  type_: StoreTemplateType;
}

export type StoreTemplateType = {
  __kind__: 'ecommerce';
} | {
  __kind__: 'service';
};

export interface BrandingAsset {
  id: string;
  url: string;
  type_: AssetType;
}

export type AssetType = {
  __kind__: 'logo';
} | {
  __kind__: 'productImage';
} | {
  __kind__: 'banner';
} | {
  __kind__: 'icon';
} | {
  __kind__: 'document';
};

export interface StoreCustomization {
  brandName: string;
  tagline: string;
  primaryColor: string;
  assets: BrandingAsset[];
}

export interface StoreBuilderConfig {
  subscriptionActive: boolean;
  selectedTemplateId: string | null;
  customization: StoreCustomization;
  domainPurchaseLink: string | null;
}

// Helper functions for AccessRole
export const AccessRole = {
  guest: { __kind__: 'guest' as const },
  startUpMember: { __kind__: 'startUpMember' as const },
  b2bMember: { __kind__: 'b2bMember' as const },
};
