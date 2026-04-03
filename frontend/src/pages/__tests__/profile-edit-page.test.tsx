import { QueryClientProvider } from '@tanstack/react-query';
import { getIdToken } from 'firebase/auth';
import { HttpResponse, http } from 'msw';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { GoogleAuthProvider, mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
    googleProvider: new GoogleAuthProvider(),
  };
});

import { appRoutes } from '@/router';
import { userQueryKey } from '@/hooks/useUser';
import { createQueryClient } from '@/lib/query-client';
import { useAuthStore } from '@/stores/auth-store';
import { server } from '@/test/mocks/server';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';
import type { UserProfile } from '@/types/api';

const API_BASE_URL = 'http://localhost:8040';

function createAuthUser() {
  return {
    unique_id: 'unique-user-123',
    user_id: 'user-123',
    name: '山田 太郎',
    introduction: '写真と散歩が好きです。',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
  };
}

function createCachedProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    ...createAuthUser(),
    postedCount: 3,
    votedCount: 4,
    ...overrides,
  };
}

function renderProfileEditPage(
  initialEntry = '/profile/edit',
  cachedProfile?: UserProfile,
) {
  const queryClient = createQueryClient();

  if (cachedProfile) {
    queryClient.setQueryData(userQueryKey(cachedProfile.user_id), cachedProfile);
  }

  const router = createMemoryRouter(appRoutes, {
    initialEntries: [initialEntry],
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('ProfileEditPage', () => {
  beforeEach(async () => {
    const { mockAuth, resetFirebaseAuthMocks } = await import(
      '@/test/mocks/firebase'
    );

    resetFirebaseAuthMocks();
    mockAuth.currentUser = { uid: 'firebase-user-123' };
    vi.mocked(getIdToken).mockResolvedValue('valid-id-token');

    useAuthStore.setState({
      firebaseUser: null,
      authUser: createAuthUser(),
      isAuthenticated: true,
      isLoading: false,
    });
  });

  it('renders the edit form', async () => {
    renderProfileEditPage();

    expect(
      await screen.findByRole('heading', {
        name: 'プロフィールを編集',
      }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('名前')).toBeInTheDocument();
    expect(screen.getByLabelText('説明文')).toBeInTheDocument();
    expect(
      screen.getByText('画像アップロード機能は準備中'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: '保存',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'キャンセル',
      }),
    ).toBeInTheDocument();
  });

  it('shows the current user name and introduction as initial values', async () => {
    renderProfileEditPage();

    expect(await screen.findByDisplayValue('山田 太郎')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('写真と散歩が好きです。'),
    ).toBeInTheDocument();
  });

  it('updates the name input value', async () => {
    const user = userEvent.setup();

    renderProfileEditPage();

    const nameInput = await screen.findByLabelText('名前');

    await user.clear(nameInput);
    await user.type(nameInput, '佐藤 花子');

    expect(nameInput).toHaveValue('佐藤 花子');
  });

  it('updates the introduction input value', async () => {
    const user = userEvent.setup();

    renderProfileEditPage();

    const introductionInput = await screen.findByLabelText('説明文');

    await user.clear(introductionInput);
    await user.type(introductionInput, 'カメラ片手に街を歩くのが好きです。');

    expect(introductionInput).toHaveValue(
      'カメラ片手に街を歩くのが好きです。',
    );
  });

  it('calls the update user API when the save button is clicked', async () => {
    const user = userEvent.setup();
    let requestUserId: string | undefined;
    let requestBody:
      | {
          name?: string;
          introduction?: string;
        }
      | undefined;

    server.use(
      http.patch(`${API_BASE_URL}/api/v1/users/:userId`, async ({ params, request }) => {
        requestUserId = String(params.userId);
        requestBody = (await request.json()) as typeof requestBody;

        return HttpResponse.json({}, { status: 200 });
      }),
    );

    renderProfileEditPage();

    const nameInput = await screen.findByLabelText('名前');
    const introductionInput = screen.getByLabelText('説明文');

    await user.clear(nameInput);
    await user.type(nameInput, '佐藤 花子');
    await user.clear(introductionInput);
    await user.type(introductionInput, 'カメラ片手に街を歩くのが好きです。');
    await user.click(
      screen.getByRole('button', {
        name: '保存',
      }),
    );

    await waitFor(() => {
      expect(requestUserId).toBe('user-123');
      expect(requestBody).toEqual({
        name: '佐藤 花子',
        introduction: 'カメラ片手に街を歩くのが好きです。',
      });
    });
  });

  it('navigates to the profile page after a successful save', async () => {
    const user = userEvent.setup();

    renderProfileEditPage();

    await user.click(
      await screen.findByRole('button', {
        name: '保存',
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: '山田 太郎',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('@user-123')).toBeInTheDocument();
  });

  it('updates the cached profile when save succeeds after editing from the profile screen', async () => {
    const user = userEvent.setup();

    renderProfileEditPage(
      '/profile/edit',
      createCachedProfile({
        name: '古い表示名',
        introduction: '古い自己紹介',
      }),
    );

    const nameInput = await screen.findByLabelText('名前');
    const introductionInput = screen.getByLabelText('説明文');

    expect(nameInput).toHaveValue('古い表示名');
    expect(introductionInput).toHaveValue('古い自己紹介');

    await user.clear(nameInput);
    await user.type(nameInput, '更新後の表示名');
    await user.clear(introductionInput);
    await user.type(introductionInput, '更新後の自己紹介');
    await user.click(
      screen.getByRole('button', {
        name: '保存',
      }),
    );

    expect(
      await screen.findByRole('heading', {
        name: '更新後の表示名',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('更新後の自己紹介')).toBeInTheDocument();
  });

  it('shows a validation error when the name is empty', async () => {
    const user = userEvent.setup();
    let requestCount = 0;

    server.use(
      http.patch(`${API_BASE_URL}/api/v1/users/:userId`, () => {
        requestCount += 1;

        return HttpResponse.json({}, { status: 200 });
      }),
    );

    renderProfileEditPage();

    const nameInput = await screen.findByLabelText('名前');

    await user.clear(nameInput);
    await user.click(
      screen.getByRole('button', {
        name: '保存',
      }),
    );

    expect(await screen.findByText('名前を入力してください。')).toBeInTheDocument();
    expect(requestCount).toBe(0);
  });
});
