import { describe, expect, it, vi } from 'vitest';
import { ErrorDisplay } from '@/components/error-display';
import { render, screen, userEvent } from '@/test/test-utils';

describe('ErrorDisplay', () => {
  it('shows the error message', () => {
    render(<ErrorDisplay message="データの取得に失敗しました。" />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'データの取得に失敗しました。',
    );
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = vi.fn();
    const user = userEvent.setup();

    render(
      <ErrorDisplay
        message="データの取得に失敗しました。"
        onRetry={onRetry}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: '再試行',
      }),
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
