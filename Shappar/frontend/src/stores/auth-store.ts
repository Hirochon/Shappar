import { create } from 'zustand';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) =>
    set({
      firebaseUser: user,
      isAuthenticated: Boolean(user),
    }),
  clearUser: () =>
    set({
      firebaseUser: null,
      isAuthenticated: false,
    }),
  setLoading: (loading) => set({ isLoading: loading }),
  initAuthListener: () =>
    onAuthStateChanged(auth, (user) => {
      if (user) {
        get().setUser(user);
      } else {
        get().clearUser();
      }

      get().setLoading(false);
    }),
}));
