import { Button, callApi, Loading } from '@/src';
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { PaymentsLoading } from './PaymentsLoading';

export function CardForm({ onSubmit }) {
  const stripe = useStripe();
  const elements = useElements();

  const submit = useMutation({
    mutationFn: async (e) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      const { setupIntent, error } = await stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) throw new Error(error);

      await callApi('POST', '/api/v2/payments/card', {
        paymentMethodId: setupIntent.payment_method,
      });
    },
    onError: (err) => console.error(err.toString()),
    onSuccess: onSubmit,
  });

  if (!stripe || !elements) return <PaymentsLoading />;

  return (
    <form onSubmit={submit.mutate}>
      <PaymentElement />
      <Button disabled={!stripe} type="submit" style={{ marginTop: 16 }} loading={submit.isPending}>
        Add payment method
      </Button>
    </form>
  );
}
