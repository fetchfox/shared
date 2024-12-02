import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalContextProvider } from '../contexts';

const queryClient = new QueryClient();

export function SharedProvider({ children }) {
  return (
    <GlobalContextProvider>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GlobalContextProvider>
  );
}
