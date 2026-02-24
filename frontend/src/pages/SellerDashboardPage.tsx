import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetSellerEarningsSummary } from '../hooks/useQueries';
import { TimeFrame } from '../types';
import { DollarSign, Package, TruckIcon, Loader2 } from 'lucide-react';
import RequireAuthenticatedRegisteredUser from '../components/auth/RequireAuthenticatedRegisteredUser';

function SellerDashboardContent() {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>(TimeFrame.allTime);
  const { data: summary, isLoading, isError, error } = useGetSellerEarningsSummary(timeFrame);

  const formatCurrency = (cents: bigint | number): string => {
    const amount = typeof cents === 'bigint' ? Number(cents) : cents;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  const formatNumber = (value: bigint | number): string => {
    const num = typeof value === 'bigint' ? Number(value) : value;
    return new Intl.NumberFormat('en-US').format(num);
  };

  const getTimeFrameLabel = (tf: TimeFrame): string => {
    switch (tf) {
      case TimeFrame.today:
        return 'Today';
      case TimeFrame.thisWeek:
        return 'This Week';
      case TimeFrame.thisMonth:
        return 'This Month';
      case TimeFrame.allTime:
        return 'All Time';
      default:
        return 'All Time';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Seller Dashboard</h1>
          <p className="text-slate-600">Track your sales performance and earnings</p>
        </div>

        {/* Time Frame Selector */}
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor="timeframe" className="text-sm font-medium text-slate-700">
            Time Period:
          </label>
          <Select
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value as TimeFrame)}
          >
            <SelectTrigger id="timeframe" className="w-48 bg-white">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-menu-border shadow-menu">
              <SelectItem value={TimeFrame.today} className="cursor-pointer focus:bg-menu-item-hover">
                Today
              </SelectItem>
              <SelectItem value={TimeFrame.thisWeek} className="cursor-pointer focus:bg-menu-item-hover">
                This Week
              </SelectItem>
              <SelectItem value={TimeFrame.thisMonth} className="cursor-pointer focus:bg-menu-item-hover">
                This Month
              </SelectItem>
              <SelectItem value={TimeFrame.allTime} className="cursor-pointer focus:bg-menu-item-hover">
                All Time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-slate-600">Loading dashboard data...</span>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <Card className="border-destructive bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
              <CardDescription>
                {error instanceof Error ? error.message : 'Failed to load seller earnings data'}
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Dashboard Metrics */}
        {!isLoading && !isError && summary && (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Total Earnings Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(summary.totalEarnings)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {getTimeFrameLabel(timeFrame)}
                </p>
              </CardContent>
            </Card>

            {/* Shipping Costs Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Shipping Costs
                </CardTitle>
                <TruckIcon className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {formatCurrency(summary.totalShippingCosts)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {getTimeFrameLabel(timeFrame)}
                </p>
              </CardContent>
            </Card>

            {/* Total Orders Card */}
            <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Total Orders
                </CardTitle>
                <Package className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {formatNumber(summary.totalOrders)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {getTimeFrameLabel(timeFrame)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Info Card */}
        {!isLoading && !isError && (
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">Dashboard Overview</CardTitle>
              <CardDescription className="text-blue-700">
                This dashboard displays your sales performance metrics. Use the time period selector above to view data for different time ranges.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-blue-800">
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Total Earnings:</strong> Revenue from completed orders</li>
                <li><strong>Shipping Costs:</strong> Total shipping charges collected</li>
                <li><strong>Total Orders:</strong> Number of completed orders</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <SellerDashboardContent />
    </RequireAuthenticatedRegisteredUser>
  );
}
