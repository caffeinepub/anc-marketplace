import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, TrendingUp, PiggyBank } from 'lucide-react';
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

  // Update available funds to display $72,025.00
  const availableFunds = 7_202_500; // $72,025.00 in cents
  const creditLimit = Number(financialState.creditAccount.creditLimitCents);
  const creditUsed = Number(financialState.creditAccount.usedAmountCents);
  const creditAvailable = creditLimit - creditUsed;
  const payrollSavings = 0; // $0.00 in cents

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(availableFunds)}</div>
          <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalDepositedCents)}</div>
          <div className="mt-2 space-y-1">
            {Object.entries(depositMethodsBreakdown).map(([method, amount]) => (
              <p key={method} className="text-xs text-muted-foreground">
                {method}: {formatCurrency(amount)}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Business Credit</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(creditAvailable)}</div>
          <p className="text-xs text-muted-foreground">
            {formatCurrency(creditUsed)} used of {formatCurrency(creditLimit)} limit
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payroll Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(payrollSavings)}</div>
          <p className="text-xs text-muted-foreground">Reserved for employee payments</p>
        </CardContent>
      </Card>
    </div>
  );
}
