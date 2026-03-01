import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { STRIPE_SECRET_KEY, StripePayout } from '../lib/stripeConfig';
import { PayoutTransactionRecord, Variant_pending_completed_failed } from '../backend';

interface PayoutParams {
  amountCents: number;
  currency: string;
  description: string;
}

interface PayoutResult {
  payout: StripePayout;
  transactionRecord: PayoutTransactionRecord;
}

function generateId(): string {
  return `payout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function useStripePayout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<PayoutResult, Error, PayoutParams>({
    mutationFn: async ({ amountCents, currency, description }: PayoutParams) => {
      if (!actor) throw new Error('Actor not available');

      // Validate amount is a positive integer (cents)
      const amountInt = Math.round(amountCents);
      if (!amountInt || amountInt <= 0) {
        throw new Error('Invalid payout amount. Amount must be greater than zero.');
      }

      // Make direct Stripe Payouts API call
      // Standard payout to the bank account linked to the Stripe account
      const params = new URLSearchParams();
      params.append('amount', String(amountInt));
      params.append('currency', currency.toLowerCase());
      if (description) params.append('description', description);
      // 'method' defaults to 'standard' (1-2 business days)
      // Do NOT pass 'method: instant' unless instant payouts are explicitly enabled

      const response = await fetch('https://api.stripe.com/v1/payouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Stripe API returned an invalid response (HTTP ${response.status})`);
      }

      if (!response.ok) {
        // Surface the specific Stripe error message
        const stripeError = data?.error?.message || data?.error?.code || `Stripe API error (HTTP ${response.status})`;
        console.error('[useStripePayout] Stripe API error:', data?.error);
        throw new Error(stripeError);
      }

      const payout = data as StripePayout;

      // Record the transaction in the backend
      const transactionRecord: PayoutTransactionRecord = {
        id: generateId(),
        amount: BigInt(amountInt),
        currency: new TextEncoder().encode(currency.toLowerCase()),
        description,
        status: Variant_pending_completed_failed.pending,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000), // nanoseconds
      };

      try {
        await actor.recordTransaction(transactionRecord);
      } catch (recordError: any) {
        // Log but don't fail the payout if recording fails
        console.error('[useStripePayout] Failed to record transaction in backend:', recordError?.message);
      }

      return { payout, transactionRecord };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['sellerBalance'] });
      queryClient.invalidateQueries({ queryKey: ['adminFinancialState'] });
    },
  });
}
