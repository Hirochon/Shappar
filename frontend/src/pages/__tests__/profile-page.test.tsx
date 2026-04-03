import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, delay, http } from 'msw';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
  };
});

import { createQueryClient } from '@/lib/query-client';
import { MOCK_AUTH_USER_ID } from '@/mocks/poll-data';
import { ProfilePage } from '@/pages/ProfilePage';
import { useAuthStore } from '@/stores/auth-store';
import { server } from '@/test/mocks/server';
import { render, screen } from '@/test/test-utils';
import type { Post, User } from '@/types/api';

const API_BASE_URL = 'http://localhost:8040';

function createAuthUser(
  overrides: Partial<NonNullable<ReturnType<typeof useAuthStore.getState>['authUser']>> = {},
) {
  return {
    unique_id: 'unique-user-123',
    user_id: MOCK_AUTH_USER_ID,
    name: 'Shappar User',
    introduction: '写真仲間と投票を楽しむユーザー',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
    ...overrides,
  };
}

function createProfile(overrides: Partial<User> = {}): User {
  return {
    unique_id: 'unique-user-123',
    user_id: MOCK_AUTH_USER_ID,
    name: 'Shappar User',
    introduction: '写真仲間と投票を楽しむユーザー',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
    ...overrides,
  };
}

function createPosts(count: number, userId: string): Post[] {
  return Array.from({ length: count }, (_, index) => ({
    post_id: `${userId}-post-${index + 1}`,
    user_id: userId,
    iconimage: 'https://example.com/post-icon.png',
    question: `写真テーマ ${index + 1}`,
    voted: true,
    options: [
      {
        select_num: 0,
        answer: '海辺',
        votes: 3,
      },
      {
        select_num: 1,
        answer: '街歩き',
        votes: 2,
      },
    ],
    created_at: `2026-04-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
    selected_num: 0,
    total: 5,
  }));
}

function mockProfileRequests({
  user = createProfile(),
  postedCount = 4,
  votedCount = 9,
}: {
  user?: User;
  postedCount?: number;
  votedCount?: number;
} = {}) {
  server.use(
    http.get(`${API_BASE_URL}/api/v1/users/:userId`, ({ params }) => {
      if (String(params.userId) !== user.user_id) {
        return HttpResponse.json(
          { detail: '存在しないユーザーです。' },
          { status: 404 },
        );
      }

      return HttpResponse.json(user);
    }),
    http.get(`${API_BASE_URL}/api/v1/users/:userId/posted`, ({ params }) => {
      if (String(params.userId) !== user.user_id) {
        return HttpResponse.json(
          { detail: '存在しないユーザーです。' },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        posts: createPosts(postedCount, user.user_id),
      });
    }),
    http.get(`${API_BASE_URL}/api/v1/users/:userId/voted`, ({ params }) => {
      if (String(params.userId) !== user.user_id) {
        return HttpResponse.json(
          { detail: '存在しないユーザーです。' },
          { status: 404 },
        );
      }

      return HttpResponse.json({
        posts: createPosts(votedCount, `voted-${user.user_id}`),
      });
    }),
  );
}

function renderProfilePage(userId: string) {
  const queryClient = createQueryClient();
  const defaultOptions = queryClient.getDefaultOptions();

  queryClient.setDefaultOptions({
    queries: {
      ...defaultOptions.queries,
      retry: false,
    },
    mutations: {
      ...defaultOptions.mutations,
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/profile/${userId}`]}>
        <Routes>
          <Route element={<ProfilePage />} path="/profile/:userId" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('ProfilePage', () => {
  beforeEach(() => {
    useAuthStore.setState({
      firebaseUser: null,
      authUser: createAuthUser(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('renders the profile page with the user name, icon, description, and counts', async () => {
    mockProfileRequests({
      user: createProfile({
        name: '山田 花子',
        introduction: 'フィルム写真と街歩きが好きです。',
        iconimage: 'https://example.com/hanako.png',
      }),
      postedCount: 12,
      votedCount: 34,
    });

    renderProfilePage(MOCK_AUTH_USER_ID);

    expect(screen.getByText('プロフィールを読み込んでいます...')).toBeInTheDocument();

    expect(
      await screen.findByRole('heading', {
        name: '山田 花子',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('img', {
        name: '山田 花子のアイコン',
      }),
    ).toHaveAttribute('src', 'https://example.com/hanako.png');
    expect(screen.getByText('フィルム写真と街歩きが好きです。')).toBeInTheDocument();
    expect(screen.getByText('投稿数')).toBeInTheDocument();
    expect(screen.getByText('12件')).toBeInTheDocument();
    expect(screen.getByText('投票数')).toBeInTheDocument();
    expect(screen.getByText('34件')).toBeInTheDocument();
  });

  it('shows a default avatar when the user has not set an icon image', async () => {
    mockProfileRequests({
      user: createProfile({
        name: '佐藤 圭',
        iconimage: '',
      }),
    });

    renderProfilePage(MOCK_AUTH_USER_ID);

    expect(
      await screen.findByRole('heading', {
        name: '佐藤 圭',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('img', {
        name: '佐藤 圭のアイコン',
      }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('佐')).toBeInTheDocument();
  });

  it('shows the edit button when viewing the signed-in user profile', async () => {
    mockProfileRequests();

    renderProfilePage(MOCK_AUTH_USER_ID);

    const editLink = await screen.findByRole('link', {
      name: '編集',
    });

    expect(editLink).toHaveAttribute('href', '/profile/edit');
  });

  it('does not show the edit button when viewing another user profile', async () => {
    mockProfileRequests({
      user: createProfile({
        user_id: 'other-user-456',
        name: '別ユーザー',
      }),
    });

    renderProfilePage('other-user-456');

    expect(
      await screen.findByRole('heading', {
        name: '別ユーザー',
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('link', {
        name: '編集',
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'フォロー',
      }),
    ).toBeDisabled();
  });

  it('shows the loading state while the profile query is pending', () => {
    mockProfileRequests();
    server.use(
      http.get(`${API_BASE_URL}/api/v1/users/:userId`, async () => {
        await delay(200);

        return HttpResponse.json(createProfile());
      }),
    );

    renderProfilePage(MOCK_AUTH_USER_ID);

    expect(screen.getByText('プロフィールを読み込んでいます...')).toBeInTheDocument();
  });

  it('shows the error state when the profile query fails', async () => {
    mockProfileRequests();
    server.use(
      http.get(`${API_BASE_URL}/api/v1/users/:userId`, () =>
        HttpResponse.json(
          { detail: 'ユーザー情報の取得に失敗しました。' },
          { status: 500 },
        ),
      ),
    );

    renderProfilePage(MOCK_AUTH_USER_ID);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'サーバーエラーが発生しました',
    );
  });
});
