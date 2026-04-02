import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
  };
});

const authStoreState = vi.hoisted(() => ({
  authUser: {
    unique_id: 'user-1',
    user_id: 'user-1',
    name: '山田 太郎',
    introduction: 'hello',
    iconimage: 'https://example.com/icon.png',
    homeimage: 'https://example.com/home.png',
  },
  clearUser: vi.fn(),
}));

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (
    selector: (state: {
      authUser: typeof authStoreState.authUser;
      clearUser: typeof authStoreState.clearUser;
    }) => unknown,
  ) => selector(authStoreState),
}));

import { signOut } from 'firebase/auth';
import { Header } from '@/components/header';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

describe('Header', () => {
  beforeEach(async () => {
    const { resetFirebaseAuthMocks } = await import('@/test/mocks/firebase');

    resetFirebaseAuthMocks();
    authStoreState.authUser = {
      unique_id: 'user-1',
      user_id: 'user-1',
      name: '山田 太郎',
      introduction: 'hello',
      iconimage: 'https://example.com/icon.png',
      homeimage: 'https://example.com/home.png',
    };
    authStoreState.clearUser.mockReset();
  });

  it('renders the header container', () => {
    render(<Header />, { initialEntries: ['/'] });

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('shows the Shappar app name', () => {
    render(<Header />, { initialEntries: ['/'] });

    expect(
      screen.getByRole('link', {
        name: 'Shappar',
      }),
    ).toBeInTheDocument();
  });

  it('shows the signed-in user icon image', () => {
    render(<Header />, { initialEntries: ['/'] });

    expect(
      screen.getByRole('img', {
        name: '山田 太郎',
      }),
    ).toHaveAttribute('src', 'https://example.com/icon.png');
  });

  it('shows the signed-in user name', () => {
    render(<Header />, { initialEntries: ['/'] });

    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });

  it('shows the logout action in the user menu', async () => {
    const user = userEvent.setup();

    render(<Header />, { initialEntries: ['/'] });

    await user.click(
      screen.getByRole('button', {
        name: 'ユーザーメニュー',
      }),
    );

    expect(screen.getByText('ログアウト')).toBeInTheDocument();
  });

  it('calls Firebase signOut when the logout action is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(signOut).mockResolvedValueOnce(undefined);

    render(<Header />, { initialEntries: ['/'] });

    await user.click(
      screen.getByRole('button', {
        name: 'ユーザーメニュー',
      }),
    );
    await user.click(screen.getByText('ログアウト'));

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledTimes(1);
    });
  });

  it('clears the auth store after logout', async () => {
    const user = userEvent.setup();

    vi.mocked(signOut).mockResolvedValueOnce(undefined);

    render(<Header />, { initialEntries: ['/'] });

    await user.click(
      screen.getByRole('button', {
        name: 'ユーザーメニュー',
      }),
    );
    await user.click(screen.getByText('ログアウト'));

    await waitFor(() => {
      expect(authStoreState.clearUser).toHaveBeenCalledTimes(1);
    });
  });
});
