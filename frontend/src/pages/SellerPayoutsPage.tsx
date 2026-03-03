import React, { useState } from "react";
import RequireAuthenticatedRegisteredUser from "../components/auth/RequireAuthenticatedRegisteredUser";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DollarSign, CreditCard, Building2, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function SellerPayoutsPage() {
  return (
    <RequireAuthenticatedRegisteredUser>
      <SellerPayoutsContent />
    </RequireAuthenticatedRegisteredUser>
  );
}

function SellerPayoutsContent() {
  const [payoutAccount, setPayoutAccount] = useState("");
  const [isSavingAccount, setIsSavingAccount] = useState(false);
  const [debitCardBusinessName, setDebitCardBusinessName] = useState("");
  const [isSubmittingDebit, setIsSubmittingDebit] = useState(false);
  const [creditCardBusinessName, setCreditCardBusinessName] = useState("");
  const [isSubmittingCredit, setIsSubmittingCredit] = useState(false);

  const handleSavePayoutAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutAccount.trim()) {
      toast.error("Please enter a payout account number");
      return;
    }
    setIsSavingAccount(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSavingAccount(false);
    toast.success("Payout account saved successfully");
  };

  const handleDebitCardRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!debitCardBusinessName.trim()) {
      toast.error("Please enter your business name");
      return;
    }
    setIsSubmittingDebit(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmittingDebit(false);
    toast.success("Debit card request submitted. We'll review your application.");
  };

  const handleCreditCardApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditCardBusinessName.trim()) {
      toast.error("Please enter your business name");
      return;
    }
    setIsSubmittingCredit(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubmittingCredit(false);
    toast.success("Credit card application submitted. We'll review your application.");
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Seller Payouts</h1>
          <p className="text-muted-foreground mt-1">
            Manage your payout settings and financial products
          </p>
        </div>

        {/* Account Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Account Balance
            </CardTitle>
            <CardDescription>Your current held balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="text-sm text-green-700 font-medium">Available Balance</p>
                <p className="text-3xl font-bold text-green-800">$0.00</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
            </div>
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Funds are held until a payout account is configured and verified.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Payout Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              Payout Account
            </CardTitle>
            <CardDescription>Set your designated payout account number</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSavePayoutAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payoutAccount">Account Number</Label>
                <Input
                  id="payoutAccount"
                  value={payoutAccount}
                  onChange={(e) => setPayoutAccount(e.target.value)}
                  placeholder="Enter your bank account number"
                />
                <p className="text-xs text-muted-foreground">
                  This account will receive your seller payouts.
                </p>
              </div>
              <Button type="submit" disabled={isSavingAccount}>
                {isSavingAccount ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
                ) : (
                  <><CheckCircle className="h-4 w-4 mr-2" />Save Account</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Business Debit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-600" />
              Business Debit Card
            </CardTitle>
            <CardDescription>Request a business debit card for your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDebitCardRequest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="debitBusinessName">Business Name</Label>
                <Input
                  id="debitBusinessName"
                  value={debitCardBusinessName}
                  onChange={(e) => setDebitCardBusinessName(e.target.value)}
                  placeholder="Enter your registered business name"
                />
              </div>
              <Button type="submit" variant="outline" disabled={isSubmittingDebit}>
                {isSubmittingDebit ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</>
                ) : (
                  "Request Debit Card"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Business Credit Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Business Credit Card
            </CardTitle>
            <CardDescription>Apply for a business credit card</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreditCardApplication} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="creditBusinessName">Business Name</Label>
                <Input
                  id="creditBusinessName"
                  value={creditCardBusinessName}
                  onChange={(e) => setCreditCardBusinessName(e.target.value)}
                  placeholder="Enter your registered business name"
                />
              </div>
              <Button type="submit" variant="outline" disabled={isSubmittingCredit}>
                {isSubmittingCredit ? (
                  <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting...</>
                ) : (
                  "Apply for Credit Card"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
