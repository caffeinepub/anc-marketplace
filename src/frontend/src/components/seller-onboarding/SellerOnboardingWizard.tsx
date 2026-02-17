import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Home, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { onboardingSteps, getStepIndex, getStepConfig } from './onboardingSteps';
import { useGetOnboarding, useSaveOnboarding } from '../../hooks/useSellerOnboarding';
import { SellerOnboardingStep } from '../../backend';

export default function SellerOnboardingWizard() {
  const navigate = useNavigate();
  const { data: savedProgress, isLoading: loadingProgress } = useGetOnboarding();
  const saveOnboarding = useSaveOnboarding();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<SellerOnboardingStep[]>([]);

  // Initialize from saved progress
  useEffect(() => {
    if (savedProgress) {
      const stepIndex = getStepIndex(savedProgress.currentStep);
      if (stepIndex >= 0) {
        setCurrentStepIndex(stepIndex);
      }
      setCompletedSteps(savedProgress.completedSteps);
    }
  }, [savedProgress]);

  const currentStep = onboardingSteps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / onboardingSteps.length) * 100;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === onboardingSteps.length - 1;

  const handleNext = async () => {
    if (!isLastStep) {
      const nextIndex = currentStepIndex + 1;
      const nextStep = onboardingSteps[nextIndex];

      // Mark current step as completed if not already
      const newCompletedSteps = completedSteps.includes(currentStep.id)
        ? completedSteps
        : [...completedSteps, currentStep.id];

      setCurrentStepIndex(nextIndex);
      setCompletedSteps(newCompletedSteps);

      // Save progress
      await saveOnboarding.mutateAsync({
        currentStep: nextStep.id,
        completedSteps: newCompletedSteps,
        timestamps: [[nextStep.id, BigInt(Date.now() * 1000000)]],
        lastUpdated: BigInt(Date.now() * 1000000),
        isCompleted: nextIndex === onboardingSteps.length - 1,
      });
    }
  };

  const handleBack = async () => {
    if (!isFirstStep) {
      const prevIndex = currentStepIndex - 1;
      const prevStep = onboardingSteps[prevIndex];

      setCurrentStepIndex(prevIndex);

      // Save progress
      await saveOnboarding.mutateAsync({
        currentStep: prevStep.id,
        completedSteps,
        timestamps: [[prevStep.id, BigInt(Date.now() * 1000000)]],
        lastUpdated: BigInt(Date.now() * 1000000),
        isCompleted: false,
      });
    }
  };

  const handleExit = () => {
    navigate({ to: '/' });
  };

  if (loadingProgress) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading onboarding progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Seller Onboarding</h1>
          <Button variant="ghost" onClick={handleExit}>
            <Home className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
        <p className="text-muted-foreground">
          Complete these steps to set up your seller account on ANC Marketplace
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Step {currentStepIndex + 1} of {onboardingSteps.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progressPercentage)}% Complete
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Step List Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {onboardingSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id);
                const isCurrent = index === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-2 p-2 rounded-md transition-colors ${
                      isCurrent ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isCurrent ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                  <CardDescription className="mt-2">{currentStep.description}</CardDescription>
                </div>
                {currentStep.isPlaceholder && (
                  <Badge variant="secondary">Coming Soon</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step Content */}
              {currentStepIndex === 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Welcome to ANC Marketplace!</h3>
                  <p className="text-muted-foreground">
                    Thank you for choosing ANC Marketplace to grow your business. This onboarding
                    process will guide you through setting up your seller account step by step.
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h4 className="font-semibold">What to expect:</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Business & Identity Verification:</strong> Provide your business
                          information and verify your identity for secure transactions.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Store Profile:</strong> Create your unique store profile with
                          branding, logo, and business details.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Integration & Setup:</strong> Connect your store to external
                          platforms and configure your storefront.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Marketing Tools:</strong> Set up promotional campaigns and
                          marketing integrations.
                        </span>
                      </li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You can save your progress at any time and return later. Let's get started!
                  </p>
                </div>
              )}

              {currentStep.isPlaceholder && (
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>Note:</strong> This step is currently under development and will be
                      available in a future update. You can continue through the wizard to see the
                      complete onboarding structure.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Planned Features:</h4>
                    <p className="text-sm text-muted-foreground">{currentStep.description}</p>
                  </div>
                </div>
              )}

              <Separator />

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isFirstStep || saveOnboarding.isPending}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={isLastStep || saveOnboarding.isPending}
                >
                  {saveOnboarding.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
