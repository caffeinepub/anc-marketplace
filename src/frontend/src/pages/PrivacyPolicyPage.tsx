import React from 'react';
import PolicyDocument from '../components/policies/PolicyDocument';
import { POLICY_METADATA } from '../lib/policies';

export default function PrivacyPolicyPage() {
  return <PolicyDocument policy={POLICY_METADATA.privacy} contentPath="/policies/privacy-policy.md" />;
}
