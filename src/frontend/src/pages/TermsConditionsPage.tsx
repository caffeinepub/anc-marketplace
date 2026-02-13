import React from 'react';
import PolicyDocument from '../components/policies/PolicyDocument';
import { POLICY_METADATA } from '../lib/policies';

export default function TermsConditionsPage() {
  return <PolicyDocument policy={POLICY_METADATA.terms} contentPath="/policies/terms-and-conditions.md" />;
}
