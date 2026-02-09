import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useRegisterUserWithPaidPlan, useUpdateStoreBuilderConfig } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader } from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const registerUser = useRegisterUserWithPaidPlan();
  const updateStoreBuilder = useUpdateStoreBuilderConfig();
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = (search as any)?.session_id;
      const plan = (search as any)?.plan;

      if (!sessionId) {
        setError('No session ID found');
        setProcessing(false);
        return;
      }

      try {
        if (plan === 'storeBuilder') {
          await updateStoreBuilder.mutateAsync({
            subscriptionActive: true,
            selectedTemplateId: null,
            customization: {
              brandName: '',
              tagline: '',
              primaryColor: '#000000',
              assets: [],
            },
            domainPurchaseLink: null,
          });
          toast.success('Store Builder subscription activated!');
          setTimeout(() => navigate({ to: '/store-builder' }), 2000);
        } else {
          setError('Unknown plan type');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to process payment');
        toast.error('Payment processing failed');
      } finally {
        setProcessing(false);
      }
    };

    processPayment();
  }, [search, registerUser, updateStoreBuilder, navigate]);

  if (processing) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardContent className="py-12 text-center">
            <Loader className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Payment Error</CardTitle>
            <CardDescription>There was an issue processing your payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="flex gap-2">
              <Button onClick={() => navigate({ to: '/store' })} variant="outline" className="flex-1">
                Back to Store
              </Button>
              <Button onClick={() => navigate({ to: '/' })} className="flex-1">
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardContent className="py-12 text-center">
          <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
          <p className="text-muted-foreground mb-6">
            Your payment has been processed successfully. Redirecting you now...
          </p>
          <Button onClick={() => navigate({ to: '/' })}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
