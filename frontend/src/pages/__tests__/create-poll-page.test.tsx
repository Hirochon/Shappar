import { QueryClientProvider } from '@tanstack/react-query';
import { HttpResponse, http } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const authStoreState = vi.hoisted(() => ({
  initAuthListener: vi.fn(() => vi.fn()),
  authUser: {
    unique_id: 'unique-user-123',
    user_id: 'user-123',
    name: '山田 太郎',
    introduction: 'hello',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
  },
  clearUser: vi.fn(),
  isAuthenticated: true,
  isLoading: false,
}));

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase-auth', () => import('@/test/mocks/firebase-auth'));
vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (
    selector: (state: typeof authStoreState) => unknown,
  ) => selector(authStoreState),
}));

import { appRoutes } from '@/router';
import { getIdToken } from '@/lib/firebase-auth';
import { createQueryClient } from '@/lib/query-client';
import { createMockPollPost, resetMockPollPosts } from '@/mocks/poll-data';
import { server } from '@/test/mocks/server';
import {
  render,
  screen,
  userEvent,
  waitFor,
} from '@/test/test-utils';

const API_BASE_URL = 'http://localhost:8040';
const OPTION_LABEL_PATTERN = /^選択肢 \d+$/;

function renderCreatePollPage(initialEntry = '/create') {
  const queryClient = createQueryClient();
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

async function fillValidForm() {
  const user = userEvent.setup();
  const questionField = await screen.findByLabelText('質問');
  const optionFields = screen.getAllByLabelText(OPTION_LABEL_PATTERN);

  await user.type(questionField, '次に行きたい撮影スポットは？');
  await user.type(optionFields[0], '海');
  await user.type(optionFields[1], '山');

  return user;
}

describe('CreatePollPage', () => {
  beforeEach(async () => {
    const { mockAuth, resetFirebaseAuthMocks } = await import(
      '@/test/mocks/firebase'
    );

    resetFirebaseAuthMocks();
    mockAuth.currentUser = { uid: 'firebase-user-123' };
    vi.mocked(getIdToken).mockResolvedValue('valid-id-token');
    authStoreState.clearUser.mockReset();
    authStoreState.isAuthenticated = true;
    authStoreState.isLoading = false;
    resetMockPollPosts();
  });

  it('renders the question input field', async () => {
    renderCreatePollPage();

    expect(await screen.findByLabelText('質問')).toBeInTheDocument();
  });

  it('renders two option fields by default', async () => {
    renderCreatePollPage();

    expect(await screen.findAllByLabelText(OPTION_LABEL_PATTERN)).toHaveLength(2);
  });

  it('adds option fields up to six items', async () => {
    const user = userEvent.setup();

    renderCreatePollPage();

    const addOptionButton = await screen.findByRole('button', {
      name: '選択肢を追加',
    });

    for (let index = 0; index < 4; index += 1) {
      await user.click(addOptionButton);
    }

    expect(screen.getAllByLabelText(OPTION_LABEL_PATTERN)).toHaveLength(6);
    expect(addOptionButton).toBeDisabled();
  });

  it('removes option fields down to two items', async () => {
    const user = userEvent.setup();

    renderCreatePollPage();

    const addOptionButton = await screen.findByRole('button', {
      name: '選択肢を追加',
    });

    await user.click(addOptionButton);
    expect(screen.getAllByLabelText(OPTION_LABEL_PATTERN)).toHaveLength(3);

    await user.click(
      screen.getByRole('button', {
        name: '選択肢 3 を削除',
      }),
    );

    expect(screen.getAllByLabelText(OPTION_LABEL_PATTERN)).toHaveLength(2);
    expect(
      screen.queryByRole('button', {
        name: /選択肢 \d+ を削除/,
      }),
    ).not.toBeInTheDocument();
  });

  it('shows a validation error when the question is empty', async () => {
    const user = userEvent.setup();

    renderCreatePollPage();

    const optionFields = await screen.findAllByLabelText(OPTION_LABEL_PATTERN);
    await user.type(optionFields[0], '海');
    await user.type(optionFields[1], '山');
    await user.click(
      screen.getByRole('button', {
        name: '投票を作成',
      }),
    );

    expect(await screen.findByText('質問を入力してください。')).toBeInTheDocument();
  });

  it('shows a validation error when any option is empty', async () => {
    const user = userEvent.setup();

    renderCreatePollPage();

    await user.type(await screen.findByLabelText('質問'), '次に行きたい場所は？');
    await user.type(screen.getByLabelText('選択肢 1'), '海');
    await user.click(
      screen.getByRole('button', {
        name: '投票を作成',
      }),
    );

    expect(
      await screen.findByText('選択肢を入力してください。'),
    ).toBeInTheDocument();
  });

  it('shows a validation error when duplicate options are entered', async () => {
    const user = userEvent.setup();

    renderCreatePollPage();

    await user.type(await screen.findByLabelText('質問'), '今日行く場所は？');
    await user.type(screen.getByLabelText('選択肢 1'), '海');
    await user.type(screen.getByLabelText('選択肢 2'), '海');
    await user.click(
      screen.getByRole('button', {
        name: '投票を作成',
      }),
    );

    expect(
      await screen.findAllByText('同じ選択肢は設定できません。'),
    ).toHaveLength(2);
  });

  it('calls the create poll API when the submit button is clicked', async () => {
    let requestBody:
      | {
          question: string;
          options: Array<{ answer: string }>;
        }
      | undefined;

    server.use(
      http.post(`${API_BASE_URL}/api/v1/posts`, async ({ request }) => {
        requestBody = (await request.json()) as typeof requestBody;
        createMockPollPost(
          requestBody?.question ?? '',
          requestBody?.options ?? [],
          'post-123',
        );

        return HttpResponse.json({ post_id: 'post-123' }, { status: 201 });
      }),
    );

    renderCreatePollPage();

    const user = await fillValidForm();
    await user.click(
      screen.getByRole('button', {
        name: '投票を作成',
      }),
    );

    await waitFor(() => {
      expect(requestBody).toEqual({
        question: '次に行きたい撮影スポットは？',
        options: [{ answer: '海' }, { answer: '山' }],
      });
    });
  });

  it('navigates to the poll detail page after a successful submission', async () => {
    renderCreatePollPage();

    const user = await fillValidForm();
    await user.click(
      screen.getByRole('button', {
        name: '投票を作成',
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: '次に行きたい撮影スポットは？',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '削除',
      }),
    ).toBeInTheDocument();
  });
});
