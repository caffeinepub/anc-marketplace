import React from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, AlertCircle } from 'lucide-react';
import AdminConsoleLayout from '../components/admin/AdminConsoleLayout';

export default function PaymentFailure() {
  return (
    <AdminConsoleLayout
      title="Payment Failed"
      subtitle="There was an issue processing your payment"
    >
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md w-full border-amber-200 dark:border-amber-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-3">
                <XCircle className="h-12 w-12 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription>
              Your payment could not be processed or was cancelled.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No charges were made to your account. You can try again or contact support if the issue persists.
              </AlertDescription>
            </Alert>

            <div className="text-sm text-muted-foreground text-center">
              <p>Common reasons for payment failure:</p>
              <ul className="list-disc list-inside mt-2 text-left">
                <li>Payment was cancelled by user</li>
                <li>Insufficient funds</li>
                <li>Card declined by issuer</li>
                <li>Network or connection issue</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/admin">Return to Admin Center</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link to="/admin">Try Again</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminConsoleLayout>
  );
}
