import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));

import { pollDetailQueryKey } from '@/hooks/usePollDetail';
import { useVote } from '@/hooks/useVote';
import { ApiError, apiClient } from '@/lib/api-client';
import { getMockPollPost, resetMockPollPosts } from '@/mocks/poll-data';
import { renderHook, waitFor } from '@/test/test-utils';
import type { VoteResponse } from '@/types/api';
import { createHookTestQueryClient, createHookWrapper } from './test-helpers';

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

describe('useVote', () => {
  beforeEach(() => {
    resetMockPollPosts();
    vi.restoreAllMocks();
  });

  it('optimistically updates the cached poll data before the request resolves', async () => {
    const postId = 'post-unvoted';
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const deferred = createDeferred<VoteResponse>();
    const postSpy = vi.spyOn(apiClient, 'post').mockReturnValue(deferred.promise);
    const initialPost = getMockPollPost(postId);

    queryClient.setQueryData(pollDetailQueryKey(postId), initialPost);

    const { result } = renderHook(() => useVote(postId), { wrapper });

    act(() => {
      result.current.mutate({ selectNum: 1 });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(pollDetailQueryKey(postId))).toMatchObject({
        voted: true,
        selected_num: 1,
        total: 1,
      });
    });

    expect(queryClient.getQueryData(pollDetailQueryKey(postId))).toMatchObject({
      options: [
        { select_num: 0, votes: 0 },
        { select_num: 1, votes: 1 },
        { select_num: 2, votes: 0 },
      ],
    });
    await waitFor(() => {
      expect(postSpy).toHaveBeenCalledTimes(1);
    });

    deferred.resolve({
      options: [
        { select_num: 0, votes: 2 },
        { select_num: 1, votes: 5 },
        { select_num: 2, votes: 1 },
      ],
      selected_num: 1,
      total: 8,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('rolls the cached poll data back when the vote request fails', async () => {
    const postId = 'post-unvoted';
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const deferred = createDeferred<VoteResponse>();
    const initialPost = getMockPollPost(postId);

    vi.spyOn(apiClient, 'post').mockReturnValue(deferred.promise);
    queryClient.setQueryData(pollDetailQueryKey(postId), initialPost);

    const { result } = renderHook(() => useVote(postId), { wrapper });

    act(() => {
      result.current.mutate({ selectNum: 2 });
    });

    await waitFor(() => {
      expect(queryClient.getQueryData(pollDetailQueryKey(postId))).toMatchObject({
        voted: true,
        selected_num: 2,
        total: 1,
      });
    });

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledTimes(1);
    });

    deferred.reject(
      new ApiError('投票に失敗しました。', 500, {
        detail: '投票に失敗しました。',
      }),
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(queryClient.getQueryData(pollDetailQueryKey(postId))).toEqual(initialPost);
  });

  it('does not call the mutation again when the same option is submitted twice', async () => {
    const postId = 'post-voted';
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const postSpy = vi.spyOn(apiClient, 'post').mockResolvedValue({
      options: [],
      selected_num: 1,
      total: 8,
    });
    const initialPost = getMockPollPost(postId);

    queryClient.setQueryData(pollDetailQueryKey(postId), initialPost);

    const { result } = renderHook(() => useVote(postId), { wrapper });

    act(() => {
      result.current.mutate({ selectNum: 1 });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(postSpy).not.toHaveBeenCalled();
    expect(queryClient.getQueryData(pollDetailQueryKey(postId))).toEqual(initialPost);
  });
});
