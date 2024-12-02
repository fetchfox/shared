import { Button, useGlobalContext } from '@/src';
import { callApi } from '@/src/api';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { CardForm } from './CardForm';
import { PaymentsLoading } from './PaymentsLoading';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export function PaymentsView() {
  const { apiKey } = useGlobalContext();
  const [currentCard, setCurrentCard] = useState(null);

  useEffect(() => {
    if (!apiKey) return;

    async function run() {
      if (currentCard) {
        if (currentCard.exists) return;

        const resp = await callApi('POST', '/api/v2/payments/intent');
        const data = await resp.json();
        setClientSecret(data.clientSecret);
      } else {
        const resp = await callApi('GET', '/api/v2/payments/card');
        const data = await resp.json();
        setCurrentCard(data);
      }
    }

    run();
  }, [apiKey, currentCard]);

  const [clientSecret, setClientSecret] = useState(undefined);

  const removeCard = useMutation({
    mutationFn: () => callApi('DELETE', '/api/v2/payments/card'),
    onError: console.error,
    onSuccess: () => setCurrentCard(null),
  });

  if (!currentCard) return <PaymentsLoading />;

  if (currentCard.exists) {
    return (
      <div>
        {currentCard.last4 ? (
          <div>
            Your card ending in <b>{currentCard.last4}</b> has been added.
          </div>
        ) : (
          <div>Your payment method has been added.</div>
        )}
        <div style={{ marginTop: 8 }}>
          <Button onClick={removeCard.mutate} loading={removeCard.isPending}>
            Remove
          </Button>
        </div>
      </div>
    );
  }

  if (!clientSecret) return <PaymentsLoading />;

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, currency: 'usd' }}>
      <CardForm onSubmit={() => setCurrentCard(null)} />
    </Elements>
  );
}
