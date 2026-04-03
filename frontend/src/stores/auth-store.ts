import { create } from 'zustand';
import type { AuthUser } from '@/features/auth/types';
import {
  auth,
  onAuthStateChanged,
  type FirebaseUser,
} from '@/lib/firebase-auth';

export interface AuthState {
  firebaseUser: FirebaseUser | null;
  authUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  clearUser: () => void;
  setAuthUser: (user: AuthUser | null) => void;
  clearAuthUser: () => void;
  setLoading: (loading: boolean) => void;
  initAuthListener: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  firebaseUser: null,
  authUser: null,
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
      authUser: null,
      isAuthenticated: false,
    }),
  setAuthUser: (user) => set({ authUser: user }),
  clearAuthUser: () => set({ authUser: null }),
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
