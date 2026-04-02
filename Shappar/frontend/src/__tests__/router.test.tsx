import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { appRoutes } from '@/router';
import { render, screen } from '@/test/test-utils';

const authStoreState = vi.hoisted(() => ({
  initAuthListener: vi.fn(() => vi.fn()),
  isAuthenticated: false,
  isLoading: false,
}));

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (
    selector: (
      state: {
        initAuthListener: () => () => void;
        isAuthenticated: boolean;
        isLoading: boolean;
      },
    ) => unknown,
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
