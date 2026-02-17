import { SellerOnboardingStep } from '../../backend';

export interface OnboardingStepConfig {
  id: SellerOnboardingStep;
  title: string;
  description: string;
  isPlaceholder: boolean;
}

export const onboardingSteps: OnboardingStepConfig[] = [
  {
    id: SellerOnboardingStep.signup,
    title: 'Introduction',
    description: 'Welcome to ANC Marketplace seller onboarding. Learn what to expect in the process.',
    isPlaceholder: false,
  },
  {
    id: SellerOnboardingStep.companyDetails,
    title: 'Business & Identity Verification',
    description: 'Provide your business information and verify your identity (coming next).',
    isPlaceholder: true,
  },
  {
    id: SellerOnboardingStep.termsAndConditions,
    title: 'Store Profile',
    description: 'Create your store profile with name, description, and branding (coming soon).',
    isPlaceholder: true,
  },
  {
    id: SellerOnboardingStep.websiteIntegration,
    title: 'Website Integration',
    description: 'Connect your store to external platforms and tools (future step).',
    isPlaceholder: true,
  },
  {
    id: SellerOnboardingStep.storeSetup,
    title: 'Store Setup',
    description: 'Configure your storefront and choose templates (future step).',
    isPlaceholder: true,
  },
  {
    id: SellerOnboardingStep.marketing,
    title: 'Marketing',
    description: 'Set up marketing tools and promotional campaigns (future step).',
    isPlaceholder: true,
  },
];

export function getStepIndex(step: SellerOnboardingStep): number {
  return onboardingSteps.findIndex((s) => s.id === step);
}

export function getStepConfig(step: SellerOnboardingStep): OnboardingStepConfig | undefined {
  return onboardingSteps.find((s) => s.id === step);
}
