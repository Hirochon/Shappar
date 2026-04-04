import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { createQueryClient } from '@/lib/query-client';

export function createHookTestQueryClient() {
  const queryClient = createQueryClient();
  const defaultOptions = queryClient.getDefaultOptions();

  queryClient.setDefaultOptions({
    queries: {
      ...defaultOptions.queries,
      retry: false,
    },
    mutations: {
      ...defaultOptions.mutations,
      retry: false,
    },
  });

  return queryClient;
}

export function createHookWrapper(queryClient: QueryClient) {
  return function QueryClientWrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}
