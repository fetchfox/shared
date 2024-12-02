import { Loading } from '@/src';

export function PaymentsLoading() {
  // the default is too large and high-contrast
  return <Loading color="#aaaaaa" size={24} />;
}
