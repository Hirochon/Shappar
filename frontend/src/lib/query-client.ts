import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { handleGlobalApiError } from '@/hooks/use-api-error-handler';

export function createQueryClient() {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError: (error) => {
        handleGlobalApiError(error);
      },
    }),
    queryCache: new QueryCache({
      onError: (error) => {
        handleGlobalApiError(error);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}

export const queryClient = createQueryClient();
