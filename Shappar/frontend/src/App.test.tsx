import { beforeEach, describe, expect, it, vi } from 'vitest';

const authStoreMocks = vi.hoisted(() => {
  const unsubscribe = vi.fn();
  const initAuthListener = vi.fn(() => unsubscribe);
  const routerProvider = vi.fn((router: unknown) => {
    void router;

    return <div data-testid="router-provider" />;
  });

  return { initAuthListener, routerProvider, unsubscribe };
});

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (selector: (state: { initAuthListener: () => () => void }) => unknown) =>
    selector({ initAuthListener: authStoreMocks.initAuthListener }),
}));
vi.mock('@/router', () => ({
  router: { id: 'app-router' },
}));
vi.mock('react-router-dom', () => ({
  RouterProvider: ({
    router,
  }: {
    router: unknown;
  }) => authStoreMocks.routerProvider(router),
}));

import App from '@/App';
import { render, screen } from '@/test/test-utils';

describe('App', () => {
  beforeEach(() => {
    authStoreMocks.unsubscribe.mockReset();
    authStoreMocks.initAuthListener.mockReset();
    authStoreMocks.initAuthListener.mockReturnValue(authStoreMocks.unsubscribe);
    authStoreMocks.routerProvider.mockClear();
    authStoreMocks.routerProvider.mockReturnValue(
      <div data-testid="router-provider" />,
    );
  });

  it('renders the app router', () => {
    render(<App />);

    expect(screen.getByTestId('router-provider')).toBeInTheDocument();
  });

  it('starts the auth listener on mount and cleans it up on unmount', () => {
    const { unmount } = render(<App />);

    expect(authStoreMocks.initAuthListener).toHaveBeenCalledTimes(1);
    expect(authStoreMocks.routerProvider).toHaveBeenCalledWith({
      id: 'app-router',
    });

    unmount();

    expect(authStoreMocks.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
