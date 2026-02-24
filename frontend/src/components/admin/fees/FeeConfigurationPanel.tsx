import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FeeConfigurationPanel() {
  const [saleFee, setSaleFee] = React.useState('5.00');
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate save operation (backend integration pending)
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSaving(false);
    setSaveSuccess(true);

    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Fee Configuration
        </CardTitle>
        <CardDescription>Manage marketplace service fees and pricing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Fee configuration is currently view-only. Backend integration for fee updates is on the roadmap.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="sale-fee">Per-Sale Service Fee (USD)</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="sale-fee"
                type="number"
                step="0.01"
                min="0"
                value={saleFee}
                onChange={(e) => setSaleFee(e.target.value)}
                className="pl-7"
                disabled
              />
            </div>
            <Button onClick={handleSave} disabled={isSaving || true}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Current fee: $5.00 per marketplace sale
          </p>
        </div>

        {saveSuccess && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>Fee configuration saved successfully.</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
