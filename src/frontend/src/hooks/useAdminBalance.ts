import { useState } from "react";

// Canonical constants (in cents)
export const AVAILABLE_BALANCE_CENTS = 7_368_116; // $73,681.16
export const PAYROLL_SAVINGS_CENTS = 427_622; // $4,276.22
export const CREDIT_AVAILABLE_CENTS = 1_000_000; // $10,000.00

const KEYS = {
  available: "admin_balance_available",
  payroll: "admin_balance_payroll",
  credit: "admin_balance_credit",
} as const;

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
  const [availableCents, setAvailableCents] = useState<number>(() =>
    readCents(KEYS.available, AVAILABLE_BALANCE_CENTS),
  );
  const [payrollCents, setPayrollCents] = useState<number>(() =>
    readCents(KEYS.payroll, PAYROLL_SAVINGS_CENTS),
  );
  const [creditCents, setCreditCents] = useState<number>(() =>
    readCents(KEYS.credit, CREDIT_AVAILABLE_CENTS),
  );

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
      const next = prev + cents;
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
