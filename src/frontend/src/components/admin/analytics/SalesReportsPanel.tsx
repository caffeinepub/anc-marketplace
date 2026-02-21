import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, RefreshCw, AlertCircle, DollarSign, ShoppingCart, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAdminCenterAnalytics } from '../../../hooks/useQueries';
import SalesMetricsCards from './SalesMetricsCards';

export default function SalesReportsPanel() {
  const { data: analytics, isLoading, error, refetch } = useGetAdminCenterAnalytics();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const formatCurrency = (cents: bigint | number): string => {
    const dollars = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  };

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Sales Reports & Analytics
            </CardTitle>
            <CardDescription>Comprehensive marketplace sales performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Reports & Analytics
          </CardTitle>
          <CardDescription>Comprehensive marketplace sales performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Failed to load sales analytics. Please try again.</span>
              <Button variant="outline" size="sm" onClick={handleRefresh} className="ml-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Sales Reports & Analytics
          </CardTitle>
          <CardDescription>Comprehensive marketplace sales performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>No analytics data available.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <SalesMetricsCards analytics={analytics} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Sales Analytics
              </CardTitle>
              <CardDescription>In-depth performance metrics and trends</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                Average Transaction Amount
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(analytics.averageTransactionAmountCents)}
              </div>
              <p className="text-xs text-muted-foreground">Per successful transaction</p>
            </div>

            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                Success Rate
              </div>
              <div className="text-2xl font-bold">
                {analytics.totalTransactions > 0
                  ? formatPercentage(Number(analytics.successfulPayments) / Number(analytics.totalTransactions))
                  : '0.00%'}
              </div>
              <p className="text-xs text-muted-foreground">
                {Number(analytics.successfulPayments)} of {Number(analytics.totalTransactions)} transactions
              </p>
            </div>

            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <ShoppingCart className="h-4 w-4" />
                Failed to Success Ratio
              </div>
              <div className="text-2xl font-bold">{analytics.failedToSuccessRatio.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {Number(analytics.failedPayments)} failed vs {Number(analytics.successfulPayments)} successful
              </p>
            </div>

            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                Attempts Per Success
              </div>
              <div className="text-2xl font-bold">{analytics.attemptsPerSuccessfulTransaction.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Average attempts needed for successful transaction</p>
            </div>
          </div>

          <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Analytics are calculated based on all-time transaction data. Time-based filtering
              (today, week, month) will be available in a future update.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
