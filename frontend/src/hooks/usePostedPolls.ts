import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Post } from '@/types/api';

interface UserPollsResponse {
  posts: Post[];
}

interface UseUserPollsOptions {
  enabled?: boolean;
}

async function fetchPostedPolls(userId: string) {
  return apiClient.get<UserPollsResponse>(`/api/v1/users/${userId}/posted`);
}

export function postedPollsQueryKey(userId: string) {
  return ['posted-polls', userId] as const;
}

export function usePostedPolls(
  userId: string,
  { enabled = true }: UseUserPollsOptions = {},
) {
  return useQuery({
    queryKey: postedPollsQueryKey(userId),
    queryFn: () => fetchPostedPolls(userId),
    enabled: enabled && userId.length > 0,
  });
}
