import { afterEach, describe, expect, it, vi } from 'vitest';

const clearUserMock = vi.hoisted(() => vi.fn());

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));
vi.mock('@/stores/auth-store', () => {
  const useAuthStore = Object.assign(
    (selector: (state: { clearUser: () => void }) => unknown) =>
      selector({ clearUser: clearUserMock }),
    {
      getState: () => ({
        clearUser: clearUserMock,
      }),
    },
  );

  return { useAuthStore };
});

import { ApiError } from '@/lib/api-client';
import { createQueryClient } from '@/lib/query-client';

describe('createQueryClient', () => {
  afterEach(() => {
    clearUserMock.mockReset();
    vi.restoreAllMocks();
  });

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

  it('registers global query and mutation error handlers', () => {
    const queryClient = createQueryClient();

    expect(queryClient.getQueryCache().config.onError).toEqual(
      expect.any(Function),
    );
    expect(queryClient.getMutationCache().config.onError).toEqual(
      expect.any(Function),
    );
  });

  it('clears auth state and redirects on global 401 query errors', () => {
    const queryClient = createQueryClient();
    const initialPath = window.location.pathname;

    queryClient.getQueryCache().config.onError?.(
      new ApiError('Unauthorized', 401, { message: 'Unauthorized' }),
      {} as never,
    );

    expect(clearUserMock).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/login');

    window.history.replaceState(null, '', initialPath);
  });
});
