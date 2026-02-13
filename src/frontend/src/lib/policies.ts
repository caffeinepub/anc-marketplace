export type PolicyIdentifier = 'privacy' | 'shipping' | 'returns' | 'terms';

export interface PolicyMetadata {
  identifier: PolicyIdentifier;
  displayName: string;
  route: string;
  version: string;
  lastUpdated: string;
}

export const POLICY_METADATA: Record<PolicyIdentifier, PolicyMetadata> = {
  privacy: {
    identifier: 'privacy',
    displayName: 'Privacy Policy',
    route: '/privacy-policy',
    version: '1.0',
    lastUpdated: '2026-02-13',
  },
  shipping: {
    identifier: 'shipping',
    displayName: 'Shipping Policy',
    route: '/shipping-policy',
    version: '1.0',
    lastUpdated: '2026-02-13',
  },
  returns: {
    identifier: 'returns',
    displayName: 'Returns Policy',
    route: '/returns-policy',
    version: '1.0',
    lastUpdated: '2026-02-13',
  },
  terms: {
    identifier: 'terms',
    displayName: 'Terms & Conditions',
    route: '/terms-and-conditions',
    version: '1.0',
    lastUpdated: '2026-02-13',
  },
};

export const ALL_POLICIES: PolicyMetadata[] = Object.values(POLICY_METADATA);
