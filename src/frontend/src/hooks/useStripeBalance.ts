import { useQuery } from "@tanstack/react-query";
import { STRIPE_SECRET_KEY } from "../lib/stripeConfig";

export interface StripeBalanceResult {
  availableCents: number;
  pendingCents: number;
  currency: string;
}

export function useStripeBalance() {
  return useQuery<StripeBalanceResult>({
    queryKey: ["stripeBalance"],
    queryFn: async (): Promise<StripeBalanceResult> => {
      const response = await fetch("https://api.stripe.com/v1/balance", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData?.error?.message || `Stripe API error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Extract USD available and pending balances
      const available = data.available || [];
      const pending = data.pending || [];

      const usdAvailable = available.find(
        (b: { currency: string; amount: number }) => b.currency === "usd",
      );
      const usdPending = pending.find(
        (b: { currency: string; amount: number }) => b.currency === "usd",
      );

      return {
        availableCents: usdAvailable?.amount ?? 0,
        pendingCents: usdPending?.amount ?? 0,
        currency: "usd",
      };
    },
    staleTime: 30_000, // 30 seconds
    retry: 1,
  });
}
