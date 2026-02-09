import { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useRegisterUserWithPaidPlan, useSaveStoreBuilderConfig } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const registerUser = useRegisterUserWithPaidPlan();
  const saveStoreBuilderConfig = useSaveStoreBuilderConfig();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');
        const planType = urlParams.get('plan');

        if (!sessionId) {
          setError('No session ID found');
          setProcessing(false);
          return;
        }

        if (planType === 'store-builder') {
          await saveStoreBuilderConfig.mutateAsync({
            subscriptionActive: true,
            selectedTemplateId: null,
            domainPurchaseLink: null,
            customization: {
              brandName: '',
              tagline: '',
              primaryColor: '#3B82F6',
              assets: [],
            },
          });
          setTimeout(() => navigate({ to: '/store-builder' }), 2000);
        } else if (planType === 'startup' || planType === 'b2b') {
          const roleVariant = planType === 'startup' ? { __kind__: 'startUpMember' as const } : { __kind__: 'b2bMember' as const };
          
          await registerUser.mutateAsync({
            email: urlParams.get('email') || '',
            fullName: urlParams.get('name') || '',
            role: roleVariant,
            stripeSessionId: sessionId,
          });

          const redirectPath = planType === 'startup' ? '/startup-dashboard' : '/b2b-dashboard';
          setTimeout(() => navigate({ to: redirectPath }), 2000);
        } else {
          setTimeout(() => navigate({ to: '/' }), 2000);
        }

        setProcessing(false);
      } catch (err: any) {
        setError(err.message || 'Failed to process payment');
        setProcessing(false);
      }
    };

    processPayment();
  }, [navigate, registerUser, saveStoreBuilderConfig]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              {processing ? (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              ) : error ? (
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-destructive text-xl">✕</span>
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
              <CardTitle>
                {processing ? 'Processing Payment...' : error ? 'Payment Error' : 'Payment Successful!'}
              </CardTitle>
            </div>
            <CardDescription>
              {processing
                ? 'Please wait while we process your payment and set up your account.'
                : error
                ? error
                : 'Your payment has been processed successfully. Redirecting you to your dashboard...'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!processing && !error && (
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Payment confirmed</p>
                <p>✓ Account activated</p>
                <p>✓ Preparing your dashboard...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
