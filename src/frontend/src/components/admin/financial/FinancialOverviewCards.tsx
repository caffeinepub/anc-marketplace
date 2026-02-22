import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, CreditCard, PiggyBank, TrendingUp } from 'lucide-react';
import { useGetAllUsers, useGetAllTransactionHistory } from '../../../hooks/useQueries';

interface FinancialOverviewCardsProps {
  financialState: {
    availableFundsCents: bigint;
    creditAccount: {
      creditLimitCents: bigint;
      usedAmountCents: bigint;
    };
  };
}

export default function FinancialOverviewCards({ financialState }: FinancialOverviewCardsProps) {
  const { data: allUsers } = useGetAllUsers();
  const { data: transactions } = useGetAllTransactionHistory();

  // Calculate total deposited amounts from all user accounts
  const totalDepositedCents = React.useMemo(() => {
    if (!transactions) return 0n;
    
    return transactions.reduce((total, transaction) => {
      if (transaction.status === 'successful' && transaction.transactionType === 'deposit') {
        return total + transaction.amountCents;
      }
      return total;
    }, 0n);
  }, [transactions]);

  // Calculate deposit methods breakdown
  const depositMethodsBreakdown = React.useMemo(() => {
    if (!transactions) return { paypal: 0, stripe: 0, wire: 0, other: 0 };
    
    const breakdown = { paypal: 0, stripe: 0, wire: 0, other: 0 };
    
    transactions.forEach((transaction) => {
      if (transaction.status === 'successful' && transaction.transactionType === 'deposit') {
        const source = transaction.source.toLowerCase();
        if (source.includes('paypal')) {
          breakdown.paypal++;
        } else if (source.includes('stripe')) {
          breakdown.stripe++;
        } else if (source.includes('wire') || source.includes('transfer')) {
          breakdown.wire++;
        } else {
          breakdown.other++;
        }
      }
    });
    
    return breakdown;
  }, [transactions]);

  const formatCurrency = (cents: bigint) => {
    const dollars = Number(cents) / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars);
  };

  const availableFunds = formatCurrency(financialState.availableFundsCents);
  const creditLimit = formatCurrency(financialState.creditAccount.creditLimitCents);
  const creditUsed = formatCurrency(financialState.creditAccount.usedAmountCents);
  const creditAvailable = formatCurrency(
    financialState.creditAccount.creditLimitCents - financialState.creditAccount.usedAmountCents
  );
  const totalDeposited = formatCurrency(totalDepositedCents);

  const totalDepositCount = React.useMemo(() => {
    if (!transactions) return 0;
    return transactions.filter(t => t.status === 'successful' && t.transactionType === 'deposit').length;
  }, [transactions]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">{availableFunds}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Current balance in admin account
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposited</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{totalDeposited}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalDepositCount} successful deposit{totalDepositCount !== 1 ? 's' : ''}
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>PayPal:</span>
              <span className="font-medium">{depositMethodsBreakdown.paypal}</span>
            </div>
            <div className="flex justify-between">
              <span>Wire/Transfer:</span>
              <span className="font-medium">{depositMethodsBreakdown.wire}</span>
            </div>
            {depositMethodsBreakdown.stripe > 0 && (
              <div className="flex justify-between">
                <span>Stripe:</span>
                <span className="font-medium">{depositMethodsBreakdown.stripe}</span>
              </div>
            )}
            {depositMethodsBreakdown.other > 0 && (
              <div className="flex justify-between">
                <span>Other:</span>
                <span className="font-medium">{depositMethodsBreakdown.other}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Business Credit</CardTitle>
          <CreditCard className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{creditAvailable}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Available of {creditLimit} limit
          </p>
          <p className="text-xs text-muted-foreground">
            Used: {creditUsed}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Payroll Savings</CardTitle>
          <PiggyBank className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600">$0.00</div>
          <p className="text-xs text-muted-foreground mt-1">
            Reserved for employee payments
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
