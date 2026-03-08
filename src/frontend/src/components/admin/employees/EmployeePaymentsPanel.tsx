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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAdminBalance } from "@/hooks/useAdminBalance";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  Loader2,
  Play,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

function formatCents(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

interface ManualPayment {
  id: string;
  payee: string;
  amount: number;
  method: string;
  note: string;
  timestamp: string;
}

interface ScheduledPayment {
  id: string;
  payee: string;
  amount: number;
  cadence: string;
  startDate: string;
  note: string;
  createdAt: string;
}

const PAYMENT_METHODS = [
  { value: "bank_transfer", label: "Bank Transfer" },
  { value: "check", label: "Check" },
  { value: "cash", label: "Cash" },
  { value: "digital_wallet", label: "Digital Wallet" },
];

const CADENCE_LABELS: Record<string, string> = {
  weekly: "Weekly",
  biweekly: "Bi-weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
};

function loadManualPayments(): ManualPayment[] {
  try {
    return JSON.parse(localStorage.getItem("admin_employee_payments") || "[]");
  } catch {
    return [];
  }
}

function loadScheduledPayments(): ScheduledPayment[] {
  try {
    return JSON.parse(localStorage.getItem("admin_scheduled_payments") || "[]");
  } catch {
    return [];
  }
}

export default function EmployeePaymentsPanel() {
  const { availableCents, deductFromAvailable } = useAdminBalance();

  // Manual payment state
  const [manualPayee, setManualPayee] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const [manualMethod, setManualMethod] = useState("bank_transfer");
  const [manualNote, setManualNote] = useState("");
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);
  const [manualPayments, setManualPayments] = useState<ManualPayment[]>(() =>
    loadManualPayments(),
  );

  // Scheduled payment state
  const [scheduledPayee, setScheduledPayee] = useState("");
  const [scheduledAmount, setScheduledAmount] = useState("");
  const [scheduledCadence, setScheduledCadence] = useState("monthly");
  const [scheduledStartDate, setScheduledStartDate] = useState("");
  const [scheduledNote, setScheduledNote] = useState("");
  const [isScheduledSubmitting, setIsScheduledSubmitting] = useState(false);
  const [scheduledPayments, setScheduledPayments] = useState<
    ScheduledPayment[]
  >(() => loadScheduledPayments());
  const [runningPaymentId, setRunningPaymentId] = useState<string | null>(null);

  const manualAmountCents = Math.round(
    Number.parseFloat(manualAmount || "0") * 100,
  );
  const scheduledAmountCents = Math.round(
    Number.parseFloat(scheduledAmount || "0") * 100,
  );

  const persistManualPayments = (payments: ManualPayment[]) => {
    localStorage.setItem("admin_employee_payments", JSON.stringify(payments));
    setManualPayments(payments);
  };

  const persistScheduledPayments = (payments: ScheduledPayment[]) => {
    localStorage.setItem("admin_scheduled_payments", JSON.stringify(payments));
    setScheduledPayments(payments);
  };

  const handleManualPayment = async () => {
    if (!manualPayee || manualAmountCents <= 0) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (manualAmountCents > availableCents) {
      toast.error(
        `Insufficient balance. Available: ${formatCents(availableCents)}`,
      );
      return;
    }

    setIsManualSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    deductFromAvailable(manualAmountCents);

    const record: ManualPayment = {
      id: `emp_pay_${Date.now()}`,
      payee: manualPayee,
      amount: manualAmountCents,
      method: manualMethod,
      note: manualNote,
      timestamp: new Date().toISOString(),
    };

    const updated = [record, ...manualPayments].slice(0, 50);
    persistManualPayments(updated);
    toast.success(
      `Payment of ${formatCents(manualAmountCents)} to ${manualPayee} recorded. New balance: ${formatCents(availableCents - manualAmountCents)}`,
    );

    setManualPayee("");
    setManualAmount("");
    setManualNote("");
    setManualMethod("bank_transfer");
    setIsManualSubmitting(false);
  };

  const handleScheduledPayment = async () => {
    if (!scheduledPayee || scheduledAmountCents <= 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsScheduledSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const record: ScheduledPayment = {
      id: `sched_${Date.now()}`,
      payee: scheduledPayee,
      amount: scheduledAmountCents,
      cadence: scheduledCadence,
      startDate: scheduledStartDate,
      note: scheduledNote,
      createdAt: new Date().toISOString(),
    };

    const updated = [record, ...scheduledPayments];
    persistScheduledPayments(updated);
    toast.success(
      `Scheduled payment for ${scheduledPayee} (${CADENCE_LABELS[scheduledCadence]}) saved.`,
    );

    setScheduledPayee("");
    setScheduledAmount("");
    setScheduledStartDate("");
    setScheduledNote("");
    setScheduledCadence("monthly");
    setIsScheduledSubmitting(false);
  };

  const handleRunNow = async (payment: ScheduledPayment) => {
    if (payment.amount > availableCents) {
      toast.error(
        `Insufficient balance. Available: ${formatCents(availableCents)}`,
      );
      return;
    }

    setRunningPaymentId(payment.id);
    await new Promise((resolve) => setTimeout(resolve, 600));

    deductFromAvailable(payment.amount);

    const record: ManualPayment = {
      id: `emp_pay_${Date.now()}`,
      payee: payment.payee,
      amount: payment.amount,
      method: "scheduled_run",
      note: `${CADENCE_LABELS[payment.cadence]} scheduled payment${payment.note ? `: ${payment.note}` : ""}`,
      timestamp: new Date().toISOString(),
    };

    const updatedManual = [record, ...manualPayments].slice(0, 50);
    persistManualPayments(updatedManual);

    toast.success(
      `Ran payment of ${formatCents(payment.amount)} to ${payment.payee}. New balance: ${formatCents(availableCents - payment.amount)}`,
    );
    setRunningPaymentId(null);
  };

  const recentManualPayments = manualPayments.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-700" />
          Employee Payments
        </CardTitle>
        <CardDescription>
          Manage manual and scheduled employee payment records
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance display */}
        <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-200 bg-emerald-50">
          <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Available Balance
            </p>
            <p className="text-lg font-bold text-emerald-800">
              {formatCents(availableCents)}
            </p>
          </div>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="manual"
              data-ocid="employees.manual_payments.tab"
            >
              Manual Payments
            </TabsTrigger>
            <TabsTrigger
              value="scheduled"
              data-ocid="employees.scheduled_payments.tab"
            >
              Scheduled Payments
            </TabsTrigger>
          </TabsList>

          {/* ── Manual Payments Tab ── */}
          <TabsContent value="manual" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="manual-payee">Payee Name *</Label>
              <Input
                id="manual-payee"
                placeholder="Employee name"
                value={manualPayee}
                onChange={(e) => setManualPayee(e.target.value)}
                data-ocid="employees.manual_payee.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-amount">Amount (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="manual-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(e.target.value)}
                  className="pl-7"
                  data-ocid="employees.manual_amount.input"
                />
              </div>
              {manualAmount &&
                manualAmountCents > 0 &&
                manualAmountCents > availableCents && (
                  <p
                    className="text-xs text-red-500"
                    data-ocid="employees.manual_amount.error_state"
                  >
                    Insufficient balance. Available:{" "}
                    {formatCents(availableCents)}
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-method">Payment Method</Label>
              <Select value={manualMethod} onValueChange={setManualMethod}>
                <SelectTrigger
                  id="manual-method"
                  data-ocid="employees.manual_method.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manual-note">Note (Optional)</Label>
              <Textarea
                id="manual-note"
                placeholder="Payment description or memo"
                value={manualNote}
                onChange={(e) => setManualNote(e.target.value)}
                rows={2}
                data-ocid="employees.manual_note.textarea"
              />
            </div>

            <Button
              onClick={handleManualPayment}
              disabled={
                !manualPayee ||
                !manualAmount ||
                manualAmountCents <= 0 ||
                isManualSubmitting
              }
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              data-ocid="employees.manual_payment.primary_button"
            >
              {isManualSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Record Manual Payment
                </>
              )}
            </Button>

            {/* Recent manual payments list */}
            {recentManualPayments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    Recent Payments (last 10)
                  </h3>
                  <div
                    className="space-y-2"
                    data-ocid="employees.manual_payments.list"
                  >
                    {recentManualPayments.map((p, i) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-2.5 border rounded-lg text-sm"
                        data-ocid={`employees.manual_payment.item.${i + 1}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-700">
                              {p.payee}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {PAYMENT_METHODS.find((m) => m.value === p.method)
                                ?.label ?? p.method}
                            </Badge>
                          </div>
                          {p.note && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                              {p.note}
                            </p>
                          )}
                          <p className="text-xs text-slate-400">
                            {new Date(p.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className="font-semibold text-slate-800 ml-3 shrink-0">
                          {formatCents(p.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {recentManualPayments.length === 0 && (
              <div
                className="text-center py-6 text-slate-400 text-sm"
                data-ocid="employees.manual_payments.empty_state"
              >
                No manual payments recorded yet.
              </div>
            )}
          </TabsContent>

          {/* ── Scheduled Payments Tab ── */}
          <TabsContent value="scheduled" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="scheduled-payee">Payee Name *</Label>
              <Input
                id="scheduled-payee"
                placeholder="Employee name"
                value={scheduledPayee}
                onChange={(e) => setScheduledPayee(e.target.value)}
                data-ocid="employees.scheduled_payee.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-amount">Amount (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="scheduled-amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={scheduledAmount}
                  onChange={(e) => setScheduledAmount(e.target.value)}
                  className="pl-7"
                  data-ocid="employees.scheduled_amount.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-cadence">Payment Cadence</Label>
              <Select
                value={scheduledCadence}
                onValueChange={setScheduledCadence}
              >
                <SelectTrigger
                  id="scheduled-cadence"
                  data-ocid="employees.scheduled_cadence.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CADENCE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-start">Start Date</Label>
              <Input
                id="scheduled-start"
                type="date"
                value={scheduledStartDate}
                onChange={(e) => setScheduledStartDate(e.target.value)}
                data-ocid="employees.scheduled_start.input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled-note">Note (Optional)</Label>
              <Textarea
                id="scheduled-note"
                placeholder="Payment description or memo"
                value={scheduledNote}
                onChange={(e) => setScheduledNote(e.target.value)}
                rows={2}
                data-ocid="employees.scheduled_note.textarea"
              />
            </div>

            <Button
              onClick={handleScheduledPayment}
              disabled={
                !scheduledPayee ||
                !scheduledAmount ||
                scheduledAmountCents <= 0 ||
                isScheduledSubmitting
              }
              className="w-full bg-blue-700 hover:bg-blue-800 text-white"
              data-ocid="employees.scheduled_payment.primary_button"
            >
              {isScheduledSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Save Scheduled Payment
                </>
              )}
            </Button>

            {/* Scheduled payments list */}
            {scheduledPayments.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">
                    All Scheduled Payments
                  </h3>
                  <div
                    className="space-y-2"
                    data-ocid="employees.scheduled_payments.list"
                  >
                    {scheduledPayments.map((p, i) => (
                      <div
                        key={p.id}
                        className="flex items-start justify-between p-2.5 border rounded-lg text-sm gap-3"
                        data-ocid={`employees.scheduled_payment.item.${i + 1}`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-slate-700">
                              {p.payee}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {CADENCE_LABELS[p.cadence]}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold mt-0.5">
                            {formatCents(p.amount)}
                          </p>
                          {p.startDate && (
                            <p className="text-xs text-slate-500">
                              Starts: {p.startDate}
                            </p>
                          )}
                          {p.note && (
                            <p className="text-xs text-slate-500 truncate">
                              {p.note}
                            </p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          onClick={() => handleRunNow(p)}
                          disabled={runningPaymentId === p.id}
                          data-ocid={`employees.run_payment.button.${i + 1}`}
                        >
                          {runningPaymentId === p.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <>
                              <Play className="h-3.5 w-3.5 mr-1" />
                              Run Now
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {scheduledPayments.length === 0 && (
              <div
                className="text-center py-6 text-slate-400 text-sm"
                data-ocid="employees.scheduled_payments.empty_state"
              >
                No scheduled payments set up yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
