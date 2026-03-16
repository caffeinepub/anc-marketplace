import { DepositStatus } from "@/backend";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { useAdminBalance } from "@/hooks/useAdminBalance";
import { CREDIT_LIMIT_CENTS } from "@/hooks/useAdminBalance";
import { useGetAdminFinancialState, useGetAllUsers } from "@/hooks/useQueries";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowRightLeft,
  CheckCircle,
  ExternalLink,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type TransferSource = "available" | "credit" | "payroll";
type TransferDestination =
  | "platform_user"
  | "credit_payback"
  | "payroll_savings";

interface TransferFormData {
  source: TransferSource;
  destination: TransferDestination;
  platformUserId: string;
  amount: string;
  note: string;
}

interface LocalTransferRecord {
  id: string;
  source: TransferSource;
  destination: TransferDestination;
  destinationLabel: string;
  amount: number;
  note: string;
  timestamp: string;
  status: "successful" | "failed";
}

const SOURCE_LABELS: Record<TransferSource, string> = {
  available: "Available Balance",
  credit: "Business Credit",
  payroll: "Payroll Savings",
};

const DEST_LABELS: Record<TransferDestination, string> = {
  platform_user: "Platform User",
  credit_payback: "Credit Payback",
  payroll_savings: "Payroll Savings",
};

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function StatusBadge({ status }: { status: "successful" | "failed" }) {
  if (status === "successful")
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
        <CheckCircle className="w-3 h-3 mr-1" />
        Successful
      </Badge>
    );
  return (
    <Badge variant="destructive">
      <XCircle className="w-3 h-3 mr-1" />
      Failed
    </Badge>
  );
}

