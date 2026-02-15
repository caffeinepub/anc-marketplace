import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../../../hooks/useQueries';
import { StripeConfiguration } from '../../../backend';

export default function StripeSetupCard() {
  const { data: isConfigured, isLoading: isCheckingConfig } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();

  const [secretKey, setSecretKey] = React.useState('');
  const [allowedCountries, setAllowedCountries] = React.useState('US,CA,GB');
  const [showForm, setShowForm] = React.useState(false);

  const handleSave = async () => {
    if (!secretKey.trim()) {
      return;
    }

    const config: StripeConfiguration = {
      secretKey: secretKey.trim(),
      allowedCountries: allowedCountries.split(',').map(c => c.trim()).filter(c => c.length > 0),
    };

    try {
      await setConfig.mutateAsync(config);
      setSecretKey('');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save Stripe configuration:', error);
    }
  };

  if (isCheckingConfig) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Checking Stripe configuration...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Stripe</CardTitle>
            <CardDescription>Primary payment processor for marketplace transactions</CardDescription>
          </div>
          {isConfigured ? (
            <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Configured
            </Badge>
          ) : (
            <Badge variant="secondary">
              <AlertCircle className="h-3 w-3 mr-1" />
              Not Configured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConfigured && !showForm ? (
          <div className="space-y-3">
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Stripe is configured and ready to process payments. You can update the configuration if needed.
              </AlertDescription>
            </Alert>
            <Button
              variant="outline"
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              Update Configuration
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!isConfigured && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Stripe must be configured before you can accept payments or process marketplace fees.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
              <Input
                id="stripe-secret-key"
                type="password"
                placeholder="sk_test_..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your Stripe secret key (starts with sk_test_ or sk_live_)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allowed-countries">Allowed Countries</Label>
              <Input
                id="allowed-countries"
                placeholder="US,CA,GB"
                value={allowedCountries}
                onChange={(e) => setAllowedCountries(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Comma-separated country codes (e.g., US,CA,GB,AU)
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={!secretKey.trim() || setConfig.isPending}
                className="flex-1"
              >
                {setConfig.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Configuration'
                )}
              </Button>
              {showForm && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setSecretKey('');
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            {setConfig.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to save configuration. Please check your credentials and try again.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
