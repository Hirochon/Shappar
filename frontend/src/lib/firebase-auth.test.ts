import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { GoogleAuthProvider, mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
    googleProvider: new GoogleAuthProvider(),
  };
});

async function loadFirebaseAuthModule() {
  return import('@/lib/firebase-auth');
}

describe('firebase-auth runtime wrapper', () => {
  beforeEach(async () => {
    vi.unstubAllEnvs();
    vi.resetModules();
    window.localStorage.clear();
    const { resetFirebaseAuthMocks } = await import('@/test/mocks/firebase');
    resetFirebaseAuthMocks();
  });

  it('creates and clears a mock auth session when VITE_ENABLE_MOCKS=true', async () => {
    vi.stubEnv('DEV', true);
    vi.stubEnv('VITE_ENABLE_MOCKS', 'true');

    const firebaseAuth = await loadFirebaseAuthModule();
    const authStateListener = vi.fn();
    const unsubscribe = firebaseAuth.onAuthStateChanged(
      firebaseAuth.auth,
      authStateListener,
    );

    expect(authStateListener).toHaveBeenCalledWith(null);

    const credentials = await firebaseAuth.signInWithPopup(
      firebaseAuth.auth,
      firebaseAuth.googleProvider,
    );

    expect(credentials.user).toMatchObject({
      uid: 'mock-user-123',
      displayName: 'Shappar User',
    });
    expect(firebaseAuth.auth.currentUser).toEqual(credentials.user);
    expect(window.localStorage.getItem('shappar:mock-auth-session')).toBe(
      'mock-user-123',
    );
    expect(authStateListener).toHaveBeenLastCalledWith(credentials.user);
    await expect(firebaseAuth.getIdToken(credentials.user)).resolves.toBe(
      'mock-id-token',
    );

    await firebaseAuth.signOut(firebaseAuth.auth);

    expect(firebaseAuth.auth.currentUser).toBeNull();
    expect(window.localStorage.getItem('shappar:mock-auth-session')).toBeNull();
    expect(authStateListener).toHaveBeenLastCalledWith(null);
    unsubscribe();
  });

  it('restores a mock auth session from localStorage', async () => {
    vi.stubEnv('DEV', true);
    vi.stubEnv('VITE_ENABLE_MOCKS', 'true');
    window.localStorage.setItem('shappar:mock-auth-session', 'mock-user-123');

    const firebaseAuth = await loadFirebaseAuthModule();

    expect(firebaseAuth.auth.currentUser).toMatchObject({
      uid: 'mock-user-123',
      displayName: 'Shappar User',
    });
  });

  it('disables mock auth outside DEV even when VITE_ENABLE_MOCKS=true', async () => {
    vi.stubEnv('DEV', false);
    vi.stubEnv('VITE_ENABLE_MOCKS', 'true');

    const authModule = await import('firebase/auth');
    const firebaseUser = { uid: 'firebase-user-123' } as never;
    vi.mocked(authModule.signInWithPopup).mockResolvedValueOnce({
      user: firebaseUser,
    } as never);

    const firebaseAuth = await loadFirebaseAuthModule();

    expect(firebaseAuth.isMockAuthEnabled).toBe(false);
    await expect(
      firebaseAuth.signInWithPopup(
        firebaseAuth.auth,
        firebaseAuth.googleProvider,
      ),
    ).resolves.toEqual({
      user: firebaseUser,
    });
    expect(window.localStorage.getItem('shappar:mock-auth-session')).toBeNull();
  });

  it('delegates to Firebase auth when mocks are disabled', async () => {
    const authModule = await import('firebase/auth');
    const firebaseAuth = await loadFirebaseAuthModule();
    const unsubscribe = vi.fn();
    const authStateListener = vi.fn();
    const firebaseUser = { uid: 'firebase-user-123' } as never;

    vi.mocked(authModule.onAuthStateChanged).mockImplementationOnce(
      (_auth, callback) => {
        (callback as (user: null) => void)(null);
        return unsubscribe;
      },
    );
    vi.mocked(authModule.signInWithPopup).mockResolvedValueOnce({
      user: firebaseUser,
    } as never);
    vi.mocked(authModule.getIdToken).mockResolvedValueOnce('valid-id-token');
    vi.mocked(authModule.signOut).mockResolvedValueOnce(undefined);

    expect(
      firebaseAuth.onAuthStateChanged(firebaseAuth.auth, authStateListener),
    ).toBe(unsubscribe);

    await expect(
      firebaseAuth.signInWithPopup(
        firebaseAuth.auth,
        firebaseAuth.googleProvider,
      ),
    ).resolves.toEqual({
      user: firebaseUser,
    });
    await expect(firebaseAuth.getIdToken(firebaseUser)).resolves.toBe(
      'valid-id-token',
    );
    await expect(firebaseAuth.signOut(firebaseAuth.auth)).resolves.toBeUndefined();
  });
});
