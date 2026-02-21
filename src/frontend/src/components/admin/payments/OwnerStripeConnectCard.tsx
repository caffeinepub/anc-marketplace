import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

export default function OwnerStripeConnectCard() {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStartOnboarding = () => {
    setIsLoading(true);
    console.log('Owner Stripe Connect onboarding - backend integration pending');
  };

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Owner Stripe Connect Account</CardTitle>
            <CardDescription>Connect your Stripe account to receive payouts</CardDescription>
          </div>
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Backend integration for Stripe Connect is pending. Owner account onboarding and payout functionality will be available once the backend implements the required HTTP outcalls and ledger system.
          </AlertDescription>
        </Alert>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Connect your Stripe account to enable:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Direct payouts to your bank account</li>
            <li>Transaction ledger tracking</li>
            <li>Automated fund transfers</li>
          </ul>
        </div>

        <Button
          onClick={handleStartOnboarding}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Starting Onboarding...
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Connect Stripe Account
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
