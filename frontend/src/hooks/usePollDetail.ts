import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Post } from '@/types/api';

export function pollDetailQueryKey(postId: string) {
  return ['poll-detail', postId] as const;
}

export function usePollDetail(postId: string) {
  return useQuery({
    queryKey: pollDetailQueryKey(postId),
    queryFn: () => apiClient.get<Post>(`/api/v1/posts/${postId}`),
    enabled: Boolean(postId),
    refetchInterval: 10_000,
    refetchIntervalInBackground: false,
  });
}
