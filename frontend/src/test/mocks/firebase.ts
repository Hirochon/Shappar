import { vi } from 'vitest';

type AuthStateChangeCallback = (user: unknown) => void;
type Unsubscribe = () => void;

export const mockAuth = {
  currentUser: null as unknown,
};

export class GoogleAuthProvider {
  setCustomParameters = vi.fn();
}

export const getAuth = vi.fn(() => mockAuth);
export const signInWithPopup = vi.fn();
export const signOut = vi.fn();
export const getIdToken = vi.fn();
export const onAuthStateChanged = vi.fn(
  (_auth: unknown, callback: AuthStateChangeCallback): Unsubscribe => {
    callback(mockAuth.currentUser);
    return vi.fn();
  },
);

export function resetFirebaseAuthMocks() {
  mockAuth.currentUser = null;

  getAuth.mockReset();
  getAuth.mockReturnValue(mockAuth);

  signInWithPopup.mockReset();
  signOut.mockReset();
  getIdToken.mockReset();

  onAuthStateChanged.mockReset();
  onAuthStateChanged.mockImplementation(
    (_auth: unknown, callback: AuthStateChangeCallback): Unsubscribe => {
      callback(mockAuth.currentUser);
      return vi.fn();
    },
  );
}

resetFirebaseAuthMocks();
