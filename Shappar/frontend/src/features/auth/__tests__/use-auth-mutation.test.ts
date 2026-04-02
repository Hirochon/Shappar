import { act } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { getIdToken, type User as FirebaseUser } from 'firebase/auth';
import { HttpResponse, http } from 'msw';
import { createElement } from 'react';
import type { PropsWithChildren } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return { auth: mockAuth };
});

import { useAuthMutation } from '@/features/auth/use-auth-mutation';
import type { AuthUser } from '@/features/auth/types';
import { createQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { server } from '@/test/mocks/server';
import { renderHook, waitFor } from '@/test/test-utils';

const API_BASE_URL = 'http://localhost:8040';

const mockAuthUser: AuthUser = {
  unique_id: 'unique-user-123',
  user_id: 'user-123',
  name: 'Shappar User',
  introduction: 'I love taking pictures with friends.',
  iconimage: 'https://example.com/icon.png',
  homeimage: 'https://example.com/home.png',
};

function createMockFirebaseUser(overrides: Partial<FirebaseUser> = {}) {
  return {
    uid: 'firebase-user-123',
    email: 'firebase@example.com',
    displayName: 'Firebase User',
    ...overrides,
  } as FirebaseUser;
}

function createWrapper() {
  const queryClient = createQueryClient();

  return function Wrapper({ children }: PropsWithChildren) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  };
}

describe('useAuthMutation', () => {
  beforeEach(() => {
    vi.mocked(getIdToken).mockReset();

    useAuthStore.setState({
      firebaseUser: null,
      authUser: null,
      isAuthenticated: false,
      isLoading: true,
    });

    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth`, () => {
        return HttpResponse.json({ user: mockAuthUser });
      }),
    );
  });

  it('sends the idToken and returns the authenticated user', async () => {
    const firebaseUser = createMockFirebaseUser();
    let authorizationHeader: string | null = null;

    vi.mocked(getIdToken).mockResolvedValueOnce('valid-id-token');
    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth`, ({ request }) => {
        authorizationHeader = request.headers.get('authorization');

        return HttpResponse.json({ user: mockAuthUser });
      }),
    );

    const { result } = renderHook(() => useAuthMutation(), {
      wrapper: createWrapper(),
    });

    let response:
      | {
          user: AuthUser;
        }
      | undefined;

    await act(async () => {
      response = await result.current.mutateAsync(firebaseUser);
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(getIdToken).toHaveBeenCalledTimes(1);
    expect(getIdToken).toHaveBeenCalledWith(firebaseUser);
    expect(authorizationHeader).toBe('Bearer valid-id-token');
    expect(response).toEqual({ user: mockAuthUser });
  });

  it('stores the authenticated user in the auth store on success', async () => {
    const firebaseUser = createMockFirebaseUser();

    vi.mocked(getIdToken).mockResolvedValueOnce('valid-id-token');

    const { result } = renderHook(() => useAuthMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync(firebaseUser);
    });

    await waitFor(() => {
      expect(useAuthStore.getState().authUser).toEqual(mockAuthUser);
    });
  });

  it('surfaces an unauthorized error when the idToken is invalid', async () => {
    const firebaseUser = createMockFirebaseUser();
    let mutationError: unknown;

    vi.mocked(getIdToken).mockResolvedValueOnce('invalid-id-token');
    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth`, () => {
        return HttpResponse.json(
          { message: 'Unauthorized' },
          { status: 401 },
        );
      }),
    );

    const { result } = renderHook(() => useAuthMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(firebaseUser);
      } catch (error) {
        mutationError = error;
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mutationError).toMatchObject({ status: 401 });
    expect(useAuthStore.getState().authUser).toBeNull();
  });

  it('surfaces a network error when the request cannot be completed', async () => {
    const firebaseUser = createMockFirebaseUser();
    let mutationError: unknown;

    vi.mocked(getIdToken).mockResolvedValueOnce('valid-id-token');
    server.use(
      http.post(`${API_BASE_URL}/api/v1/auth`, () => {
        return HttpResponse.error();
      }),
    );

    const { result } = renderHook(() => useAuthMutation(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync(firebaseUser);
      } catch (error) {
        mutationError = error;
      }
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(mutationError).toBeInstanceOf(Error);
    expect(useAuthStore.getState().authUser).toBeNull();
  });
});
