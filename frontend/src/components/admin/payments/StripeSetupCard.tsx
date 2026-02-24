import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useIsStripeConfigured, useSetStripeConfiguration } from '../../../hooks/useQueries';
import { StripeConfiguration } from '../../../backend';
import { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from '../../../lib/stripeConfig';

export default function StripeSetupCard() {
  const { data: isConfigured, isLoading: isCheckingConfig } = useIsStripeConfigured();
  const setConfig = useSetStripeConfiguration();

  const [secretKey, setSecretKey] = React.useState('');
  const [allowedCountries, setAllowedCountries] = React.useState('US,CA,GB');
  const [showForm, setShowForm] = React.useState(false);
  const [showSecretKey, setShowSecretKey] = React.useState(false);

  // Auto-configure with live keys on first load if not configured
  React.useEffect(() => {
    if (isConfigured === false && !setConfig.isPending) {
      const config: StripeConfiguration = {
        secretKey: STRIPE_SECRET_KEY,
        allowedCountries: ['US', 'CA', 'GB', 'AU'],
      };
      setConfig.mutate(config);
    }
  }, [isConfigured]);

  const handleSave = async () => {
    const keyToUse = secretKey.trim() || STRIPE_SECRET_KEY;

    const config: StripeConfiguration = {
      secretKey: keyToUse,
      allowedCountries: allowedCountries.split(',').map((c) => c.trim()).filter((c) => c.length > 0),
    };

    try {
      await setConfig.mutateAsync(config);
      setSecretKey('');
      setShowForm(false);
    } catch (error) {
      // error handled by mutation state
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
              Configuring...
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
                Stripe is configured with your live keys and ready to process payments.
              </AlertDescription>
            </Alert>

            {/* Show pre-populated key info */}
            <div className="space-y-2">
              <Label>Publishable Key</Label>
              <Input
                readOnly
                value={STRIPE_PUBLISHABLE_KEY}
                className="font-mono text-xs bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label>Secret Key</Label>
              <div className="relative">
                <Input
                  readOnly
                  type={showSecretKey ? 'text' : 'password'}
                  value={STRIPE_SECRET_KEY}
                  className="font-mono text-xs bg-muted pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Live secret key is configured and active.</p>
            </div>

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
            {!isConfigured && setConfig.isPending && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Auto-configuring Stripe with your live keys...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
              <Input
                id="stripe-secret-key"
                type="password"
                placeholder={`sk_live_... (leave blank to use configured key)`}
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave blank to use the pre-configured live key.
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
                disabled={setConfig.isPending}
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
