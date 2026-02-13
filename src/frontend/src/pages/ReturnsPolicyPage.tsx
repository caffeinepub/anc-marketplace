import React from 'react';
import PolicyDocument from '../components/policies/PolicyDocument';
import { POLICY_METADATA } from '../lib/policies';

export default function ReturnsPolicyPage() {
  return <PolicyDocument policy={POLICY_METADATA.returns} contentPath="/policies/returns-policy.md" />;
}
