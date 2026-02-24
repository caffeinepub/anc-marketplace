import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, CheckCircle2, AlertCircle, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { useStripePayout } from '../../../hooks/useStripePayout';

// Available balance: $72,025.00 in cents
const AVAILABLE_BALANCE_CENTS = 7_202_500;

export default function TransfersStubPanel() {
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState('usd');
  const [reason, setReason] = React.useState('');

  const stripePayout = useStripePayout();

  const formatCurrency = (cents: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);

  const amountCents = Math.round(parseFloat(amount || '0') * 100);
  const exceedsBalance = amountCents > AVAILABLE_BALANCE_CENTS;
  const isFormValid =
    amount &&
    parseFloat(amount) > 0 &&
    !exceedsBalance &&
    reason.trim().length > 0;

  const handleWithdrawal = async () => {
    if (!isFormValid) return;

    try {
      const result = await stripePayout.mutateAsync({
        amountCents,
        currency,
        description: reason.trim(),
      });

      toast.success('Withdrawal Submitted', {
        description: `Payout of ${formatCurrency(amountCents)} initiated. Stripe ID: ${result.payout.id}`,
      });

      setAmount('');
      setReason('');
    } catch (error: any) {
      toast.error('Withdrawal Failed', {
        description: error?.message || 'An error occurred while processing the withdrawal.',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5" />
              Owner Withdrawals
            </CardTitle>
            <CardDescription>Transfer funds from your available balance to your bank account via Stripe</CardDescription>
          </div>
          <Badge variant="default" className="bg-emerald-600">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Live Stripe
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Display */}
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Available Balance</span>
            </div>
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300">
              {formatCurrency(AVAILABLE_BALANCE_CENTS)}
            </span>
          </div>
        </div>

        {/* Amount Field */}
        <div className="space-y-2">
          <Label htmlFor="withdrawal-amount">
            Withdrawal Amount <span className="text-destructive">*</span>
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="withdrawal-amount"
              type="number"
              step="0.01"
              min="0.01"
              max={AVAILABLE_BALANCE_CENTS / 100}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7"
            />
          </div>
          {exceedsBalance && (
            <p className="text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              Amount exceeds available balance of {formatCurrency(AVAILABLE_BALANCE_CENTS)}
            </p>
          )}
        </div>

        {/* Currency Field */}
        <div className="space-y-2">
          <Label htmlFor="withdrawal-currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="withdrawal-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD – US Dollar</SelectItem>
              <SelectItem value="cad">CAD – Canadian Dollar</SelectItem>
              <SelectItem value="gbp">GBP – British Pound</SelectItem>
              <SelectItem value="eur">EUR – Euro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reason Field */}
        <div className="space-y-2">
          <Label htmlFor="withdrawal-reason">
            Reason / Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="withdrawal-reason"
            placeholder="Enter the reason for this withdrawal (required for audit trail)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            A reason is required for all outgoing transfers to maintain a complete audit trail.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleWithdrawal}
          disabled={!isFormValid || stripePayout.isPending}
          className="w-full"
        >
          {stripePayout.isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Withdrawal via Stripe...
            </>
          ) : (
            <>
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Request Withdrawal {amount && !exceedsBalance && parseFloat(amount) > 0
                ? `(${formatCurrency(amountCents)})`
                : ''}
            </>
          )}
        </Button>

        {stripePayout.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(stripePayout.error as any)?.message || 'Failed to process withdrawal. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        <p className="text-xs text-muted-foreground text-center">
          Withdrawals are processed via Stripe Payouts. Funds typically arrive within 1–2 business days.
        </p>
      </CardContent>
    </Card>
  );
}
