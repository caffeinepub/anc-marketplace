import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Info,
  Loader2,
  RefreshCw,
} from "lucide-react";
import React, { useState } from "react";
import { useGetAdminFinancialState } from "../../../hooks/useQueries";
import { useStripeBalance } from "../../../hooks/useStripeBalance";
import { useStripeDepositCheckout } from "../../../hooks/useStripeDepositCheckout";
import { CORRECT_AVAILABLE_BALANCE_CENTS } from "./FinancialOverviewCards";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default function StripeDepositCard() {
  const [amount, setAmount] = useState("");

  const depositMutation = useStripeDepositCheckout();
  const {
    data: stripeBalance,
    isLoading: stripeBalanceLoading,
    isError: stripeBalanceError,
    refetch: refetchStripeBalance,
    isFetching: stripeBalanceFetching,
  } = useStripeBalance();

  const { isLoading: financialLoading } = useGetAdminFinancialState();

  const parsedAmount = Number.parseFloat(amount);
  const isValidAmount = !Number.isNaN(parsedAmount) && parsedAmount >= 0.5;
  const isDepositing = depositMutation.isPending;

  const handleDeposit = () => {
    if (!isValidAmount) return;
    depositMutation.mutate(parsedAmount);
  };

  const platformBalanceCents = CORRECT_AVAILABLE_BALANCE_CENTS;

  return (
    <Card className="bg-white border-emerald-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-emerald-100 p-2">
            <ArrowDownToLine className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-slate-800">
              Deposit Funds via Stripe
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Deposit real funds directly into your Stripe account via Stripe
              Checkout
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Balance Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Stripe Account Balance (Live) */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Stripe Account Balance (Live)
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-blue-500 hover:text-blue-700"
                onClick={() => refetchStripeBalance()}
                disabled={stripeBalanceFetching}
                title="Refresh Stripe balance"
                data-ocid="deposit.stripe_balance.button"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${stripeBalanceFetching ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {stripeBalanceLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : stripeBalanceError ? (
              <div className="flex items-center gap-1 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Unable to fetch</span>
              </div>
            ) : (
              <>
                <div className="text-xl font-bold text-blue-800">
                  {formatCents(stripeBalance?.availableCents ?? 0)}
                </div>
                {(stripeBalance?.pendingCents ?? 0) > 0 && (
                  <p className="text-xs text-blue-500 mt-0.5">
                    + {formatCents(stripeBalance!.pendingCents)} pending
                  </p>
                )}
              </>
            )}
            <p className="text-xs text-blue-500 mt-1">
              Real funds in your Stripe account
            </p>
          </div>

          {/* Platform Ledger Balance */}
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Platform Ledger Balance
              </span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            {financialLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-xl font-bold text-emerald-800">
                {formatCents(platformBalanceCents)}
              </div>
            )}
            <p className="text-xs text-emerald-500 mt-1">
              Internal app ledger (not Stripe)
            </p>
          </div>
        </div>

        {depositMutation.isSuccess && (
          <Alert className="border-emerald-300 bg-emerald-50">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-xs text-emerald-700 font-medium">
              Redirecting to Stripe Checkout... Your deposit session has been
              created. Complete payment on the Stripe-hosted page to add real
              funds to your Stripe account.
            </AlertDescription>
          </Alert>
        )}

        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-xs text-blue-700">
            Clicking <strong>"Deposit via Stripe Checkout"</strong> opens a
            secure Stripe-hosted payment page. Once you complete the payment,
            real funds are added to your Stripe account balance. This uses a
            direct Stripe API connection — no additional backend configuration
            required.
          </AlertDescription>
        </Alert>

        <Separator />

        {/* Deposit Form */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label
              htmlFor="deposit-amount"
              className="text-sm font-medium text-slate-700"
            >
              Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                $
              </span>
              <Input
                id="deposit-amount"
                type="number"
                min={0.5}
                step={0.01}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 text-sm"
                disabled={isDepositing}
                data-ocid="deposit.amount.input"
              />
            </div>
            {amount && !isValidAmount && (
              <p className="text-xs text-red-500">
                Minimum deposit amount is $0.50 (Stripe minimum)
              </p>
            )}
          </div>

          <Button
            onClick={handleDeposit}
            disabled={!isValidAmount || isDepositing}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            size="lg"
            data-ocid="deposit.primary_button"
          >
            {isDepositing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Redirecting to Stripe...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                Deposit via Stripe Checkout
              </>
            )}
          </Button>

          <div className="flex items-start gap-2 text-xs text-slate-500">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
            <span>
              Payments are processed securely by Stripe. Currency:{" "}
              <strong>USD</strong> (ISO 4217). Funds will appear in your Stripe
              Dashboard after payment confirmation.
            </span>
          </div>
        </div>

        {depositMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {depositMutation.error instanceof Error
                ? depositMutation.error.message
                : "Failed to initiate deposit. Please try again."}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
