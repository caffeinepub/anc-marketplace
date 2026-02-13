import React from 'react';
import PolicyDocument from '../components/policies/PolicyDocument';
import { POLICY_METADATA } from '../lib/policies';

export default function ShippingPolicyPage() {
  return <PolicyDocument policy={POLICY_METADATA.shipping} contentPath="/policies/shipping-policy.md" />;
}
