import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, delay, http } from 'msw';
import { type PropsWithChildren } from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
  };
});

const authStoreState = vi.hoisted(() => ({
  initAuthListener: vi.fn(() => vi.fn()),
  authUser: {
    unique_id: 'unique-user-123',
    user_id: 'user-123',
    name: 'Shappar User',
    introduction: 'I love taking pictures with friends.',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
  },
  clearUser: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
}));

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (
    selector: (state: {
      initAuthListener: () => () => void;
      authUser: typeof authStoreState.authUser;
      clearUser: typeof authStoreState.clearUser;
      isAuthenticated: boolean;
      isLoading: boolean;
    }) => unknown,
  ) => selector(authStoreState),
}));

import { appRoutes } from '@/router';
import { server } from '@/test/mocks/server';
import { render, screen, userEvent } from '@/test/test-utils';
import type { Post } from '@/types/api';

const API_BASE_URL = 'http://localhost:8040';

function createPost(overrides: Partial<Post> = {}): Post {
  const optionCount = overrides.options?.length ?? 2;

  return {
    post_id: 'post-1',
    user_id: 'user-123',
    iconimage: 'https://example.com/icon.png',
    question: '週末はどこで写真を撮る？',
    voted: false,
    options: Array.from({ length: optionCount }, (_, index) => ({
      select_num: index,
      answer: `選択肢 ${index + 1}`,
      votes: 10 - index,
    })),
    created_at: '2026-04-02T03:15:00.000Z',
    selected_num: -1,
    total: 18,
    ...overrides,
  };
}

function mockMyPageApi({
  userId = 'user-123',
  userName = 'Shappar User',
  posted = [],
  voted = [],
  responseDelayMs = 0,
}: {
  userId?: string;
  userName?: string;
  posted?: Post[];
  voted?: Post[];
  responseDelayMs?: number;
} = {}) {
  server.use(
    http.get(`${API_BASE_URL}/api/v1/users/:userId`, async ({ params }) => {
      const resolvedUserId = String(params.userId ?? userId);

      if (responseDelayMs > 0) {
        await delay(responseDelayMs);
      }

      return HttpResponse.json({
        unique_id: `unique-${resolvedUserId}`,
        user_id: resolvedUserId,
        name: resolvedUserId === userId ? userName : `${resolvedUserId}さん`,
        introduction: `${resolvedUserId} introduction`,
        iconimage: `https://example.com/${resolvedUserId}.png`,
        homeimage: `https://example.com/${resolvedUserId}-home.png`,
        followers: 12,
        follow: 7,
        followed: resolvedUserId !== userId,
      });
    }),
    http.get(`${API_BASE_URL}/api/v1/users/:userId/posted`, async () => {
      if (responseDelayMs > 0) {
        await delay(responseDelayMs);
      }

      return HttpResponse.json({
        posts: posted,
      });
    }),
    http.get(`${API_BASE_URL}/api/v1/users/:userId/voted`, async () => {
      if (responseDelayMs > 0) {
        await delay(responseDelayMs);
      }

      return HttpResponse.json({
        posts: voted,
      });
    }),
  );
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function renderMyPageRoute(pathname: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [pathname],
  });
  const Wrapper = createWrapper();

  return render(
    <Wrapper>
      <RouterProvider router={router} />
    </Wrapper>,
  );
}

describe('My Page', () => {
  beforeEach(() => {
    authStoreState.authUser = {
      unique_id: 'unique-user-123',
      user_id: 'user-123',
      name: 'Shappar User',
      introduction: 'I love taking pictures with friends.',
      iconimage: 'https://example.com/icon.png',
      homeimage: 'https://example.com/home.png',
    };
    authStoreState.isAuthenticated = true;
    authStoreState.isLoading = false;
    authStoreState.clearUser.mockReset();
    authStoreState.initAuthListener.mockClear();
  });

  it('shows the posted and voted tabs on the signed-in user profile', async () => {
    mockMyPageApi({
      posted: [createPost({ question: '投稿した投票のタイトル' })],
      voted: [createPost({ post_id: 'voted-1', question: '投票した履歴のタイトル' })],
    });

    renderMyPageRoute('/profile');

    expect(
      await screen.findByRole('tab', { name: '投稿した投票' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('tab', { name: '投票した履歴' }),
    ).toBeInTheDocument();
  });

  it('shows only the posted tab on another user profile and does not request voted history', async () => {
    let votedRequests = 0;

    mockMyPageApi({
      userId: 'creator-002',
      userName: 'Creator 002',
      posted: [
        createPost({
          post_id: 'posted-1',
          user_id: 'creator-002',
          question: '他ユーザーの投稿',
        }),
      ],
    });
    server.use(
      http.get(`${API_BASE_URL}/api/v1/users/:userId/voted`, () => {
        votedRequests += 1;

        return HttpResponse.json({
          posts: [createPost({ question: 'private history' })],
        });
      }),
    );

    renderMyPageRoute('/profile/creator-002');

    expect(
      await screen.findByRole('tab', { name: '投稿した投票' }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('tab', { name: '投票した履歴' }),
    ).not.toBeInTheDocument();
    expect(await screen.findByText('他ユーザーの投稿')).toBeInTheDocument();
    expect(votedRequests).toBe(0);
  });

  it('renders the posted poll list on the default tab', async () => {
    mockMyPageApi({
      posted: [
        createPost({
          post_id: 'posted-1',
          question: '自分が投稿した投票',
        }),
      ],
      voted: [
        createPost({
          post_id: 'voted-1',
          user_id: 'friend-001',
          question: '自分が投票した投票',
          voted: true,
        }),
      ],
    });

    renderMyPageRoute('/profile');

    expect(await screen.findByText('自分が投稿した投票')).toBeInTheDocument();
    expect(screen.queryByText('自分が投票した投票')).not.toBeInTheDocument();
  });

  it('renders the voted poll list when the history tab is selected', async () => {
    const user = userEvent.setup();

    mockMyPageApi({
      posted: [
        createPost({
          post_id: 'posted-1',
          question: '自分が投稿した投票',
        }),
      ],
      voted: [
        createPost({
          post_id: 'voted-1',
          user_id: 'friend-001',
          question: '自分が投票した投票',
          voted: true,
        }),
      ],
    });

    renderMyPageRoute('/profile');

    await screen.findByText('自分が投稿した投票');
    await user.click(screen.getByRole('tab', { name: '投票した履歴' }));

    expect(await screen.findByText('自分が投票した投票')).toBeInTheDocument();
  });

  it('shows an empty state message when the selected list is empty', async () => {
    const user = userEvent.setup();

    mockMyPageApi({
      posted: [
        createPost({
          post_id: 'posted-1',
          question: '自分が投稿した投票',
        }),
      ],
      voted: [],
    });

    renderMyPageRoute('/profile');

    await screen.findByText('自分が投稿した投票');
    await user.click(screen.getByRole('tab', { name: '投票した履歴' }));

    expect(
      await screen.findByText('まだ投票した履歴はありません。'),
    ).toBeInTheDocument();
  });

  it('shows a loading state while the page data is loading', async () => {
    mockMyPageApi({
      posted: [createPost({ question: '読み込み後に表示される投稿' })],
      voted: [],
      responseDelayMs: 200,
    });

    renderMyPageRoute('/profile');

    expect(screen.getByText('投稿した投票を読み込み中...')).toBeInTheDocument();
    expect(
      await screen.findByText('読み込み後に表示される投稿'),
    ).toBeInTheDocument();
  });
});
