import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, AlertCircle, Loader2 } from 'lucide-react';
import { useIsStripeConfigured } from '../../../hooks/useQueries';
import { useCreateCheckoutSession } from '../../../hooks/useStripeCheckout';
import { PRICING } from '../../../lib/pricingCopy';

export default function AdminRevenueInflowPanel() {
  const { data: isStripeConfigured, isLoading: isCheckingStripe } = useIsStripeConfigured();
  const createCheckout = useCreateCheckoutSession();

  const handleChargeSaleFee = async () => {
    try {
      await createCheckout.mutateAsync([
        {
          productName: 'Marketplace Sale Service Fee',
          productDescription: 'Per-sale service fee for marketplace transaction',
          priceInCents: BigInt(PRICING.marketplace.perSaleFeeCents),
          quantity: BigInt(1),
          currency: 'usd',
        },
      ]);
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  const handleChargeBuilderFee = async () => {
    try {
      await createCheckout.mutateAsync([
        {
          productName: 'Store Builder Subscription',
          productDescription: PRICING.storeBuilder.description,
          priceInCents: BigInt(PRICING.storeBuilder.monthlyCents),
          quantity: BigInt(1),
          currency: 'usd',
        },
      ]);
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  if (isCheckingStripe) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading payment options...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isStripeConfigured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Collection
          </CardTitle>
          <CardDescription>Process marketplace fees and subscription charges</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Stripe must be configured before you can process revenue charges. Please configure Stripe in the Payments section above.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue Collection
        </CardTitle>
        <CardDescription>Process marketplace fees and subscription charges via Stripe</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Sale Service Fee</CardTitle>
              <CardDescription>Charge the {PRICING.marketplace.perSaleFee} per-sale marketplace fee</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleChargeSaleFee}
                disabled={createCheckout.isPending}
                className="w-full"
              >
                {createCheckout.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Charge {PRICING.marketplace.perSaleFee} Fee</>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base">Store Builder Subscription</CardTitle>
              <CardDescription>Charge the ${PRICING.storeBuilder.monthlyPrice}/month builder fee</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleChargeBuilderFee}
                disabled={createCheckout.isPending}
                className="w-full"
              >
                {createCheckout.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Charge ${PRICING.storeBuilder.monthlyPrice} Fee</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {createCheckout.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to create checkout session. Please try again or check your Stripe configuration.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
