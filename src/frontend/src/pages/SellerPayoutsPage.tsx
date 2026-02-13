import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  useGetPayoutProfile,
  useCreateOrUpdatePayoutProfile,
  useGetAccountNumber,
  useCreateOrGetAccountNumber,
  useRequestBusinessDebitCard,
  useSubmitBusinessCreditCardApplication,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Wallet, CreditCard, DollarSign, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function SellerPayoutsPage() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: payoutProfile, isLoading: profileLoading } = useGetPayoutProfile();
  const { data: accountNumber, isLoading: accountLoading } = useGetAccountNumber();
  const createOrGetAccount = useCreateOrGetAccountNumber();
  const updatePayoutProfile = useCreateOrUpdatePayoutProfile();
  const requestDebitCard = useRequestBusinessDebitCard();
  const submitCreditApp = useSubmitBusinessCreditCardApplication();

  const [payoutAccount, setPayoutAccount] = useState('');
  const [debitCardBusinessName, setDebitCardBusinessName] = useState('');
  const [creditCardBusinessName, setCreditCardBusinessName] = useState('');
  const [debitCardRequest, setDebitCardRequest] = useState<any>(null);
  const [creditCardApplication, setCreditCardApplication] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (payoutProfile) {
      setPayoutAccount(payoutProfile.designatedPayoutAccount);
    }
  }, [payoutProfile]);

  useEffect(() => {
    if (!accountNumber && !accountLoading && !createOrGetAccount.isPending) {
      createOrGetAccount.mutate();
    }
  }, [accountNumber, accountLoading]);

  const handleUpdatePayoutAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePayoutProfile.mutateAsync(payoutAccount);
    } catch (error) {
      console.error('Error updating payout account:', error);
    }
  };

  const handleRequestDebitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debitCardBusinessName.trim()) return;
    try {
      const result = await requestDebitCard.mutateAsync(debitCardBusinessName);
      setDebitCardRequest(result);
      setDebitCardBusinessName('');
    } catch (error) {
      console.error('Error requesting debit card:', error);
    }
  };

  const handleSubmitCreditApp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditCardBusinessName.trim()) return;
    try {
      const result = await submitCreditApp.mutateAsync(creditCardBusinessName);
      setCreditCardApplication(result);
      setCreditCardBusinessName('');
    } catch (error) {
      console.error('Error submitting credit card application:', error);
    }
  };

  const formatCents = (cents: number | bigint) => {
    const amount = typeof cents === 'bigint' ? Number(cents) : cents;
    return `$${(amount / 100).toFixed(2)}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
      case 'under_review':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'Under Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'draft':
        return 'Draft';
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const isLoading = profileLoading || accountLoading;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seller Payouts</h1>
        <p className="text-muted-foreground">
          Manage your payout account, view your balance, and request business financial services.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your payout information...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Account Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Account Overview
              </CardTitle>
              <CardDescription>Your seller account details and current balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                  <p className="text-xl font-semibold font-mono">
                    {accountNumber || 'Generating...'}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Held Balance</p>
                  <p className="text-xl font-semibold text-primary">
                    {payoutProfile ? formatCents(payoutProfile.internalBalanceCents) : '$0.00'}
                  </p>
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Funds are temporarily held in your account until transferred to your designated payout account.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Payout Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payout Account Settings
              </CardTitle>
              <CardDescription>Update your external payout account details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdatePayoutAccount} className="space-y-4">
                <div>
                  <Label htmlFor="payoutAccount">Designated Payout Account</Label>
                  <Input
                    id="payoutAccount"
                    type="text"
                    placeholder="Enter your bank account or payment details"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your bank account number, PayPal email, or other payout details
                  </p>
                </div>
                <Button
                  type="submit"
                  disabled={updatePayoutProfile.isPending || !payoutAccount.trim()}
                >
                  {updatePayoutProfile.isPending ? 'Saving...' : 'Save Payout Account'}
                </Button>
                {updatePayoutProfile.isSuccess && (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>Payout account updated successfully!</AlertDescription>
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>

          <Separator />

          {/* Business Debit Card Request */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Request Business Debit Card
              </CardTitle>
              <CardDescription>
                Submit a request for a business debit card linked to your seller account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {debitCardRequest ? (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(debitCardRequest.requestStatus)}
                    <p className="font-semibold">
                      Status: {getStatusLabel(debitCardRequest.requestStatus)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Business Name: {debitCardRequest.businessName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Request ID: {debitCardRequest.id}
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is a request submission. Actual card issuance is not available at this time.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <form onSubmit={handleRequestDebitCard} className="space-y-4">
                  <div>
                    <Label htmlFor="debitBusinessName">Business Name</Label>
                    <Input
                      id="debitBusinessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={debitCardBusinessName}
                      onChange={(e) => setDebitCardBusinessName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={requestDebitCard.isPending || !debitCardBusinessName.trim()}
                  >
                    {requestDebitCard.isPending ? 'Submitting...' : 'Submit Debit Card Request'}
                  </Button>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is a request form. Actual card issuance requires additional verification and is not currently available.
                    </AlertDescription>
                  </Alert>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Business Credit Card Application */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Apply for Business Credit Card
              </CardTitle>
              <CardDescription>
                Submit an application for a business credit card
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {creditCardApplication ? (
                <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(creditCardApplication.applicationStatus)}
                    <p className="font-semibold">
                      Status: {getStatusLabel(creditCardApplication.applicationStatus)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Business Name: {creditCardApplication.businessName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Application ID: {creditCardApplication.id}
                  </p>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is an application submission. Actual credit card issuance is not available at this time.
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <form onSubmit={handleSubmitCreditApp} className="space-y-4">
                  <div>
                    <Label htmlFor="creditBusinessName">Business Name</Label>
                    <Input
                      id="creditBusinessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={creditCardBusinessName}
                      onChange={(e) => setCreditCardBusinessName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submitCreditApp.isPending || !creditCardBusinessName.trim()}
                  >
                    {submitCreditApp.isPending ? 'Submitting...' : 'Submit Credit Card Application'}
                  </Button>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This is an application form. Actual credit card issuance requires credit checks and is not currently available.
                    </AlertDescription>
                  </Alert>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
