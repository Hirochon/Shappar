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

import App from '@/App';
import { render, screen, userEvent } from '@/test/test-utils';

describe('App', () => {
  beforeEach(() => {
    authStoreMocks.unsubscribe.mockReset();
    authStoreMocks.initAuthListener.mockReset();
    authStoreMocks.initAuthListener.mockReturnValue(authStoreMocks.unsubscribe);
  });

  it('renders the home page and supports a basic user interaction', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(
      screen.getByRole('heading', {
        name: 'UI foundation for the next screens.',
      }),
    ).toBeInTheDocument();

    expect(screen.getByText('bg-blue-500 utility active')).toBeInTheDocument();

    const primaryButton = screen.getByRole('button', {
      name: 'Primary action',
    });

    await user.click(primaryButton);

    expect(primaryButton).toHaveFocus();
  });

  it('starts the auth listener on mount and cleans it up on unmount', () => {
    const { unmount } = render(<App />);

    expect(authStoreMocks.initAuthListener).toHaveBeenCalledTimes(1);

    unmount();

    expect(authStoreMocks.unsubscribe).toHaveBeenCalledTimes(1);
  });
});
