import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin, useGetAdminFinancialState } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, CreditCard, AlertCircle, TrendingUp } from 'lucide-react';

export default function AdminCenterPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: financialState, isLoading: isFinancialLoading, error: financialError } = useGetAdminFinancialState();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!identity && !isAdminLoading) {
      navigate({ to: '/' });
    }
  }, [identity, isAdminLoading, navigate]);

  // Show loading state
  if (isAdminLoading || !identity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-12 w-64 mb-6" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Access Denied: You do not have permission to view the Admin Center. Only administrators can access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (cents: bigint): string => {
    const dollars = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars);
  };

  // Calculate remaining credit
  const remainingCredit = financialState
    ? Number(financialState.creditAccount.creditLimitCents) - Number(financialState.creditAccount.usedAmountCents)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Center</h1>
        <p className="text-muted-foreground">Manage your business finances and access administrative tools</p>
      </div>

      {/* Financial Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Owner Available Funds */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Owner Available Funds
            </CardTitle>
            <CardDescription>Your current available balance from business transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isFinancialLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : financialError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load financial data. Please try again later.</AlertDescription>
              </Alert>
            ) : financialState ? (
              <div>
                <p className="text-4xl font-bold text-green-600">
                  {formatCurrency(financialState.availableFundsCents)}
                </p>
                <p className="text-sm text-muted-foreground mt-2">Available for withdrawal or business use</p>
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Business Credit Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Business Credit Account
            </CardTitle>
            <CardDescription>Your business line of credit details</CardDescription>
          </CardHeader>
          <CardContent>
            {isFinancialLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : financialError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Failed to load credit data. Please try again later.</AlertDescription>
              </Alert>
            ) : financialState ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Credit Limit</p>
                  <p className="text-2xl font-bold">{formatCurrency(financialState.creditAccount.creditLimitCents)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Outstanding Balance</p>
                  <p className="text-xl font-semibold text-orange-600">
                    {formatCurrency(financialState.creditAccount.usedAmountCents)}
                  </p>
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Available Credit
                  </p>
                  <p className="text-2xl font-bold text-blue-600">{formatCurrency(BigInt(remainingCredit))}</p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
