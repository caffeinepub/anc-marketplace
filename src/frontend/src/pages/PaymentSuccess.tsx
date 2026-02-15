import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import AdminConsoleLayout from '../components/admin/AdminConsoleLayout';

export default function PaymentSuccess() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Optional: Invalidate financial queries to refresh balances
    // This would require access to queryClient
  }, []);

  return (
    <AdminConsoleLayout
      title="Payment Successful"
      subtitle="Your payment has been processed successfully"
    >
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md w-full border-emerald-200 dark:border-emerald-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment has been processed and your account has been updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>The transaction has been recorded in your admin financial history.</p>
              <p className="mt-2">You can review the details in the Transactions section.</p>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/admin">Return to Admin Center</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/admin', search: { tab: 'transactions' } })}
                className="w-full"
              >
                View Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminConsoleLayout>
  );
}
