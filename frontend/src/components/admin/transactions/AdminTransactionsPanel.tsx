import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Receipt, RefreshCw, AlertCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllTransactionHistory, useGetPayoutTransactions } from '../../../hooks/useQueries';
import { Variant_creditFunding_deposit, Variant_successful_failed, Variant_pending_completed_failed } from '../../../backend';

export default function AdminTransactionsPanel() {
  const { data: transactions, isLoading: txLoading, error: txError, refetch: refetchTx } = useGetAllTransactionHistory();
  const { data: payouts, isLoading: payoutsLoading, error: payoutsError, refetch: refetchPayouts } = useGetPayoutTransactions();
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

  const formatDate = (dateString: string): string => {
    const [month, day, year] = dateString.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTimestamp = (nanoseconds: bigint): string => {
    const ms = Number(nanoseconds) / 1_000_000;
    return new Date(ms).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const decodeCurrency = (bytes: Uint8Array): string => {
    try {
      return new TextDecoder().decode(bytes).toUpperCase();
    } catch {
      return 'USD';
    }
  };

  const getStatusBadge = (status: Variant_successful_failed) => {
    if (status === Variant_successful_failed.successful) {
      return <Badge variant="default" className="bg-emerald-600">Successful</Badge>;
    } else if (status === Variant_successful_failed.failed) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const getPayoutStatusBadge = (status: Variant_pending_completed_failed) => {
    if (status === Variant_pending_completed_failed.completed) {
      return <Badge variant="default" className="bg-emerald-600">Completed</Badge>;
    } else if (status === Variant_pending_completed_failed.failed) {
      return <Badge variant="destructive">Failed</Badge>;
    }
    return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
  };

  const getTypeBadge = (type: Variant_creditFunding_deposit) => {
    if (type === Variant_creditFunding_deposit.deposit) {
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
          <ArrowDownLeft className="h-3 w-3 mr-1" />
          Deposit
        </Badge>
      );
    } else if (type === Variant_creditFunding_deposit.creditFunding) {
      return (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400">
          Credit Funding
        </Badge>
      );
    }
    return <Badge variant="outline">{type}</Badge>;
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchTx(), refetchPayouts()]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isLoading = txLoading || payoutsLoading;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Complete ledger of all financial transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Transaction History
            </CardTitle>
            <CardDescription>Complete ledger of all financial transactions and payouts</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="deposits">
          <TabsList className="mb-4">
            <TabsTrigger value="deposits">
              <ArrowDownLeft className="h-4 w-4 mr-1" />
              Deposits & Credits
              {transactions && transactions.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{transactions.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payouts">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              Payouts & Withdrawals
              {payouts && payouts.length > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">{payouts.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Deposits Tab */}
          <TabsContent value="deposits">
            {txError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Failed to load deposit history.</span>
                  <Button variant="outline" size="sm" onClick={() => refetchTx()} className="ml-4">
                    <RefreshCw className="h-4 w-4 mr-2" />Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : !transactions || transactions.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No deposit records found.</AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-xs">{txn.transactionId}</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{formatDate(txn.date)}</TableCell>
                        <TableCell>{getTypeBadge(txn.transactionType)}</TableCell>
                        <TableCell className="text-sm max-w-xs">
                          <div className="truncate" title={txn.source}>{txn.source}</div>
                        </TableCell>
                        <TableCell className="font-semibold whitespace-nowrap">{formatCurrency(txn.amountCents)}</TableCell>
                        <TableCell>{getStatusBadge(txn.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Payouts Tab */}
          <TabsContent value="payouts">
            {payoutsError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Failed to load payout history.</span>
                  <Button variant="outline" size="sm" onClick={() => refetchPayouts()} className="ml-4">
                    <RefreshCw className="h-4 w-4 mr-2" />Retry
                  </Button>
                </AlertDescription>
              </Alert>
            ) : !payouts || payouts.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No payout records found. Processed withdrawals will appear here.</AlertDescription>
              </Alert>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payouts.map((payout) => (
                      <TableRow key={payout.id}>
                        <TableCell className="font-mono text-xs">{payout.id.substring(0, 20)}…</TableCell>
                        <TableCell className="text-sm whitespace-nowrap">{formatTimestamp(payout.createdAt)}</TableCell>
                        <TableCell className="text-sm max-w-xs">
                          <div className="truncate" title={payout.description}>{payout.description}</div>
                        </TableCell>
                        <TableCell className="text-sm uppercase">{decodeCurrency(payout.currency)}</TableCell>
                        <TableCell className="font-semibold whitespace-nowrap text-destructive">
                          -{formatCurrency(payout.amount)}
                        </TableCell>
                        <TableCell>{getPayoutStatusBadge(payout.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
