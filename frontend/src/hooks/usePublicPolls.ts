import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import type { Post } from '@/types/api';

export const PUBLIC_POLL_PAGE_SIZE = 10;

export interface PublicPollsResponse {
  posts: Post[];
}

async function fetchPublicPolls(pageParam: string | null) {
  const searchParams = new URLSearchParams();

  if (pageParam) {
    searchParams.set('pid', pageParam);
  }

  const query = searchParams.toString();
  const path = query ? `/api/v1/posts/public?${query}` : '/api/v1/posts/public';

  return apiClient.get<PublicPollsResponse>(path);
}

export function usePublicPolls() {
  return useInfiniteQuery({
    queryKey: ['public-polls'],
    queryFn: ({ pageParam }) => fetchPublicPolls(pageParam),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => {
      if (lastPage.posts.length < PUBLIC_POLL_PAGE_SIZE) {
        return undefined;
      }

      return lastPage.posts.at(-1)?.post_id;
    },
  });
}
