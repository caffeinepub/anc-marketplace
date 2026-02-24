import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, AlertCircle, Calendar } from 'lucide-react';

export default function EmployeePaymentsPanel() {
  const [manualPayee, setManualPayee] = React.useState('');
  const [manualAmount, setManualAmount] = React.useState('');
  const [manualNote, setManualNote] = React.useState('');

  const [scheduledPayee, setScheduledPayee] = React.useState('');
  const [scheduledAmount, setScheduledAmount] = React.useState('');
  const [scheduledCadence, setScheduledCadence] = React.useState('monthly');

  const handleManualPayment = () => {
    console.log('Manual payment:', { manualPayee, manualAmount, manualNote });
    // Backend integration pending
    setManualPayee('');
    setManualAmount('');
    setManualNote('');
  };

  const handleScheduledPayment = () => {
    console.log('Scheduled payment:', { scheduledPayee, scheduledAmount, scheduledCadence });
    // Backend integration pending
    setScheduledPayee('');
    setScheduledAmount('');
    setScheduledCadence('monthly');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Employee Payments
        </CardTitle>
        <CardDescription>Manage manual and scheduled employee payment records</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Employee payment tracking is simulated. Backend integration for payment processing is on the roadmap.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Manual Payments</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manual-payee">Payee Name</Label>
              <Input
                id="manual-payee"
                placeholder="Employee name"
                value={manualPayee}
                onChange={(e) => setManualPayee(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="manual-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-note">Note (Optional)</Label>
              <Textarea
                id="manual-note"
                placeholder="Payment description or memo"
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              onClick={handleManualPayment}
              disabled={!manualPayee || !manualAmount}
              className="w-full"
            >
              Record Manual Payment
            </Button>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled-payee">Payee Name</Label>
              <Input
                id="scheduled-payee"
                placeholder="Employee name"
                value={scheduledPayee}
                onChange={(e) => setScheduledPayee(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-amount">Amount (USD)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="scheduled-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={scheduledAmount}
                  onChange={(e) => setScheduledAmount(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-cadence">Payment Cadence</Label>
              <Select value={scheduledCadence} onValueChange={setScheduledCadence}>
                <SelectTrigger id="scheduled-cadence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertDescription>
                Scheduled payments are stored but not automatically executed. Manual processing required.
              </AlertDescription>
            </Alert>

            <Button
              onClick={handleScheduledPayment}
              disabled={!scheduledPayee || !scheduledAmount}
              className="w-full"
            >
              Create Scheduled Payment
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
