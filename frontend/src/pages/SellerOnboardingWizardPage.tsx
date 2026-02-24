import React from 'react';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';
import SellerOnboardingWizard from '../components/seller-onboarding/SellerOnboardingWizard';

export default function SellerOnboardingWizardPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <SellerOnboardingWizard />
    </RequireAuthenticatedRegisteredUser>
  );
}
