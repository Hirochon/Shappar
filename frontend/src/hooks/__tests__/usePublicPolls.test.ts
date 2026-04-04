import { act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));

import { PUBLIC_POLL_PAGE_SIZE, usePublicPolls } from '@/hooks/usePublicPolls';
import { renderHook, waitFor } from '@/test/test-utils';
import { createHookTestQueryClient, createHookWrapper } from './test-helpers';

describe('usePublicPolls', () => {
  it('fetches the first page of public polls', async () => {
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => usePublicPolls(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0].posts).toHaveLength(PUBLIC_POLL_PAGE_SIZE);
    expect(result.current.data?.pages[0].posts[0]?.post_id).toBe('mock-post-1');
  });

  it('appends the next page when fetchNextPage is called', async () => {
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => usePublicPolls(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(true);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.data?.pages).toHaveLength(2);
    });

    const posts =
      result.current.data?.pages.flatMap((page) => page.posts) ?? [];

    expect(posts).toHaveLength(12);
    expect(posts.at(-1)?.post_id).toBe('mock-post-12');
  });

  it('reports no next page after the terminal page is fetched', async () => {
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => usePublicPolls(), { wrapper });

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(true);
    });

    await act(async () => {
      await result.current.fetchNextPage();
    });

    await waitFor(() => {
      expect(result.current.hasNextPage).toBe(false);
    });
  });
});
