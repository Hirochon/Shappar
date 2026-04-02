import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '@/components/error-boundary';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

function ThrowingComponent(): never {
  throw new Error('render failed');
}

function StableComponent() {
  return <p>正常なコンテンツ</p>;
}

function RecoverableComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('recoverable failure');
  }

  return <p>復旧後のコンテンツ</p>;
}

function RecoverableBoundaryHarness() {
  const [shouldThrow, setShouldThrow] = useState(true);

  return (
    <ErrorBoundary
      onReset={() => {
        setShouldThrow(false);
      }}
    >
      <RecoverableComponent shouldThrow={shouldThrow} />
    </ErrorBoundary>
  );
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows the fallback UI when a child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '再試行' })).toBeInTheDocument();
    expect(screen.queryByText('正常なコンテンツ')).not.toBeInTheDocument();
  });

  it('shows the expected fallback message', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });

  it('resets the boundary when retry is clicked', async () => {
    const user = userEvent.setup();

    render(<RecoverableBoundaryHarness />);

    await user.click(
      screen.getByRole('button', {
        name: '再試行',
      }),
    );

    await waitFor(() => {
      expect(screen.getByText('復旧後のコンテンツ')).toBeInTheDocument();
    });
    expect(screen.queryByText('エラーが発生しました')).not.toBeInTheDocument();
  });

  it('renders children normally when there is no error', () => {
    render(
      <ErrorBoundary>
        <StableComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('正常なコンテンツ')).toBeInTheDocument();
    expect(screen.queryByText('エラーが発生しました')).not.toBeInTheDocument();
  });
});
