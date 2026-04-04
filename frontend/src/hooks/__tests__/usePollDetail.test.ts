import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));

import { pollDetailQueryKey, usePollDetail } from '@/hooks/usePollDetail';
import { resetMockPollPosts } from '@/mocks/poll-data';
import { renderHook, waitFor } from '@/test/test-utils';
import { createHookTestQueryClient, createHookWrapper } from './test-helpers';

type PollDetailQueryOptions = {
  queryKey: ReturnType<typeof pollDetailQueryKey>;
  refetchInterval?: number;
  refetchIntervalInBackground?: boolean;
};

describe('usePollDetail', () => {
  beforeEach(() => {
    resetMockPollPosts();
  });

  it('returns the poll data for the requested post id', async () => {
    const postId = 'post-unvoted';
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => usePollDetail(postId), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toMatchObject({
      post_id: postId,
      question: '次にみんなで撮りに行くならどこ？',
    });
    expect(queryClient.getQueryData(pollDetailQueryKey(postId))).toMatchObject({
      post_id: postId,
    });
  });

  it('configures the query to poll every 10 seconds', async () => {
    const postId = 'post-unvoted';
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);

    renderHook(() => usePollDetail(postId), { wrapper });

    await waitFor(() => {
      expect(
        queryClient.getQueryCache().find({
          queryKey: pollDetailQueryKey(postId),
        }),
      ).toBeDefined();
    });

    const query = queryClient.getQueryCache().find({
      queryKey: pollDetailQueryKey(postId),
    });
    const queryOptions = query?.options as PollDetailQueryOptions | undefined;

    expect(queryOptions?.queryKey).toEqual(pollDetailQueryKey(postId));
    expect(queryOptions?.refetchInterval).toBe(10_000);
    expect(queryOptions?.refetchIntervalInBackground).toBe(false);
  });
});
