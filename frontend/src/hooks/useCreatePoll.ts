import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postedPollsQueryKey } from '@/hooks/usePostedPolls';
import { userQueryKey } from '@/hooks/useUser';
import { apiClient } from '@/lib/api-client';
import { useAuthStore } from '@/stores/auth-store';
import type { CreatePostRequest, CreatePostResponse } from '@/types/api';

const publicPollsQueryKey = ['public-polls'] as const;

export function useCreatePoll() {
  const queryClient = useQueryClient();
  const authUser = useAuthStore((state) => state.authUser);

  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      return apiClient.post<CreatePostResponse>('/api/v1/posts', payload);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: publicPollsQueryKey,
      });

      if (!authUser) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: postedPollsQueryKey(authUser.user_id),
      });
      void queryClient.invalidateQueries({
        queryKey: userQueryKey(authUser.user_id),
      });
    },
  });
}
