import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';

export interface UpdateUserInput {
  userId: string;
  name: string;
  introduction: string;
}

export function useUpdateUser() {
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  return useMutation({
    mutationFn: async ({ userId, name, introduction }: UpdateUserInput) => {
      await apiClient.patch(`/api/v1/users/${userId}`, {
        name,
        introduction,
      });

      return {
        userId,
        name,
        introduction,
      } satisfies UpdateUserInput;
    },
    onSuccess: ({ name, introduction }) => {
      const authUser = useAuthStore.getState().authUser;

      if (!authUser) {
        return;
      }

      setAuthUser({
        ...authUser,
        name,
        introduction,
      });
    },
  });
}
