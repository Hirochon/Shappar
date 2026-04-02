import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { appRoutes } from '@/router';
import { render, screen } from '@/test/test-utils';

const authStoreState = vi.hoisted(() => ({
  initAuthListener: vi.fn(() => vi.fn()),
  authUser: null as {
    unique_id: string;
    user_id: string;
    name: string;
    introduction: string;
    iconimage: string;
    homeimage: string;
  } | null,
  clearUser: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
}));

vi.mock('firebase/auth', () => import('@/test/mocks/firebase'));
vi.mock('@/lib/firebase', async () => {
  const { mockAuth } = await import('@/test/mocks/firebase');

  return {
    auth: mockAuth,
  };
});
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

vi.mock('@/pages/login-page', () => ({
  LoginPage: () => <h1>Mock Login Page</h1>,
}));

vi.mock('@/pages/home-page', () => ({
  HomePage: () => <h1>Mock Home Page</h1>,
}));

vi.mock('@/pages/not-found-page', () => ({
  NotFoundPage: () => <h1>Mock Not Found Page</h1>,
}));

function renderRouter(pathname: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [pathname],
  });

  return render(<RouterProvider router={router} />);
}

describe('app router', () => {
  beforeEach(() => {
    authStoreState.authUser = {
      unique_id: 'user-1',
      user_id: 'user-1',
      name: '山田 太郎',
      introduction: 'hello',
      iconimage: 'https://example.com/icon.png',
      homeimage: 'https://example.com/home.png',
    };
    authStoreState.clearUser.mockReset();
    authStoreState.isAuthenticated = false;
    authStoreState.isLoading = false;
  });

  it('routes unauthenticated users on /login to the public login page', () => {
    renderRouter('/login');

    expect(
      screen.getByRole('heading', {
        name: 'Mock Login Page',
      }),
    ).toBeInTheDocument();
  });

  it('routes authenticated users on / to the protected home page', () => {
    authStoreState.isAuthenticated = true;

    renderRouter('/');

    expect(
      screen.getByRole('heading', {
        name: 'Mock Home Page',
      }),
    ).toBeInTheDocument();
  });

  it('shows the not-found page for unknown paths', () => {
    renderRouter('/missing');

    expect(
      screen.getByRole('heading', {
        name: 'Mock Not Found Page',
      }),
    ).toBeInTheDocument();
  });
});
