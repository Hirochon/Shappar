import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User as FirebaseUser } from 'firebase/auth';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return { auth: mockAuth };
});

async function loadAuthStore() {
  return import('@/stores/auth-store');
}

function createMockUser(overrides: Partial<FirebaseUser> = {}): FirebaseUser {
  return {
    uid: 'user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
    isAnonymous: false,
    metadata: {} as FirebaseUser['metadata'],
    providerData: [],
    refreshToken: 'refresh-token',
    tenantId: null,
    delete: vi.fn(),
    getIdToken: vi.fn(),
    getIdTokenResult: vi.fn(),
    reload: vi.fn(),
    toJSON: vi.fn(),
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
    ...overrides,
  } as FirebaseUser;
}

describe('auth store', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetFirebaseAuthMocks } = await import('@/test/mocks/firebase');
    resetFirebaseAuthMocks();
  });

  it('starts with an unauthenticated loading state', async () => {
    const { useAuthStore } = await loadAuthStore();

    expect(useAuthStore.getState()).toMatchObject({
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('sets a user and marks the session as authenticated', async () => {
    const { useAuthStore } = await loadAuthStore();
    const user = createMockUser();

    useAuthStore.getState().setUser(user);

    expect(useAuthStore.getState()).toMatchObject({
      firebaseUser: user,
      isAuthenticated: true,
      isLoading: true,
    });
  });

  it('clears the user and marks the session as unauthenticated', async () => {
    const { useAuthStore } = await loadAuthStore();
    const user = createMockUser();

    useAuthStore.getState().setUser(user);
    useAuthStore.getState().clearUser();

    expect(useAuthStore.getState()).toMatchObject({
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: true,
    });
  });

  it('updates the loading flag', async () => {
    const { useAuthStore } = await loadAuthStore();

    useAuthStore.getState().setLoading(false);

    expect(useAuthStore.getState().isLoading).toBe(false);
  });

  it('registers the Firebase auth listener and returns its unsubscribe handle', async () => {
    const { useAuthStore } = await loadAuthStore();
    const { onAuthStateChanged } = await import('firebase/auth');
    const { auth } = await import('@/lib/firebase');
    const unsubscribe = vi.fn();

    vi.mocked(onAuthStateChanged).mockImplementationOnce((_auth, callback) => {
      (callback as (user: FirebaseUser | null) => void)(null);
      return unsubscribe;
    });

    const result = useAuthStore.getState().initAuthListener();

    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
    expect(onAuthStateChanged).toHaveBeenCalledWith(
      auth,
      expect.any(Function),
    );
    expect(result).toBe(unsubscribe);
  });

  it('stores the Firebase user when the auth listener reports a login', async () => {
    const { useAuthStore } = await loadAuthStore();
    const { auth } = await import('@/lib/firebase');
    const user = createMockUser({
      uid: 'firebase-user',
      email: 'firebase@example.com',
      displayName: 'Firebase User',
    });

    (auth as { currentUser: FirebaseUser | null }).currentUser = user;

    useAuthStore.getState().initAuthListener();

    expect(useAuthStore.getState()).toMatchObject({
      firebaseUser: user,
      isAuthenticated: true,
      isLoading: false,
    });
    expect(useAuthStore.getState().firebaseUser?.uid).toBe('firebase-user');
    expect(useAuthStore.getState().firebaseUser?.email).toBe(
      'firebase@example.com',
    );
    expect(useAuthStore.getState().firebaseUser?.displayName).toBe(
      'Firebase User',
    );
  });
});
