import { describe, expect, it } from 'vitest';
import { createQueryClient } from '@/lib/query-client';

describe('createQueryClient', () => {
  it('configures the default query and mutation options', () => {
    const queryClient = createQueryClient();
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries).toMatchObject({
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    });
    expect(defaultOptions.mutations).toMatchObject({
      retry: 0,
    });
  });

  it('uses the expected retry policy for queries and mutations', () => {
    const queryClient = createQueryClient();
    const defaultOptions = queryClient.getDefaultOptions();

    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.mutations?.retry).toBe(0);
  });
});
