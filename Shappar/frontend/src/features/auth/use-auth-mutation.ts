import { useMutation } from '@tanstack/react-query';
import { getIdToken, type User as FirebaseUser } from 'firebase/auth';
import { extractAuthUser, type AuthResponse } from '@/features/auth/types';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export function useAuthMutation() {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const clearAuthUser = useAuthStore((state) => state.clearAuthUser);

  return useMutation({
    onMutate: () => {
      clearAuthUser();
    },
    mutationFn: async (firebaseUser: FirebaseUser) => {
      const idToken = await getIdToken(firebaseUser);
      const response = await apiClient<AuthResponse>('/api/v1/auth', {
        method: 'POST',
        idToken,
      });

      return extractAuthUser(response);
    },
    onSuccess: (authUser) => {
      setAuthUser(authUser);
    },
  });
}
