import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { ShoppingItem } from '../backend';

export type CheckoutSession = {
  id: string;
  url: string;
};

export function useCreateCheckoutSession() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (items: ShoppingItem[]): Promise<void> => {
      if (!actor) throw new Error('Actor not available');

      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const successUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      const result = await actor.createCheckoutSession(items, successUrl, cancelUrl);

      // JSON parsing is critical for Stripe integration
      const session = JSON.parse(result) as CheckoutSession;

      if (!session?.url) {
        throw new Error('Stripe session missing url');
      }

      // Redirect to Stripe checkout (full page redirect, not router navigation)
      window.location.href = session.url;
    },
  });
}
