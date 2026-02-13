import React from 'react';
import PolicyDocument from '../components/policies/PolicyDocument';
import { POLICY_METADATA } from '../lib/policies';

export default function MarketplacePolicyPage() {
  return (
    <PolicyDocument
      policy={POLICY_METADATA.marketplaceWide}
      contentPath="/policies/marketplace-policy.md"
    />
  );
}
