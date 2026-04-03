import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { User } from '@/types/api';

interface UseUserProfileOptions {
  enabled?: boolean;
}

async function fetchUserProfile(userId: string) {
  return apiClient.get<User>(`/api/v1/users/${userId}`);
}

export function userProfileQueryKey(userId: string) {
  return ['user-basic-profile', userId] as const;
}

export function useUserProfile(
  userId: string,
  { enabled = true }: UseUserProfileOptions = {},
) {
  return useQuery({
    queryKey: userProfileQueryKey(userId),
    queryFn: () => fetchUserProfile(userId),
    enabled: enabled && userId.length > 0,
  });
}
