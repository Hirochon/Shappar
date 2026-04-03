import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Post } from '@/types/api';

interface UserPollsResponse {
  posts: Post[];
}

interface UseUserPollsOptions {
  enabled?: boolean;
}

async function fetchVotedPolls(userId: string) {
  return apiClient.get<UserPollsResponse>(`/api/v1/users/${userId}/voted`);
}

export function votedPollsQueryKey(userId: string) {
  return ['voted-polls', userId] as const;
}

export function useVotedPolls(
  userId: string,
  { enabled = true }: UseUserPollsOptions = {},
) {
  return useQuery({
    queryKey: votedPollsQueryKey(userId),
    queryFn: () => fetchVotedPolls(userId),
    enabled: enabled && userId.length > 0,
  });
}
