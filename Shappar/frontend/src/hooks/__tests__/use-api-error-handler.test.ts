import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigateMock = vi.hoisted(() => vi.fn());
const authStoreState = vi.hoisted(() => ({
  clearUser: vi.fn(),
  clearAuthUser: vi.fn(),
}));

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return { auth: mockAuth };
});
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('@/stores/auth-store', () => {
  const useAuthStore = Object.assign(
    (selector: (state: typeof authStoreState) => unknown) =>
      selector(authStoreState),
    {
      getState: () => authStoreState,
    },
  );

  return { useAuthStore };
});

import { ApiError } from '@/lib/api-client';
import { useApiErrorHandler } from '@/hooks/use-api-error-handler';
import { renderHook } from '@/test/test-utils';

describe('useApiErrorHandler', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    authStoreState.clearUser.mockReset();
    authStoreState.clearAuthUser.mockReset();
  });

  it('clears the auth store and redirects to /login on 401 errors', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    result.current(new ApiError('Unauthorized', 401, { message: 'Unauthorized' }));

    expect(authStoreState.clearUser).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('returns a permission error message for 403 errors', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    expect(
      result.current(new ApiError('Forbidden', 403, { message: 'Forbidden' })),
    ).toBe('権限がありません');
  });

  it('returns a not found message for 404 errors', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    expect(
      result.current(new ApiError('Not Found', 404, { message: 'Not Found' })),
    ).toBe('見つかりませんでした');
  });

  it('returns a server error message for 500 errors', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    expect(
      result.current(
        new ApiError('Internal Server Error', 500, {
          message: 'Internal Server Error',
        }),
      ),
    ).toBe('サーバーエラーが発生しました');
  });

  it('returns a network error message for network errors', () => {
    const { result } = renderHook(() => useApiErrorHandler());

    expect(result.current(new ApiError('Failed to fetch', 0, null))).toBe(
      'ネットワーク接続を確認してください',
    );
  });
});
