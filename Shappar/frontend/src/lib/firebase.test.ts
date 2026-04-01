import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));

describe('firebase client setup', () => {
  beforeEach(async () => {
    vi.resetModules();
    const { resetFirebaseAuthMocks } = await import('@/test/mocks/firebase');
    resetFirebaseAuthMocks();
  });

  it('initializes auth with a Google provider', async () => {
    const firebaseModule = await import('@/lib/firebase');
    const authModule = await import('firebase/auth');
    const { mockAuth } = await import('@/test/mocks/firebase');

    expect(firebaseModule.auth).toBe(mockAuth);
    expect(authModule.getAuth).toHaveBeenCalledTimes(1);
    expect(authModule.getAuth).toHaveBeenCalledWith(firebaseModule.firebaseApp);
    expect(firebaseModule.googleProvider).toBeInstanceOf(
      authModule.GoogleAuthProvider,
    );
  });

  it('exposes Firebase Auth helpers as vi mocks', async () => {
    const authModule = await import('firebase/auth');
    const auth = {} as never;
    const provider = {} as never;
    const observer = (() => undefined) as never;

    expect(vi.isMockFunction(authModule.signInWithPopup)).toBe(true);
    expect(vi.isMockFunction(authModule.signOut)).toBe(true);
    expect(vi.isMockFunction(authModule.onAuthStateChanged)).toBe(true);
    expect(vi.isMockFunction(authModule.getIdToken)).toBe(true);

    const popupResult = { user: { uid: 'mock-user' } };
    vi.mocked(authModule.signInWithPopup).mockResolvedValueOnce(
      popupResult as never,
    );
    await expect(authModule.signInWithPopup(auth, provider)).resolves.toBe(
      popupResult,
    );

    vi.mocked(authModule.signOut).mockResolvedValueOnce(undefined);
    await expect(authModule.signOut(auth)).resolves.toBeUndefined();

    const unsubscribe = vi.fn();
    vi.mocked(authModule.onAuthStateChanged).mockImplementationOnce(
      () => unsubscribe,
    );
    expect(authModule.onAuthStateChanged(auth, observer)).toBe(unsubscribe);

    vi.mocked(authModule.getIdToken).mockResolvedValueOnce('mock-id-token');
    await expect(authModule.getIdToken({} as never)).resolves.toBe('mock-id-token');
  });
});
