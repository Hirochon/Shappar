import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { User, UserPostsResponse, UserProfile } from '@/types/api';

export function userQueryKey(userId: string) {
  return ['user-profile', userId] as const;
}

async function fetchUserProfile(userId: string): Promise<UserProfile> {
  const [user, postedResponse, votedResponse] = await Promise.all([
    apiClient.get<User>(`/api/v1/users/${userId}`),
    apiClient.get<UserPostsResponse>(`/api/v1/users/${userId}/posted`),
    apiClient.get<UserPostsResponse>(`/api/v1/users/${userId}/voted`),
  ]);

  return {
    ...user,
    postedCount: postedResponse.posts.length,
    votedCount: votedResponse.posts.length,
  };
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: userQueryKey(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled: Boolean(userId),
  });
}
