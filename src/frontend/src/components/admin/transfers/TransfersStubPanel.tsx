import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftRight, AlertCircle, Loader2 } from 'lucide-react';

export default function TransfersStubPanel() {
  const [amount, setAmount] = React.useState('');
  const [currency, setCurrency] = React.useState('USD');
  const [reason, setReason] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleWithdrawal = async () => {
    if (!amount || !reason.trim()) {
      return;
    }

    setIsProcessing(true);
    console.log('Withdrawal request:', { amount, currency, reason });
    
    setTimeout(() => {
      setIsProcessing(false);
      setAmount('');
      setReason('');
    }, 1500);
  };

  const isFormValid = amount && parseFloat(amount) > 0 && reason.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Owner Withdrawals
        </CardTitle>
        <CardDescription>Transfer funds from your available balance to your bank account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Backend integration for Stripe payouts is pending. Real withdrawal functionality will be available once the backend implements the required payout methods and transaction ledger.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="withdrawal-amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="withdrawal-amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="withdrawal-currency">Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger id="withdrawal-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="withdrawal-reason">
            Reason <span className="text-destructive">*</span>
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

        <Button
          onClick={handleWithdrawal}
          disabled={!isFormValid || isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Withdrawal...
            </>
          ) : (
            'Request Withdrawal'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
