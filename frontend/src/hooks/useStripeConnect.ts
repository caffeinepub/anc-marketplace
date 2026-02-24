import { useMutation } from '@tanstack/react-query';
import { STRIPE_SECRET_KEY, StripeConnectedAccount, StripeAccountLink } from '../lib/stripeConfig';

interface CreateAccountParams {
  email: string;
}

interface CreateAccountLinkParams {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
}

export function useCreateConnectedAccount() {
  return useMutation<StripeConnectedAccount, Error, CreateAccountParams>({
    mutationFn: async ({ email }: CreateAccountParams) => {
      const params = new URLSearchParams();
      params.append('type', 'express');
      params.append('email', email);
      params.append('capabilities[transfers][requested]', 'true');
      params.append('capabilities[card_payments][requested]', 'true');

      const response = await fetch('https://api.stripe.com/v1/accounts', {
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

      return data as StripeConnectedAccount;
    },
  });
}

export function useCreateAccountLink() {
  return useMutation<StripeAccountLink, Error, CreateAccountLinkParams>({
    mutationFn: async ({ accountId, refreshUrl, returnUrl }: CreateAccountLinkParams) => {
      const params = new URLSearchParams();
      params.append('account', accountId);
      params.append('refresh_url', refreshUrl);
      params.append('return_url', returnUrl);
      params.append('type', 'account_onboarding');

      const response = await fetch('https://api.stripe.com/v1/account_links', {
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

      return data as StripeAccountLink;
    },
  });
}

export function useRetrieveConnectedAccount() {
  return useMutation<StripeConnectedAccount, Error, string>({
    mutationFn: async (accountId: string) => {
      const response = await fetch(`https://api.stripe.com/v1/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || `Stripe API error: ${response.status}`);
      }

      return data as StripeConnectedAccount;
    },
  });
}
