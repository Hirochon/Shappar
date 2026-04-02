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
import {
  MOCK_AUTH_USER_ID,
  getMockPollPost,
  resetMockPollPosts,
  voteMockPollPost,
} from '@/mocks/poll-data';
import { PollDetailPage } from '@/pages/PollDetailPage';
import { useAuthStore } from '@/stores/auth-store';
import { server } from '@/test/mocks/server';
import { render, screen, userEvent, waitFor, within } from '@/test/test-utils';

const API_BASE_URL = 'http://localhost:8040';

function createAuthUser(overrides: Partial<ReturnType<typeof useAuthStore.getState>['authUser']> = {}) {
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

function renderPollDetailPage(postId: string) {
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
      <MemoryRouter initialEntries={[`/polls/${postId}`]}>
        <Routes>
          <Route element={<PollDetailPage />} path="/polls/:id" />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('PollDetailPage', () => {
  beforeEach(() => {
    resetMockPollPosts();
    useAuthStore.setState({
      firebaseUser: null,
      authUser: createAuthUser(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('shows the question and the list of choices', async () => {
    renderPollDetailPage('post-unvoted');

    expect(
      await screen.findByRole('heading', {
        name: '次にみんなで撮りに行くならどこ？',
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /海辺.*投票する/u }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /駅前スナップ.*投票する/u }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /夜景スポット.*投票する/u }),
    ).toBeInTheDocument();
  });

  it('renders clickable option buttons before the user has voted', async () => {
    renderPollDetailPage('post-unvoted');

    const optionButton = await screen.findByRole('button', {
      name: /海辺.*投票する/u,
    });

    expect(optionButton).toBeEnabled();
    expect(screen.getByLabelText('投票選択肢')).toBeInTheDocument();
  });

  it('calls the vote API when an option is clicked', async () => {
    let requestBody: unknown;

    server.use(
      http.post(`${API_BASE_URL}/api/v1/posts/:id/polls`, async ({ params, request }) => {
        requestBody = await request.json();
        const response = voteMockPollPost(String(params.id), 1);

        return HttpResponse.json(response.response, { status: 201 });
      }),
    );

    renderPollDetailPage('post-unvoted');

    await userEvent.click(
      await screen.findByRole('button', {
        name: /駅前スナップ.*投票する/u,
      }),
    );

    await waitFor(() => {
      expect(requestBody).toEqual({
        option: {
          select_num: 1,
        },
      });
    });
  });

  it('shows result bars after voting', async () => {
    renderPollDetailPage('post-unvoted');

    await userEvent.click(
      await screen.findByRole('button', {
        name: /海辺.*投票する/u,
      }),
    );

    const resultsSection = await screen.findByLabelText('投票結果');
    const firstResult = within(resultsSection).getByText('海辺').closest('article');

    expect(resultsSection).toBeInTheDocument();
    expect(firstResult).not.toBeNull();
    expect(screen.getByTestId('poll-result-bar-0')).toHaveStyle({ width: '100%' });
  });

  it('shows the vote count and percentage after voting', async () => {
    renderPollDetailPage('post-voted');

    expect(await screen.findByText('4票 / 50%')).toBeInTheDocument();
    expect(screen.getAllByText('2票 / 25%')).toHaveLength(2);
    expect(screen.getByText('投票数')).toBeInTheDocument();
    expect(screen.getByText('8票')).toBeInTheDocument();
  });

  it('shows results immediately for users who already voted', async () => {
    renderPollDetailPage('post-voted');

    expect(await screen.findByLabelText('投票結果')).toBeInTheDocument();
    expect(screen.queryByLabelText('投票選択肢')).not.toBeInTheDocument();
  });

  it('does not allow a second vote once the user has already voted', async () => {
    renderPollDetailPage('post-voted');

    await screen.findByLabelText('投票結果');

    expect(
      screen.queryByRole('button', { name: /朝焼け.*投票する/u }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('投票する')).not.toBeInTheDocument();
  });

  it('shows the loading state while the detail query is pending', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/v1/posts/post-unvoted`, async () => {
        await delay(200);

        return HttpResponse.json(getMockPollPost('post-unvoted'));
      }),
    );

    renderPollDetailPage('post-unvoted');

    expect(screen.getByText('投票詳細を読み込んでいます...')).toBeInTheDocument();
  });

  it('shows the error state when the detail query fails', async () => {
    server.use(
      http.get(`${API_BASE_URL}/api/v1/posts/post-missing`, () => {
        return HttpResponse.json(
          { detail: '存在しない投稿IDです。' },
          { status: 404 },
        );
      }),
    );

    renderPollDetailPage('post-missing');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '見つかりませんでした',
    );
  });

  it('shows the delete button only for the author', async () => {
    renderPollDetailPage('post-owned');

    expect(
      await screen.findByRole('button', {
        name: '削除',
      }),
    ).toBeInTheDocument();
  });
});
