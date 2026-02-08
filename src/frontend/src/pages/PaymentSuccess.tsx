import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useRegisterUserWithPaidPlan } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { AccessRole } from '../backend';
import { toast } from 'sonner';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { plan?: string; email?: string; name?: string };
  const registerUser = useRegisterUserWithPaidPlan();
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const processPlanPurchase = async () => {
      if (search.plan && search.email && search.name && !processing) {
        setProcessing(true);
        try {
          const role = search.plan === 'startup' ? AccessRole.startUpMember : AccessRole.b2bMember;
          await registerUser.mutateAsync({
            email: search.email,
            fullName: search.name,
            role,
            stripeSessionId: 'session_' + Date.now(),
          });
          toast.success('Plan activated successfully!');
        } catch (error) {
          toast.error('Failed to activate plan');
        }
      }
    };

    processPlanPurchase();
  }, [search, registerUser, processing]);

  const handleContinue = () => {
    if (search.plan === 'startup') {
      navigate({ to: '/startup-dashboard' });
    } else if (search.plan === 'b2b') {
      navigate({ to: '/b2b-dashboard' });
    } else {
      navigate({ to: '/' });
    }
  };

  return (
    <div className="container py-12 flex items-center justify-center min-h-[600px]">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>Your payment has been processed successfully</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {search.plan && (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Plan Activated</p>
              <p className="font-semibold">{search.plan === 'startup' ? 'Startup Program' : 'B2B Services'}</p>
            </div>
          )}
          <p className="text-sm text-muted-foreground text-center">
            Thank you for your purchase. You now have access to your dashboard and all features.
          </p>
          <Button className="w-full" onClick={handleContinue}>
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
