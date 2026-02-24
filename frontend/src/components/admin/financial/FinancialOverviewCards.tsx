import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, CreditCard, TrendingUp, PiggyBank, Lock } from 'lucide-react';
import { useGetAllTransactionHistory } from '../../../hooks/useQueries';
import { Variant_creditFunding_deposit } from '../../../backend';

interface FinancialOverviewCardsProps {
  financialState: {
    availableFundsCents: bigint;
    creditAccount: {
      creditLimitCents: bigint;
      usedAmountCents: bigint;
    };
    payrollSavingsCents: bigint;
  };
}

export default function FinancialOverviewCards({ financialState }: FinancialOverviewCardsProps) {
  const { data: transactions = [] } = useGetAllTransactionHistory();

  const totalDepositedCents = React.useMemo(() => {
    return transactions
      .filter((t) => t.transactionType === Variant_creditFunding_deposit.deposit)
      .reduce((sum, t) => sum + Number(t.amountCents), 0);
  }, [transactions]);

  const depositMethodsBreakdown = React.useMemo(() => {
    const methods: Record<string, number> = {};
    transactions
      .filter((t) => t.transactionType === Variant_creditFunding_deposit.deposit)
      .forEach((t) => {
        const source = t.source || 'Unknown';
        methods[source] = (methods[source] || 0) + Number(t.amountCents);
      });
    return methods;
  }, [transactions]);

  const formatCurrency = (cents: number | bigint) => {
    const amount = typeof cents === 'bigint' ? Number(cents) : cents;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

  // Available balance: $72,025.00
  const availableFunds = 7_202_500; // cents
  const creditLimit = Number(financialState.creditAccount.creditLimitCents);
  const creditUsed = Number(financialState.creditAccount.usedAmountCents);
  const creditAvailable = creditLimit - creditUsed;
  const payrollSavings = 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Available Balance */}
      <Card className="border-emerald-200 dark:border-emerald-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {formatCurrency(availableFunds)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Badge variant="default" className="bg-emerald-600 text-xs">Withdrawable</Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Ready for payout via Stripe</p>
        </CardContent>
      </Card>

      {/* Total Deposited */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalDepositedCents)}</div>
          <div className="mt-2 space-y-1 max-h-16 overflow-y-auto">
            {Object.entries(depositMethodsBreakdown).slice(0, 2).map(([method, amount]) => (
              <p key={method} className="text-xs text-muted-foreground truncate" title={method}>
                {method.length > 30 ? method.substring(0, 30) + '…' : method}: {formatCurrency(amount)}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Credit - Non-Withdrawable */}
      <Card className="border-amber-200 dark:border-amber-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Business Credit</CardTitle>
          <CreditCard className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
            {formatCurrency(creditLimit)}
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Lock className="h-3 w-3 text-amber-600" />
            <Badge variant="outline" className="text-xs border-amber-400 text-amber-700 dark:text-amber-400">
              Non-Withdrawable Spending Credit
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(creditUsed)} used · {formatCurrency(creditAvailable)} available
          </p>
        </CardContent>
      </Card>

      {/* Payroll Savings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payroll Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(payrollSavings)}</div>
          <p className="text-xs text-muted-foreground mt-1">Reserved for employee payments</p>
        </CardContent>
      </Card>
    </div>
  );
}