export default function TransferPanel() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { data: financialState } = useGetAdminFinancialState();
  const { data: allUsers = [] } = useGetAllUsers();
  const {
    availableCents,
    payrollCents,
    creditCents,
    deductFromAvailable,
    deductFromPayroll,
    deductFromCredit,
    addToPayroll,
    addToCredit,
  } = useAdminBalance();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [source, setSource] = useState<TransferSource>("available");
  const [destination, setDestination] =
    useState<TransferDestination>("platform_user");

  const [transfers, setTransfers] = useState<LocalTransferRecord[]>(() => {
    try {
      const stored = localStorage.getItem("admin_transfer_transactions");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TransferFormData>({
    defaultValues: {
      source: "available",
      destination: "platform_user",
      platformUserId: "",
      amount: "",
      note: "",
    },
  });

  const availableBalance = availableCents;
  const payrollSavings = payrollCents;

  // Credit: backend data takes precedence if non-zero; otherwise use hook value
  const backendCreditLimit = Number(
    financialState?.creditAccount.creditLimitCents ?? BigInt(0),
  );
  const backendCreditUsed = Number(
    financialState?.creditAccount.usedAmountCents ?? BigInt(0),
  );
  const creditAvailable =
    backendCreditLimit > 0
      ? backendCreditLimit - backendCreditUsed
      : creditCents > 0
        ? creditCents
        : CREDIT_LIMIT_CENTS;

  const getSourceBalance = (src: TransferSource): number => {
    if (src === "available") return availableBalance;
    if (src === "payroll") return payrollSavings;
    return creditAvailable;
  };

  const persistTransfers = (updated: LocalTransferRecord[]) => {
    localStorage.setItem(
      "admin_transfer_transactions",
      JSON.stringify(updated),
    );
    setTransfers(updated);
  };

  const recentTransfers = transfers.slice(-10).reverse();

  const onSubmit = async (data: TransferFormData) => {
    const amountCents = Math.round(Number.parseFloat(data.amount) * 100);
    if (Number.isNaN(amountCents) || amountCents <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    const sourceBalance = getSourceBalance(data.source);
    if (amountCents > sourceBalance) {
      toast.error(
        `Insufficient ${SOURCE_LABELS[data.source]}. Available: ${formatCents(sourceBalance)}`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      if (actor) {
        const txRecord = {
          id: `transfer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          amount: BigInt(amountCents),
          currency: "usd",
          description: `Internal transfer from ${SOURCE_LABELS[data.source]} to ${DEST_LABELS[data.destination]}: ${data.note || ""}`,
          status: DepositStatus.completed,
          createdAt: BigInt(Date.now()) * BigInt(1_000_000),
        };
        await actor.recordTransaction(txRecord);
        queryClient.invalidateQueries({ queryKey: ["payoutTransactions"] });
        queryClient.invalidateQueries({ queryKey: ["adminFinancialState"] });
      }

      const destinationLabel =
        data.destination === "platform_user"
          ? allUsers.find((u) => u.principal.toString() === data.platformUserId)
              ?.profile.fullName ||
            data.platformUserId ||
            "Platform User"
          : DEST_LABELS[data.destination];

      // Update balances (only on success)
      if (data.source === "available") deductFromAvailable(amountCents);
      else if (data.source === "payroll") deductFromPayroll(amountCents);
      else if (data.source === "credit") deductFromCredit(amountCents);

      if (data.destination === "payroll_savings") addToPayroll(amountCents);
      if (data.destination === "credit_payback") addToCredit(amountCents);

      const newTransfer: LocalTransferRecord = {
        id: `txfr_${Date.now()}`,
        source: data.source,
        destination: data.destination,
        destinationLabel,
        amount: amountCents,
        note: data.note,
        timestamp: new Date().toISOString(),
        status: "successful",
      };
      persistTransfers([...transfers, newTransfer]);
      reset();
      toast.success(
        `Transferred ${formatCents(amountCents)} from ${SOURCE_LABELS[data.source]} to ${destinationLabel}`,
      );
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Unknown error";
      // Do NOT deduct balance for failed transfers
      const newTransfer: LocalTransferRecord = {
        id: `txfr_${Date.now()}`,
        source: data.source,
        destination: data.destination,
        destinationLabel: DEST_LABELS[data.destination],
        amount: amountCents,
        note: data.note,
        timestamp: new Date().toISOString(),
        status: "failed",
      };
      persistTransfers([...transfers, newTransfer]);
      toast.error(`Transfer failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <Alert className="border-slate-200 bg-slate-50">
        <Info className="h-4 w-4 text-slate-500" />
        <AlertDescription className="text-slate-600 text-sm">
          <p className="font-semibold mb-1">Internal Platform Transfers</p>
          <p className="text-xs">
            Transfer funds between your platform accounts (Available Balance,
            Business Credit, Payroll Savings). For external bank payments, use
            the <strong>Payments tab</strong>.
          </p>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1"
          >
            <ExternalLink className="h-3 w-3" /> Open Stripe Dashboard
          </a>
        </AlertDescription>
      </Alert>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
            Available Balance
          </p>
          <p className="text-lg font-bold text-emerald-800">
            {formatCents(availableBalance)}
          </p>
          <p className="text-xs text-emerald-600 mt-0.5">Acct #: 736811620</p>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
            Business Credit
          </p>
          <p className="text-lg font-bold text-amber-800">
            {formatCents(creditAvailable)}
          </p>
          <p className="text-xs text-amber-600 mt-0.5">TXN-678500061865</p>
        </div>
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
            Payroll Savings
          </p>
          <p className="text-lg font-bold text-purple-800">
            {formatCents(payrollSavings)}
          </p>
        </div>
      </div>

      {/* Transfer Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Transfer From</Label>
            <Select
              value={source}
              onValueChange={(val) => {
                setSource(val as TransferSource);
                setValue("source", val as TransferSource);
              }}
            >
              <SelectTrigger data-ocid="transfer.source.select">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label} (
                    {formatCents(getSourceBalance(key as TransferSource))})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Transfer To</Label>
            <Select
              value={destination}
              onValueChange={(val) => {
                setDestination(val as TransferDestination);
                setValue("destination", val as TransferDestination);
              }}
            >
              <SelectTrigger data-ocid="transfer.destination.select">
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(DEST_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform user selector */}
        {destination === "platform_user" && (
          <div className="space-y-1.5">
            <Label>Select Recipient</Label>
            <Select onValueChange={(val) => setValue("platformUserId", val)}>
              <SelectTrigger data-ocid="transfer.user.select">
                <SelectValue placeholder="Select platform user" />
              </SelectTrigger>
              <SelectContent>
                {allUsers.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No users found
                  </SelectItem>
                ) : (
                  allUsers.map((u) => (
                    <SelectItem
                      key={u.principal.toString()}
                      value={u.principal.toString()}
                    >
                      {u.profile.fullName ||
                        u.profile.email ||
                        u.principal.toString()}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Amount */}
        <div className="space-y-1.5">
          <Label htmlFor="transferAmount">Amount (USD)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              $
            </span>
            <Input
              id="transferAmount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              {...register("amount", { required: true, min: 0.01 })}
              data-ocid="transfer.input"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-destructive">
              Please enter a valid amount.
            </p>
          )}
        </div>

        {/* Note */}
        <div className="space-y-1.5">
          <Label htmlFor="transferNote">Note (optional)</Label>
          <Textarea
            id="transferNote"
            placeholder="Transfer description..."
            rows={2}
            {...register("note")}
            data-ocid="transfer.textarea"
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
          data-ocid="transfer.submit_button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ArrowRightLeft className="w-4 h-4 mr-2" />
              Execute Transfer
            </>
          )}
        </Button>
      </form>

      {/* Recent Transfers */}
      {recentTransfers.length > 0 && (
        <>
          <Separator />
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Recent Transfers
            </h3>
            <div className="space-y-2">
              {recentTransfers.map((txn, idx) => (
                <div
                  key={txn.id}
                  className="flex items-start justify-between p-2.5 border rounded-lg text-sm"
                  data-ocid={`transfer.item.${idx + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-slate-700">
                        {SOURCE_LABELS[txn.source]}
                      </span>
                      <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                      <span className="text-slate-700">
                        {txn.destinationLabel}
                      </span>
                    </div>
                    {txn.note && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {txn.note}
                      </p>
                    )}
                    <p className="text-xs text-slate-400">
                      {new Date(txn.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 shrink-0">
                    <span className="font-semibold text-slate-800">
                      {formatCents(txn.amount)}
                    </span>
                    <StatusBadge status={txn.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
