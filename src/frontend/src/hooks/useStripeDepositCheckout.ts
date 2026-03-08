import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { STRIPE_SECRET_KEY } from "../lib/stripeConfig";
import { useActor } from "./useActor";

const ZAPIER_WEBHOOK_URL =
  "https://hooks.zapier.com/hooks/catch/26632326/u0i6cx6/";

export function useStripeDepositCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountDollars: number): Promise<string> => {
      if (amountDollars < 0.5)
        throw new Error("Minimum deposit amount is $0.50");

      const amountCents = Math.round(amountDollars * 100);
      const successUrl = `${window.location.origin}/admin?tab=financial&deposit=success`;
      const cancelUrl = `${window.location.origin}/admin?tab=financial&deposit=cancelled`;

      // Build form-encoded body for Stripe API
      const params = new URLSearchParams();
      params.append("mode", "payment");
      params.append("line_items[0][price_data][currency]", "usd");
      params.append(
        "line_items[0][price_data][product_data][name]",
        "ANC Marketplace Deposit",
      );
      params.append(
        "line_items[0][price_data][product_data][description]",
        "Deposit funds into your Stripe account",
      );
      params.append(
        "line_items[0][price_data][unit_amount]",
        String(amountCents),
      );
      params.append("line_items[0][quantity]", "1");
      params.append("success_url", successUrl);
      params.append("cancel_url", cancelUrl);

      // Create Stripe Checkout session directly from frontend
      const response = await fetch(
        "https://api.stripe.com/v1/checkout/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Stripe API returned an invalid response (HTTP ${response.status})`,
        );
      }

      if (!response.ok) {
        const stripeError =
          data?.error?.message ||
          data?.error?.code ||
          `Stripe API error (HTTP ${response.status})`;
        console.error(
          "[useStripeDepositCheckout] Stripe API error:",
          data?.error,
        );
        throw new Error(stripeError);
      }

      const sessionId: string = data.id;
      const sessionUrl: string = data.url;

      if (!sessionUrl || !sessionUrl.startsWith("http")) {
        throw new Error("Invalid Stripe Checkout URL returned from Stripe API");
      }

      // Record the deposit session in the backend ledger (best effort — don't fail deposit if this fails)
      if (actor) {
        try {
          await actor.recordDepositSession(
            sessionId,
            BigInt(amountCents),
            "usd",
          );
        } catch (recordError: any) {
          console.warn(
            "[useStripeDepositCheckout] Failed to record deposit session in backend:",
            recordError?.message,
          );
        }
      }

      // Notify Zapier webhook (fire-and-forget)
      fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({
          event: "deposit_checkout_created",
          amountCents,
          sessionId,
          timestamp: Date.now(),
        }),
      }).catch((err) => {
        console.warn(
          "[useStripeDepositCheckout] Zapier notification failed:",
          err?.message,
        );
      });

      return sessionUrl;
    },
    onSuccess: (checkoutUrl: string) => {
      // Invalidate relevant queries so balances refresh after return
      queryClient.invalidateQueries({ queryKey: ["adminFinancialState"] });
      queryClient.invalidateQueries({ queryKey: ["depositLedger"] });
      queryClient.invalidateQueries({ queryKey: ["transactionLedger"] });
      queryClient.invalidateQueries({ queryKey: ["stripeBalance"] });

      // Redirect to Stripe Checkout — this is a full-page redirect
      window.location.href = checkoutUrl;
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create deposit session";
      toast.error(`Deposit Error: ${message}`);
    },
  });
}
