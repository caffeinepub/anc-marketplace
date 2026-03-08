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
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  ArrowDownToLine,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Info,
  Loader2,
  RefreshCw,
  Wallet,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAdminBalance } from "../../../hooks/useAdminBalance";
import { useGetAdminFinancialState } from "../../../hooks/useQueries";
import { useStripeBalance } from "../../../hooks/useStripeBalance";
import { useStripeDepositCheckout } from "../../../hooks/useStripeDepositCheckout";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

interface InternalPaymentRecord {
  id: string;
  amount: number;
  description: string;
  timestamp: string;
  balanceAfter: number;
}

export default function StripeDepositCard() {
  const [stripeAmount, setStripeAmount] = useState("");

  // Internal payment state
  const [internalAmount, setInternalAmount] = useState("");
  const [internalDescription, setInternalDescription] = useState("");
  const [isInternalProcessing, setIsInternalProcessing] = useState(false);

  const { availableCents, deductFromAvailable } = useAdminBalance();

  const depositMutation = useStripeDepositCheckout();
  const {
    data: stripeBalance,
    isLoading: stripeBalanceLoading,
    isError: stripeBalanceError,
    refetch: refetchStripeBalance,
    isFetching: stripeBalanceFetching,
  } = useStripeBalance();

  const { isLoading: financialLoading } = useGetAdminFinancialState();

  const parsedStripeAmount = Number.parseFloat(stripeAmount);
  const isValidStripeAmount =
    !Number.isNaN(parsedStripeAmount) && parsedStripeAmount >= 0.5;
  const isDepositing = depositMutation.isPending;

  const parsedInternalAmount = Number.parseFloat(internalAmount);
  const internalAmountCents = Math.round(parsedInternalAmount * 100);
  const isValidInternalAmount =
    !Number.isNaN(parsedInternalAmount) &&
    parsedInternalAmount > 0 &&
    internalAmountCents <= availableCents;

  const handleDeposit = () => {
    if (!isValidStripeAmount) return;
    depositMutation.mutate(parsedStripeAmount);
  };

  const handleInternalPayment = async () => {
    if (!isValidInternalAmount) return;
    setIsInternalProcessing(true);

    // Simulate brief processing
    await new Promise((resolve) => setTimeout(resolve, 600));

    deductFromAvailable(internalAmountCents);
    const newBalance = availableCents - internalAmountCents;

    // Persist to transaction log
    try {
      const record: InternalPaymentRecord = {
        id: `internal_${Date.now()}`,
        amount: internalAmountCents,
        description: internalDescription || "Internal platform payment",
        timestamp: new Date().toISOString(),
        balanceAfter: newBalance,
      };
      const existing = JSON.parse(
        localStorage.getItem("admin_payment_transactions") || "[]",
      );
      existing.push(record);
      localStorage.setItem(
        "admin_payment_transactions",
        JSON.stringify(existing),
      );
    } catch {
      // ignore storage errors
    }

    toast.success(
      `Payment of ${formatCents(internalAmountCents)} processed from platform ledger. New balance: ${formatCents(Math.max(0, newBalance))}`,
    );

    setInternalAmount("");
    setInternalDescription("");
    setIsInternalProcessing(false);
  };

  return (
    <div className="space-y-4">
      {/* ── Internal Platform Payment Card ── */}
      <Card className="bg-white border-navy-200 shadow-sm border-l-4 border-l-blue-700">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-2">
              <Wallet className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                Pay from Platform Ledger
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Charge directly against your available platform balance — no
                Stripe redirect
              </CardDescription>
            </div>
            <Badge className="ml-auto bg-blue-100 text-blue-700 border-blue-200 text-xs shrink-0">
              Internal
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Available balance display */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50">
            <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                Available Platform Balance
              </p>
              <p className="text-lg font-bold text-emerald-800">
                {formatCents(availableCents)}
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="internal-amount"
              className="text-sm font-medium text-slate-700"
            >
              Amount (USD)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                $
              </span>
              <Input
                id="internal-amount"
                type="number"
                min={0.01}
                step={0.01}
                placeholder="0.00"
                value={internalAmount}
                onChange={(e) => setInternalAmount(e.target.value)}
                className="pl-7 text-sm"
                disabled={isInternalProcessing}
                data-ocid="internal_payment.amount.input"
              />
            </div>
            {internalAmount &&
              !Number.isNaN(parsedInternalAmount) &&
              internalAmountCents > availableCents && (
                <p
                  className="text-xs text-red-500"
                  data-ocid="internal_payment.amount.error_state"
                >
                  Insufficient balance. Available: {formatCents(availableCents)}
                </p>
              )}
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="internal-description"
              className="text-sm font-medium text-slate-700"
            >
              Description / Note
            </Label>
            <Textarea
              id="internal-description"
              placeholder="Payment purpose or memo..."
              rows={2}
              value={internalDescription}
              onChange={(e) => setInternalDescription(e.target.value)}
              disabled={isInternalProcessing}
              data-ocid="internal_payment.textarea"
            />
          </div>

          <Button
            onClick={handleInternalPayment}
            disabled={
              !isValidInternalAmount || isInternalProcessing || !internalAmount
            }
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold"
            size="lg"
            data-ocid="internal_payment.primary_button"
          >
            {isInternalProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Pay from Platform Ledger
              </>
            )}
          </Button>

          <p className="text-xs text-slate-500">
            This deducts the amount directly from your platform ledger balance.
            No Stripe interaction required. The transaction is recorded in your
            payment log.
          </p>
        </CardContent>
      </Card>

      {/* ── Stripe Deposit Card ── */}
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
                  {formatCents(availableCents)}
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

          {/* Stripe Deposit Form */}
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
                  value={stripeAmount}
                  onChange={(e) => setStripeAmount(e.target.value)}
                  className="pl-7 text-sm"
                  disabled={isDepositing}
                  data-ocid="deposit.amount.input"
                />
              </div>
              {stripeAmount && !isValidStripeAmount && (
                <p className="text-xs text-red-500">
                  Minimum deposit amount is $0.50 (Stripe minimum)
                </p>
              )}
            </div>

            <Button
              onClick={handleDeposit}
              disabled={!isValidStripeAmount || isDepositing}
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
                <strong>USD</strong> (ISO 4217). Funds will appear in your
                Stripe Dashboard after payment confirmation.
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
    </div>
  );
}
