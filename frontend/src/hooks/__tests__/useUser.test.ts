import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));

import { MOCK_AUTH_USER_ID } from '@/mocks/poll-data';
import { resetMockUsers } from '@/mocks/handlers/users';
import { renderHook, waitFor } from '@/test/test-utils';
import { useUser } from '@/hooks/useUser';
import { createHookTestQueryClient, createHookWrapper } from './test-helpers';

describe('useUser', () => {
  beforeEach(() => {
    resetMockUsers();
  });

  it('returns the user profile and derives counts from posts.length', async () => {
    const queryClient = createHookTestQueryClient();
    const wrapper = createHookWrapper(queryClient);
    const { result } = renderHook(() => useUser(MOCK_AUTH_USER_ID), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toMatchObject({
      user_id: MOCK_AUTH_USER_ID,
      name: 'Shappar User',
      postedCount: 3,
      votedCount: 4,
    });
  });
});
