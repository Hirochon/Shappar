import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { userQueryKey } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/auth-store';
import type { UserProfile } from '@/types/api';

export interface UpdateUserInput {
  userId: string;
  name: string;
  introduction: string;
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
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
    onSuccess: ({ userId, name, introduction }) => {
      const authUser = useAuthStore.getState().authUser;

      if (!authUser) {
        return;
      }

      setAuthUser({
        ...authUser,
        name,
        introduction,
      });

      queryClient.setQueryData(
        userQueryKey(userId),
        (current: UserProfile | undefined) =>
          current
            ? {
                ...current,
                name,
                introduction,
              }
            : current,
      );
      void queryClient.invalidateQueries({
        queryKey: userQueryKey(userId),
      });
    },
  });
}
