import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useStripeDepositCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amountDollars: number): Promise<string> => {
      if (!actor) throw new Error('Actor not available');
      if (amountDollars < 0.5) throw new Error('Minimum deposit amount is $0.50');

      const amountCents = BigInt(Math.round(amountDollars * 100));
      const currency = 'usd';

      // Call backend to create a Stripe Checkout session for deposit
      const checkoutUrl = await actor.createDepositCheckoutSession(amountCents, currency);

      if (!checkoutUrl || !checkoutUrl.startsWith('http')) {
        throw new Error('Invalid Stripe Checkout URL returned from server');
      }

      return checkoutUrl;
    },
    onSuccess: (checkoutUrl: string) => {
      // Invalidate relevant queries so balances refresh after return
      queryClient.invalidateQueries({ queryKey: ['adminFinancialState'] });
      queryClient.invalidateQueries({ queryKey: ['depositLedger'] });
      queryClient.invalidateQueries({ queryKey: ['transactionLedger'] });

      // Redirect to Stripe Checkout — this is a full-page redirect
      window.location.href = checkoutUrl;
    },
    onError: (error: unknown) => {
      const message = error instanceof Error ? error.message : 'Failed to create deposit session';
      toast.error(`Deposit Error: ${message}`);
    },
  });
}
