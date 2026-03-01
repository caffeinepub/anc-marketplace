import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useCreateConnectedAccount, useCreateAccountLink, useRetrieveConnectedAccount } from '../../../hooks/useStripeConnect';
import { StripeConnectedAccount, STRIPE_CONNECT_ACCOUNT_ID } from '../../../lib/stripeConfig';

const STORAGE_KEY = 'anc_stripe_connect_account_id';

export default function OwnerStripeConnectCard() {
  const [email, setEmail] = React.useState('');
  const [connectedAccount, setConnectedAccount] = React.useState<StripeConnectedAccount | null>(null);

  // Pre-populate with the owner's known Connect account ID
  const [storedAccountId, setStoredAccountId] = React.useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || STRIPE_CONNECT_ACCOUNT_ID;
  });

  const createAccount = useCreateConnectedAccount();
  const createAccountLink = useCreateAccountLink();
  const retrieveAccount = useRetrieveConnectedAccount();

  // Load account status on mount using the owner's Connect account ID
  React.useEffect(() => {
    if (storedAccountId && !connectedAccount) {
      // Persist the account ID to localStorage if not already there
      if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, storedAccountId);
      }
      retrieveAccount.mutate(storedAccountId, {
        onSuccess: (account) => {
          setConnectedAccount(account);
        },
        onError: (err: any) => {
          // If the pre-configured account fails, allow manual entry
          if (storedAccountId === STRIPE_CONNECT_ACCOUNT_ID) {
            toast.error('Could not load Connect account status', {
              description: err?.message || 'Check your Stripe dashboard for account status.',
            });
          } else {
            localStorage.removeItem(STORAGE_KEY);
            setStoredAccountId(STRIPE_CONNECT_ACCOUNT_ID);
          }
        },
      });
    }
  }, [storedAccountId]);

  const handleCreateAccount = async () => {
    if (!email.trim()) {
      toast.error('Email required', { description: 'Please enter an email address for the connected account.' });
      return;
    }

    try {
      const account = await createAccount.mutateAsync({ email: email.trim() });
      localStorage.setItem(STORAGE_KEY, account.id);
      setStoredAccountId(account.id);
      setConnectedAccount(account);
      toast.success('Connected Account Created', {
        description: `Stripe account ${account.id} created. Starting onboarding...`,
      });

      // Immediately start onboarding
      await handleStartOnboarding(account.id);
    } catch (error: any) {
      toast.error('Failed to Create Account', {
        description: error?.message || 'An error occurred while creating the Stripe account.',
      });
    }
  };

  const handleStartOnboarding = async (accountId?: string) => {
    const id = accountId || storedAccountId || STRIPE_CONNECT_ACCOUNT_ID;
    if (!id) return;

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const refreshUrl = `${baseUrl}/admin`;
    const returnUrl = `${baseUrl}/admin?stripe_connect_return=1`;

    try {
      const link = await createAccountLink.mutateAsync({
        accountId: id,
        refreshUrl,
        returnUrl,
      });

      window.location.href = link.url;
    } catch (error: any) {
      toast.error('Onboarding Failed', {
        description: error?.message || 'Could not generate onboarding link.',
      });
    }
  };

  const handleRefreshStatus = async () => {
    const id = storedAccountId || STRIPE_CONNECT_ACCOUNT_ID;
    if (!id) return;
    retrieveAccount.mutate(id, {
      onSuccess: (account) => {
        setConnectedAccount(account);
        toast.success('Status refreshed');
      },
      onError: (error: any) => {
        toast.error('Failed to refresh status', { description: error?.message });
      },
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStoredAccountId(STRIPE_CONNECT_ACCOUNT_ID);
    setConnectedAccount(null);
    setEmail('');
    toast.info('Account disconnected from this device.');
  };

  const isLoading =
    createAccount.isPending ||
    createAccountLink.isPending ||
    retrieveAccount.isPending;

  // Show connected account status
  if (connectedAccount) {
    const isActive = connectedAccount.charges_enabled && connectedAccount.payouts_enabled;
    const needsOnboarding = !connectedAccount.details_submitted;

    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Owner Stripe Connect Account</CardTitle>
              <CardDescription>Connected account for receiving payouts</CardDescription>
            </div>
            {isActive ? (
              <Badge variant="default" className="bg-emerald-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Active
              </Badge>
            ) : (
              <Badge variant="secondary">
                <AlertCircle className="h-3 w-3 mr-1" />
                Pending Setup
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Account ID</span>
              <span className="font-mono text-xs">{connectedAccount.id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Charges Enabled</span>
              <span>{connectedAccount.charges_enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payouts Enabled</span>
              <span>{connectedAccount.payouts_enabled ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Details Submitted</span>
              <span>{connectedAccount.details_submitted ? '✅' : '❌'}</span>
            </div>
          </div>

          {needsOnboarding && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your account setup is incomplete. Complete onboarding to enable payouts.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            {needsOnboarding && (
              <Button
                onClick={() => handleStartOnboarding()}
                disabled={isLoading}
                className="flex-1"
              >
                {createAccountLink.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Starting Onboarding...</>
                ) : (
                  <><ExternalLink className="h-4 w-4 mr-2" />Complete Onboarding</>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleRefreshStatus}
              disabled={isLoading}
              size={needsOnboarding ? 'icon' : 'default'}
            >
              <RefreshCw className={`h-4 w-4 ${retrieveAccount.isPending ? 'animate-spin' : ''}`} />
              {!needsOnboarding && <span className="ml-2">Refresh Status</span>}
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={handleDisconnect} className="w-full text-muted-foreground">
            Disconnect Account
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show loading state while fetching account status
  if (retrieveAccount.isPending) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="text-lg">Owner Stripe Connect Account</CardTitle>
          <CardDescription>Loading account status...</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Fetching account status for {STRIPE_CONNECT_ACCOUNT_ID}...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show create/connect account form (fallback if auto-load failed)
  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Owner Stripe Connect Account</CardTitle>
            <CardDescription>Connect your Stripe account to receive payouts</CardDescription>
          </div>
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {retrieveAccount.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Could not load account <span className="font-mono text-xs">{STRIPE_CONNECT_ACCOUNT_ID}</span>:{' '}
              {(retrieveAccount.error as any)?.message || 'Unknown error'}. You can retry or create a new account below.
            </AlertDescription>
          </Alert>
        )}

        <div className="rounded-lg bg-slate-50 dark:bg-slate-900 border p-3 space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Pre-configured Connect Account</p>
          <p className="font-mono text-sm">{STRIPE_CONNECT_ACCOUNT_ID}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefreshStatus}
            disabled={isLoading}
            className="flex-1"
          >
            {retrieveAccount.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" />Retry Load Account</>
            )}
          </Button>
          <Button
            onClick={() => handleStartOnboarding(STRIPE_CONNECT_ACCOUNT_ID)}
            disabled={isLoading}
            className="flex-1"
          >
            {createAccountLink.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Starting...</>
            ) : (
              <><ExternalLink className="h-4 w-4 mr-2" />Open Onboarding</>
            )}
          </Button>
        </div>

        <div className="border-t pt-4 space-y-3">
          <p className="text-sm text-muted-foreground font-medium">Or create a new connected account:</p>
          <div className="space-y-2">
            <Label htmlFor="connect-email">Email for New Connected Account</Label>
            <Input
              id="connect-email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreateAccount}
            disabled={isLoading || !email.trim()}
            variant="outline"
            className="w-full"
          >
            {createAccount.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <ExternalLink className="h-4 w-4 mr-2" />
                Create New Connect Account
              </>
            )}
          </Button>
        </div>

        {(createAccount.isError || createAccountLink.isError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(createAccount.error as any)?.message ||
                (createAccountLink.error as any)?.message ||
                'Failed to connect Stripe account. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
