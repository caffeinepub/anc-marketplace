import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DollarSign, Info, Lock, PiggyBank, TrendingUp } from "lucide-react";
import React from "react";
import type { AdminFinancialState } from "../../../backend";
import {
  CREDIT_LIMIT_CENTS,
  useAdminBalance,
} from "../../../hooks/useAdminBalance";

// Correct financial constants (in cents)
// Deposit: $77,957.38 = 7,795,738 cents
// Payroll Savings: $4,276.22 = 427,622 cents
// Available Balance: $77,957.38 - $4,276.22 = $73,681.16 = 7,368,116 cents
export const CORRECT_DEPOSIT_CENTS = 7_795_738;
export const CORRECT_PAYROLL_SAVINGS_CENTS = 427_622;
export const CORRECT_AVAILABLE_BALANCE_CENTS = 7_368_116;

interface FinancialOverviewCardsProps {
  financialState?: AdminFinancialState;
  isLoading?: boolean;
}

function formatCents(cents: bigint | number): string {
  const num = typeof cents === "bigint" ? Number(cents) : cents;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num / 100);
}

export default function FinancialOverviewCards({
  financialState,
  isLoading,
}: FinancialOverviewCardsProps) {
  const { availableCents, payrollCents, creditCents } = useAdminBalance();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {["available", "credit", "payroll", "total"].map((label) => (
          <Card key={label} className="bg-white/95">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Available balance from reconciled hook (excludes failed transactions)
  const availableFunds = availableCents;

  // Credit: use backend if available and non-zero, else fall back to the
  // canonical $10,000 limit stored in the hook.
  const backendCreditLimit = Number(
    financialState?.creditAccount.creditLimitCents ?? BigInt(0),
  );
  const backendCreditUsed = Number(
    financialState?.creditAccount.usedAmountCents ?? BigInt(0),
  );
  const backendCreditAvailable = backendCreditLimit - backendCreditUsed;

  // If backend returned 0 (not yet synced), show the local tracked credit
  const creditAvailable =
    backendCreditLimit > 0 ? backendCreditAvailable : creditCents;
  const creditLimit =
    backendCreditLimit > 0 ? backendCreditLimit : CREDIT_LIMIT_CENTS;

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <Card className="bg-white/95 border-emerald-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Available Balance
            </CardTitle>
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs">
                  <p>
                    Gross deposit of {formatCents(CORRECT_DEPOSIT_CENTS)} minus
                    Payroll Savings allocation of{" "}
                    {formatCents(CORRECT_PAYROLL_SAVINGS_CENTS)} ={" "}
                    {formatCents(CORRECT_AVAILABLE_BALANCE_CENTS)}. Only
                    successfully completed transactions reduce this balance.
                  </p>
                </TooltipContent>
              </Tooltip>
              <DollarSign className="w-4 h-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-700">
              {formatCents(availableFunds)}
            </div>
            <Badge className="mt-1 bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
              Withdrawable
            </Badge>
            <p className="text-xs text-slate-400 mt-1.5">
              After {formatCents(CORRECT_PAYROLL_SAVINGS_CENTS)} Payroll Savings
              deduction
            </p>
          </CardContent>
        </Card>

        {/* Total Deposited */}
        <Card className="bg-white/95 border-blue-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Deposited
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {/* Correct gross deposit: $77,957.38 */}
            <div className="text-2xl font-bold text-blue-700">
              {formatCents(CORRECT_DEPOSIT_CENTS)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Gross deposit total</p>
            <p className="text-xs text-slate-400 mt-0.5">TXN-00586559512</p>
          </CardContent>
        </Card>

        {/* Business Credit */}
        <Card className="bg-white/95 border-amber-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Business Credit
            </CardTitle>
            <Lock className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">
              {formatCents(creditAvailable)}
            </div>
            <Badge className="mt-1 bg-amber-100 text-amber-700 border-amber-200 text-xs">
              Non-Withdrawable
            </Badge>
            <p className="text-xs text-slate-500 mt-1">
              of {formatCents(creditLimit)} limit · TXN-678500061865
            </p>
          </CardContent>
        </Card>

        {/* Payroll Savings */}
        <Card className="bg-white/95 border-purple-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">
              Payroll Savings
            </CardTitle>
            <PiggyBank className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-700">
              {formatCents(payrollCents)}
            </div>
            <Badge className="mt-1 bg-purple-100 text-purple-700 border-purple-200 text-xs">
              Virtual Wallet Pool
            </Badge>
            <p className="text-xs text-slate-400 mt-1.5">
              Internal allocation from deposit
            </p>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
