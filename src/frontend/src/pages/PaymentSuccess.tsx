import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowDownToLine, CheckCircle2 } from "lucide-react";
import React from "react";
import AdminConsoleLayout from "../components/admin/AdminConsoleLayout";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  // Detect if this is a deposit return from Stripe Checkout
  const searchParams = new URLSearchParams(window.location.search);
  const type = searchParams.get("type");
  const isDeposit = type === "deposit";

  if (isDeposit) {
    return (
      <AdminConsoleLayout
        title="Deposit Successful"
        subtitle="Your funds have been deposited into your Stripe account"
      >
        <div className="flex items-center justify-center py-12">
          <Card className="max-w-md w-full border-emerald-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-emerald-100 p-3">
                  <ArrowDownToLine className="h-12 w-12 text-emerald-600" />
                </div>
              </div>
              <div className="flex justify-center mb-2">
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  Deposit Confirmed
                </Badge>
              </div>
              <CardTitle className="text-2xl">Deposit Successful!</CardTitle>
              <CardDescription>
                Your deposit was successful. Funds have been added to your
                Stripe account and your ledger has been updated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    Real funds have been deposited into your Stripe account
                    (currency: USD).
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    You can verify the balance in your Stripe Dashboard at
                    dashboard.stripe.com.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <p>
                    Your deposit ledger has been updated with this transaction
                    record.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() =>
                    navigate({
                      to: "/admin",
                      search: { tab: "financial" } as any,
                    })
                  }
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  View Financial Overview
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    navigate({
                      to: "/admin",
                      search: { tab: "transactions" } as any,
                    })
                  }
                  className="w-full"
                >
                  View Transactions
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/admin">Return to Admin Center</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminConsoleLayout>
    );
  }

  // Default payment success (non-deposit)
  return (
    <AdminConsoleLayout
      title="Payment Successful"
      subtitle="Your payment has been processed successfully"
    >
      <div className="flex items-center justify-center py-12">
        <Card className="max-w-md w-full border-emerald-200 dark:border-emerald-900">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-emerald-100 dark:bg-emerald-900 p-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>
              Your payment has been processed and your account has been updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground text-center">
              <p>
                The transaction has been recorded in your admin financial
                history.
              </p>
              <p className="mt-2">
                You can review the details in the Transactions section.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link to="/admin">Return to Admin Center</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/admin",
                    search: { tab: "transactions" } as any,
                  })
                }
                className="w-full"
              >
                View Transactions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminConsoleLayout>
  );
}
