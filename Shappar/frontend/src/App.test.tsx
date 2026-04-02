import { beforeEach, describe, expect, it, vi } from 'vitest';

const authStoreMocks = vi.hoisted(() => {
  const unsubscribe = vi.fn();
  const initAuthListener = vi.fn(() => unsubscribe);

  return { initAuthListener, unsubscribe };
});

vi.mock('@/stores/auth-store', () => ({
  useAuthStore: (selector: (state: { initAuthListener: () => () => void }) => unknown) =>
    selector({ initAuthListener: authStoreMocks.initAuthListener }),
}));
vi.mock('@/pages/login-page', () => ({
  LoginPage: () => (
    <main>
      <h1>Shappar</h1>
      <button type="button">Google でログイン</button>
    </main>
  ),
}));

import App from '@/App';
import { render, screen } from '@/test/test-utils';

describe('App', () => {
  beforeEach(() => {
    authStoreMocks.unsubscribe.mockReset();
    authStoreMocks.initAuthListener.mockReset();
    authStoreMocks.initAuthListener.mockReturnValue(authStoreMocks.unsubscribe);
  });

  it('renders the login page', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: 'Shappar',
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: 'Google でログイン',
      }),
    ).toBeInTheDocument();
  });

  it('starts the auth listener on mount and cleans it up on unmount', () => {
    const { unmount } = render(<App />);

    expect(authStoreMocks.initAuthListener).toHaveBeenCalledTimes(1);

    unmount();

    expect(authStoreMocks.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
