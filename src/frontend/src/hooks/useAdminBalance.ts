import { useEffect, useState } from "react";

// Canonical constants (in cents)
// These are the CORRECT baseline values based on verified transaction history:
// Deposit: $77,957.38, Payroll Savings allocation: $4,276.22
// Available = $77,957.38 - $4,276.22 = $73,681.16
export const AVAILABLE_BALANCE_CENTS = 7_368_116; // $73,681.16
export const PAYROLL_SAVINGS_CENTS = 427_622; // $4,276.22
export const CREDIT_LIMIT_CENTS = 1_000_000; // $10,000.00
export const CREDIT_AVAILABLE_CENTS = 1_000_000; // $10,000.00 (full limit, none used)

const KEYS = {
  available: "admin_balance_available",
  payroll: "admin_balance_payroll",
  credit: "admin_balance_credit",
} as const;

/**
 * Reconcile available balance:
 * Start from the canonical baseline and subtract only SUCCESSFUL payments.
 * This ensures failed/pending transactions never reduce the balance.
 */
function reconcileAvailableBalance(): number {
  try {
    const stored = localStorage.getItem("admin_payment_transactions");
    const payments: Array<{ status: string; amount: number }> = stored
      ? JSON.parse(stored)
      : [];

    const successfulDeductions = payments
      .filter((p) => p.status === "successful")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    const reconciled = Math.max(
      0,
      AVAILABLE_BALANCE_CENTS - successfulDeductions,
    );
    return reconciled;
  } catch {
    return AVAILABLE_BALANCE_CENTS;
  }
}

/**
 * Reconcile payroll savings:
 * Start from canonical baseline and add any successful transfers TO payroll.
 */
function reconcilePayrollBalance(): number {
  try {
    const stored = localStorage.getItem("admin_transfer_transactions");
    const transfers: Array<{
      status: string;
      destination: string;
      source: string;
      amount: number;
    }> = stored ? JSON.parse(stored) : [];

    const successfulAdditions = transfers
      .filter(
        (t) => t.status === "successful" && t.destination === "payroll_savings",
      )
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const successfulDeductions = transfers
      .filter((t) => t.status === "successful" && t.source === "payroll")
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const reconciled = Math.max(
      0,
      PAYROLL_SAVINGS_CENTS + successfulAdditions - successfulDeductions,
    );
    return reconciled;
  } catch {
    return PAYROLL_SAVINGS_CENTS;
  }
}

function readCents(key: string, fallback: number): number {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      localStorage.setItem(key, String(fallback));
      return fallback;
    }
    const parsed = Number.parseInt(stored, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      localStorage.setItem(key, String(fallback));
      return fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function writeCents(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(Math.max(0, value)));
    window.dispatchEvent(new CustomEvent("admin-balance-updated"));
  } catch {
    // ignore
  }
}

/** Read available balance directly from localStorage (no React state) */
export function getAdminAvailableBalance(): number {
  return readCents(KEYS.available, AVAILABLE_BALANCE_CENTS);
}

/** Read payroll savings balance directly from localStorage (no React state) */
export function getAdminPayrollBalance(): number {
  return readCents(KEYS.payroll, PAYROLL_SAVINGS_CENTS);
}

export interface AdminBalance {
  availableCents: number;
  payrollCents: number;
  creditCents: number;
  deductFromAvailable: (cents: number) => void;
  addToAvailable: (cents: number) => void;
  deductFromPayroll: (cents: number) => void;
  addToPayroll: (cents: number) => void;
  deductFromCredit: (cents: number) => void;
  addToCredit: (cents: number) => void;
}

export function useAdminBalance(): AdminBalance {
  // On mount, reconcile balances from transaction history
  // This ensures failed transactions never permanently reduce the balance
  const [availableCents, setAvailableCents] = useState<number>(() => {
    const reconciled = reconcileAvailableBalance();
    writeCents(KEYS.available, reconciled);
    return reconciled;
  });

  const [payrollCents, setPayrollCents] = useState<number>(() => {
    const reconciled = reconcilePayrollBalance();
    writeCents(KEYS.payroll, reconciled);
    return reconciled;
  });

  // Credit is always the full $10,000 limit (none used unless explicitly tracked)
  const [creditCents, setCreditCents] = useState<number>(() => {
    const stored = readCents(KEYS.credit, CREDIT_AVAILABLE_CENTS);
    // If stored value is 0 but should be $10,000, correct it
    if (stored === 0) {
      writeCents(KEYS.credit, CREDIT_AVAILABLE_CENTS);
      return CREDIT_AVAILABLE_CENTS;
    }
    return stored;
  });

  // Re-reconcile when payment transactions change (e.g. after a failed attempt)
  useEffect(() => {
    const handleUpdate = () => {
      const reconciled = reconcileAvailableBalance();
      setAvailableCents(reconciled);
      writeCents(KEYS.available, reconciled);

      const payrollReconciled = reconcilePayrollBalance();
      setPayrollCents(payrollReconciled);
      writeCents(KEYS.payroll, payrollReconciled);
    };
    window.addEventListener("admin-balance-updated", handleUpdate);
    return () =>
      window.removeEventListener("admin-balance-updated", handleUpdate);
  }, []);

  const deductFromAvailable = (cents: number) => {
    setAvailableCents((prev) => {
      const next = Math.max(0, prev - cents);
      writeCents(KEYS.available, next);
      return next;
    });
  };

  const addToAvailable = (cents: number) => {
    setAvailableCents((prev) => {
      const next = prev + cents;
      writeCents(KEYS.available, next);
      return next;
    });
  };

  const deductFromPayroll = (cents: number) => {
    setPayrollCents((prev) => {
      const next = Math.max(0, prev - cents);
      writeCents(KEYS.payroll, next);
      return next;
    });
  };

  const addToPayroll = (cents: number) => {
    setPayrollCents((prev) => {
      const next = prev + cents;
      writeCents(KEYS.payroll, next);
      return next;
    });
  };

  const deductFromCredit = (cents: number) => {
    setCreditCents((prev) => {
      const next = Math.max(0, prev - cents);
      writeCents(KEYS.credit, next);
      return next;
    });
  };

  const addToCredit = (cents: number) => {
    setCreditCents((prev) => {
      const next = Math.min(CREDIT_LIMIT_CENTS, prev + cents);
      writeCents(KEYS.credit, next);
      return next;
    });
  };

  return {
    availableCents,
    payrollCents,
    creditCents,
    deductFromAvailable,
    addToAvailable,
    deductFromPayroll,
    addToPayroll,
    deductFromCredit,
    addToCredit,
  };
}
