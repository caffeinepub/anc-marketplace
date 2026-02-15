import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeftRight, AlertCircle } from 'lucide-react';

export default function TransfersStubPanel() {
  const [transferType, setTransferType] = React.useState('deposit');
  const [amount, setAmount] = React.useState('');
  const [accountLast4, setAccountLast4] = React.useState('');

  const handleRecordTransfer = () => {
    console.log('Transfer recorded:', { transferType, amount, accountLast4 });
    // Backend integration pending
    setAmount('');
    setAccountLast4('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowLeftRight className="h-5 w-5" />
          Bank & Debit Card Transfers
        </CardTitle>
        <CardDescription>Record transfer intents to/from external accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Real bank transfers are not supported on the Internet Computer. This panel records transfer intents for tracking purposes only.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="transfer-type">Transfer Type</Label>
          <Select value={transferType} onValueChange={setTransferType}>
            <SelectTrigger id="transfer-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deposit">Deposit (From Bank/Card)</SelectItem>
              <SelectItem value="withdrawal">Withdrawal (To Bank/Card)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="transfer-amount">Amount (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <Input
              id="transfer-amount"
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
          <Label htmlFor="account-last4">Account/Card Last 4 Digits</Label>
          <Input
            id="account-last4"
            placeholder="1234"
            maxLength={4}
            value={accountLast4}
            onChange={(e) => setAccountLast4(e.target.value.replace(/\D/g, ''))}
          />
        </div>

        <Button
          onClick={handleRecordTransfer}
          disabled={!amount || !accountLast4}
          className="w-full"
        >
          Record Transfer Intent
        </Button>
      </CardContent>
    </Card>
  );
}
