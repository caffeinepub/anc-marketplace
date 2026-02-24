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

      // Make direct Stripe Payouts API call
      const params = new URLSearchParams();
      params.append('amount', String(amountCents));
      params.append('currency', currency.toLowerCase());
      if (description) params.append('description', description);
      params.append('method', 'instant');

      const response = await fetch('https://api.stripe.com/v1/payouts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || `Stripe API error: ${response.status}`);
      }

      const payout = data as StripePayout;

      // Record the transaction in the backend
      const transactionRecord: PayoutTransactionRecord = {
        id: generateId(),
        amount: BigInt(amountCents),
        currency: new TextEncoder().encode(currency.toLowerCase()),
        description,
        status: Variant_pending_completed_failed.pending,
        createdAt: BigInt(Date.now()) * BigInt(1_000_000), // nanoseconds
      };

      await actor.recordTransaction(transactionRecord);

      return { payout, transactionRecord };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payoutTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['sellerBalance'] });
    },
  });
}
