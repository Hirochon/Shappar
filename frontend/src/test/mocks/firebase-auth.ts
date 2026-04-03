export {
  getIdToken,
  GoogleAuthProvider,
  mockAuth,
  onAuthStateChanged,
  resetFirebaseAuthMocks,
  signInWithPopup,
  signOut,
} from '@/test/mocks/firebase';

import { GoogleAuthProvider, mockAuth } from '@/test/mocks/firebase';

export const auth = mockAuth;
export const googleProvider = new GoogleAuthProvider();
export const isMockAuthEnabled = false;
