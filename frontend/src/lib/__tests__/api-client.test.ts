import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getIdToken, type User as FirebaseUser } from 'firebase/auth';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return { auth: mockAuth };
});

import { ApiError, apiClient } from '@/lib/api-client';
import { mockAuth, resetFirebaseAuthMocks } from '@/test/mocks/firebase';

function createMockFirebaseUser(
  overrides: Partial<FirebaseUser> = {},
): FirebaseUser {
  return {
    uid: 'firebase-user-123',
    email: 'firebase@example.com',
    displayName: 'Firebase User',
    ...overrides,
  } as FirebaseUser;
}

function createJsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

function getRequestHeaders(init: RequestInit | undefined) {
  return new Headers(init?.headers);
}

describe('apiClient', () => {
  beforeEach(() => {
    resetFirebaseAuthMocks();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockAuth.currentUser = null;
  });

  it('uses the configured API base URL when present', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://api.example.test');
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ posts: [] }));

    await apiClient.get<{ posts: [] }>('/api/v1/posts/public');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.example.test/api/v1/posts/public',
      expect.any(Object),
    );
  });

  it('falls back to localhost:8040 when no API base URL is configured', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ posts: [] }));

    await apiClient.get<{ posts: [] }>('/api/v1/posts/public');

    expect(fetchSpy).toHaveBeenCalledWith(
      'http://localhost:8040/api/v1/posts/public',
      expect.any(Object),
    );
  });

  it('automatically attaches the Firebase ID token as a bearer token', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ posts: [] }));
    const firebaseUser = createMockFirebaseUser();

    mockAuth.currentUser = firebaseUser;
    vi.mocked(getIdToken).mockResolvedValueOnce('valid-id-token');

    await apiClient.get<{ posts: [] }>('/api/v1/posts/public');

    const [, init] = fetchSpy.mock.calls[0];
    const headers = getRequestHeaders(init);

    expect(getIdToken).toHaveBeenCalledTimes(1);
    expect(getIdToken).toHaveBeenCalledWith(firebaseUser);
    expect(headers.get('Authorization')).toBe('Bearer valid-id-token');
  });

  it('serializes JSON request bodies and sets Content-Type automatically', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(createJsonResponse({ post_id: 'post-123' }, { status: 201 }));
    const payload = {
      question: 'Where should we go?',
      options: [
        { select_num: 1, answer: 'Beach' },
        { select_num: 2, answer: 'Mountains' },
      ],
    };

    await apiClient.post<{ post_id: string }>('/api/v1/posts', payload);

    const [, init] = fetchSpy.mock.calls[0];
    const headers = getRequestHeaders(init);

    expect(init?.body).toBe(JSON.stringify(payload));
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('parses successful JSON responses', async () => {
    const responseBody = {
      posts: [
        {
          post_id: 'post-123',
          question: 'Favorite photo spot?',
        },
      ],
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse(responseBody),
    );

    await expect(
      apiClient.get<typeof responseBody>('/api/v1/posts/public'),
    ).resolves.toEqual(responseBody);
  });

  it('throws an ApiError for 401 responses', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      createJsonResponse(
        { message: 'Unauthorized' },
        { status: 401, statusText: 'Unauthorized' },
      ),
    );

    let error: unknown;

    try {
      await apiClient.get('/api/v1/posts/public');
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 401,
      message: 'Unauthorized',
      data: { message: 'Unauthorized' },
    });
  });

  it.each([
    [
      'client error',
      404,
      { detail: 'Post not found' },
      'Post not found',
    ],
    [
      'server error',
      500,
      { message: 'Internal Server Error' },
      'Internal Server Error',
    ],
  ])(
    'throws an ApiError for %s responses',
    async (_label, status, responseBody, message) => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        createJsonResponse(responseBody, { status }),
      );

      let error: unknown;

      try {
        await apiClient.get('/api/v1/posts/public');
      } catch (caughtError) {
        error = caughtError;
      }

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({
        status,
        message,
        data: responseBody,
      });
    },
  );

  it('wraps network failures in an ApiError', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new TypeError('Failed to fetch'),
    );

    let error: unknown;

    try {
      await apiClient.get('/api/v1/posts/public');
    } catch (caughtError) {
      error = caughtError;
    }

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 0,
      message: 'Failed to fetch',
      data: null,
    });
  });
});
