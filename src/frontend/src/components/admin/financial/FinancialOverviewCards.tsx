import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, TrendingUp, PiggyBank } from 'lucide-react';
import { AdminFinancialState } from '../../../hooks/useQueries';

interface FinancialOverviewCardsProps {
  financialState: AdminFinancialState;
}

export default function FinancialOverviewCards({ financialState }: FinancialOverviewCardsProps) {
  const formatCurrency = (cents: bigint): string => {
    const dollars = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars);
  };

  const availableCredit = Number(financialState.creditAccount.creditLimitCents) - Number(financialState.creditAccount.usedAmountCents);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Owner Available Funds */}
      <Card className="border-emerald-200 dark:border-emerald-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <DollarSign className="h-5 w-5" />
            Available Funds
          </CardTitle>
          <CardDescription>Your current available balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(financialState.availableFundsCents)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Available for withdrawal or business use</p>
          </div>
        </CardContent>
      </Card>

      {/* Business Credit Account */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <CreditCard className="h-5 w-5" />
            Business Credit
          </CardTitle>
          <CardDescription>Your business line of credit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Credit Available</p>
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(financialState.creditAccount.creditLimitCents)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credit Used</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {formatCurrency(financialState.creditAccount.usedAmountCents)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll Savings */}
      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <PiggyBank className="h-5 w-5" />
            Payroll Savings
          </CardTitle>
          <CardDescription>Reserved for employee payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(financialState.payrollSavingsCents)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">Allocated for payroll expenses</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
