import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingCart, TrendingUp, AlertTriangle, Clock } from 'lucide-react';
import type { AdminCenterAnalytics } from '../../../backend';

interface SalesMetricsCardsProps {
  analytics: AdminCenterAnalytics;
}

export default function SalesMetricsCards({ analytics }: SalesMetricsCardsProps) {
  const formatCurrency = (cents: bigint | number): string => {
    const dollars = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  };

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(analytics.totalRevenueCents),
      icon: DollarSign,
      description: 'All-time successful transactions',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950',
    },
    {
      title: 'Total Sales',
      value: Number(analytics.successfulPayments).toString(),
      icon: ShoppingCart,
      description: 'Completed transactions',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
    },
    {
      title: 'Pending Payments',
      value: Number(analytics.pendingPayments).toString(),
      icon: Clock,
      description: 'Awaiting completion',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
    },
    {
      title: 'Failed Payments',
      value: Number(analytics.failedPayments).toString(),
      icon: AlertTriangle,
      description: 'Unsuccessful transactions',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
    {
      title: 'Total Transactions',
      value: Number(analytics.totalTransactions).toString(),
      icon: TrendingUp,
      description: 'All payment attempts',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
