import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  MemoryRouter,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from '@/components/auth-guard';
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

function LoginLocationProbe() {
  const location = useLocation();
  const state = location.state as
    | {
        from?: {
          hash?: string;
          pathname?: string;
          search?: string;
        };
      }
    | null;
  const from = state?.from;

  return (
    <main>
      <h1>Login Page</h1>
      <p data-testid="current-path">{location.pathname}</p>
      <p data-testid="from-pathname">{from?.pathname ?? 'none'}</p>
      <p data-testid="from-search">{from?.search ?? 'none'}</p>
      <p data-testid="from-hash">{from?.hash ?? 'none'}</p>
    </main>
  );
}

describe('auth guards', () => {
  beforeEach(() => {
    authStoreState.isAuthenticated = false;
    authStoreState.isLoading = false;
  });

  it('redirects unauthenticated users from protected routes to /login', () => {
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<p>Protected Page</p>} />
          </Route>
          <Route path="/login" element={<LoginLocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole('heading', {
        name: 'Login Page',
      }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('current-path')).toHaveTextContent('/login');
  });

  it('renders protected content for authenticated users', () => {
    authStoreState.isAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<p>Protected Page</p>} />
          </Route>
          <Route path="/login" element={<LoginLocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Page')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', {
        name: 'Login Page',
      }),
    ).not.toBeInTheDocument();
  });

  it('redirects authenticated users away from /login', () => {
    authStoreState.isAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<p>Login Page</p>} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<p>Home Page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('shows a loading state while authentication is initializing', () => {
    authStoreState.isLoading = true;

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<p>Protected Page</p>} />
          </Route>
          <Route path="/login" element={<LoginLocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      '認証状態を確認しています...',
    );
    expect(screen.queryByText('Protected Page')).not.toBeInTheDocument();
  });

  it('preserves the original location in redirect state for post-login return', () => {
    render(
      <MemoryRouter initialEntries={['/polls/42?filter=open#recent']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/polls/:pollId" element={<p>Poll Detail</p>} />
          </Route>
          <Route path="/login" element={<LoginLocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('current-path')).toHaveTextContent('/login');
    expect(screen.getByTestId('from-pathname')).toHaveTextContent('/polls/42');
    expect(screen.getByTestId('from-search')).toHaveTextContent(
      '?filter=open',
    );
    expect(screen.getByTestId('from-hash')).toHaveTextContent('#recent');
  });
});
