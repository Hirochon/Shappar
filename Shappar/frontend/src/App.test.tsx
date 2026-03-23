import { describe, expect, it } from 'vitest';
import App from '@/App';
import { render, screen, userEvent } from '@/test/test-utils';

describe('App', () => {
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
});
