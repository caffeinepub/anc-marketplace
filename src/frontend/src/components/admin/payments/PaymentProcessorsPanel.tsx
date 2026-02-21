import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import StripeSetupCard from './StripeSetupCard';
import OwnerStripeConnectCard from './OwnerStripeConnectCard';

export default function PaymentProcessorsPanel() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Processors
          </CardTitle>
          <CardDescription>
            Configure payment processors for marketplace transactions and revenue collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <StripeSetupCard />
            <OwnerStripeConnectCard />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
