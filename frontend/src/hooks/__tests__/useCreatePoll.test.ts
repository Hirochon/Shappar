import { act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));

import { postedPollsQueryKey } from '@/hooks/usePostedPolls';
import { userQueryKey } from '@/hooks/useUser';
import { useCreatePoll } from '@/hooks/useCreatePoll';
import { MOCK_AUTH_USER_ID, resetMockPollPosts } from '@/mocks/poll-data';
import { useAuthStore } from '@/stores/auth-store';
import { renderHook, waitFor } from '@/test/test-utils';
import { createHookTestQueryClient, createHookWrapper } from './test-helpers';

describe('useCreatePoll', () => {
  beforeEach(() => {
    resetMockPollPosts();
    useAuthStore.setState({
      authUser: {
        unique_id: 'unique-user-123',
        user_id: MOCK_AUTH_USER_ID,
        name: 'Shappar User',
        introduction: '写真仲間と投票を楽しむユーザー',
        iconimage: 'https://example.com/icon.png',
        homeimage: 'https://example.com/home.png',
      },
    });
  });

  afterEach(() => {
    useAuthStore.setState({ authUser: null });
    vi.restoreAllMocks();
  });

  it('invalidates related caches after a successful poll creation', async () => {
    const queryClient = createHookTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => useCreatePoll(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        question: '次に撮りに行く場所は？',
        options: [{ answer: '海' }, { answer: '山' }],
      });
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ['public-polls'],
      });
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: postedPollsQueryKey(MOCK_AUTH_USER_ID),
    });
    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: userQueryKey(MOCK_AUTH_USER_ID),
    });
  });

  it('surfaces validation errors from the API without invalidating caches', async () => {
    const queryClient = createHookTestQueryClient();
    const invalidateQueriesSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => useCreatePoll(), { wrapper });

    await expect(
      result.current.mutateAsync({
        question: '',
        options: [{ answer: '海' }, { answer: '' }],
      }),
    ).rejects.toMatchObject({
      message: '入力内容を確認してください。',
      status: 400,
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
