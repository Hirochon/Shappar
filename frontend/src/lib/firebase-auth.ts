import {
  getIdToken as getFirebaseIdToken,
  onAuthStateChanged as onFirebaseAuthStateChanged,
  signInWithPopup as signInWithFirebasePopup,
  signOut as signOutFromFirebase,
  type GoogleAuthProvider,
  type User as FirebaseUser,
  type UserCredential,
} from 'firebase/auth';
import { auth as firebaseAuth, googleProvider } from '@/lib/firebase';

const MOCK_AUTH_ID_TOKEN = 'mock-id-token';
const MOCK_AUTH_STORAGE_KEY = 'shappar:mock-auth-session';
const MOCK_FIREBASE_USER = {
  displayName: 'Shappar User',
  email: 'mock-user@example.com',
  photoURL: 'https://example.com/icon.png',
  uid: 'mock-user-123',
} as FirebaseUser;

type AuthClient = {
  currentUser: FirebaseUser | null;
};

type AuthStateListener = (user: FirebaseUser | null) => void;

export const isMockAuthEnabled =
  import.meta.env.VITE_ENABLE_MOCKS === 'true';

function getStoredMockSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(MOCK_AUTH_STORAGE_KEY);
}

function persistMockSession(isAuthenticated: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  if (isAuthenticated) {
    window.localStorage.setItem(MOCK_AUTH_STORAGE_KEY, MOCK_FIREBASE_USER.uid);
    return;
  }

  window.localStorage.removeItem(MOCK_AUTH_STORAGE_KEY);
}

const mockAuth: AuthClient = {
  currentUser:
    isMockAuthEnabled && getStoredMockSession() ? MOCK_FIREBASE_USER : null,
};

const mockAuthListeners = new Set<AuthStateListener>();

function notifyMockAuthListeners() {
  for (const listener of mockAuthListeners) {
    listener(mockAuth.currentUser);
  }
}

export const auth: AuthClient = isMockAuthEnabled ? mockAuth : firebaseAuth;
export { googleProvider };
export type { FirebaseUser };

export async function signInWithPopup(
  authClient: AuthClient,
  provider: GoogleAuthProvider,
) {
  if (!isMockAuthEnabled) {
    return signInWithFirebasePopup(
      authClient as typeof firebaseAuth,
      provider,
    );
  }

  mockAuth.currentUser = MOCK_FIREBASE_USER;
  persistMockSession(true);
  notifyMockAuthListeners();

  return {
    user: MOCK_FIREBASE_USER,
  } as UserCredential;
}

export function onAuthStateChanged(
  authClient: AuthClient,
  listener: AuthStateListener,
) {
  if (!isMockAuthEnabled) {
    return onFirebaseAuthStateChanged(
      authClient as typeof firebaseAuth,
      listener,
    );
  }

  mockAuthListeners.add(listener);
  listener(authClient.currentUser);

  return () => {
    mockAuthListeners.delete(listener);
  };
}

export function getIdToken(user: FirebaseUser) {
  if (!isMockAuthEnabled) {
    return getFirebaseIdToken(user);
  }

  return Promise.resolve(MOCK_AUTH_ID_TOKEN);
}

export async function signOut(authClient: AuthClient) {
  if (!isMockAuthEnabled) {
    await signOutFromFirebase(authClient as typeof firebaseAuth);
    return;
  }

  mockAuth.currentUser = null;
  persistMockSession(false);
  notifyMockAuthListeners();
}
