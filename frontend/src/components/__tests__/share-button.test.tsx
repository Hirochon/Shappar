import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ShareButton } from '@/components/ShareButton';
import { Toaster } from '@/components/ui/toaster';
import { ToastContextProvider } from '@/hooks/use-toast';
import { render, screen, userEvent, waitFor } from '@/test/test-utils';

const question = '次にみんなで撮りに行くならどこ？';
const url = 'https://example.com/polls/post-unvoted';
const shareText = `${question} - Shappar で投票しよう！`;

const clipboardWriteText = vi.fn();
const share = vi.fn();

function renderShareButton() {
  return render(
    <ToastContextProvider>
      <ShareButton question={question} url={url} />
      <Toaster />
    </ToastContextProvider>,
  );
}

describe('ShareButton', () => {
  beforeEach(() => {
    share.mockReset();
    clipboardWriteText.mockReset();
    clipboardWriteText.mockResolvedValue(undefined);

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      writable: true,
      value: undefined,
    });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: clipboardWriteText,
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the share button', () => {
    renderShareButton();

    expect(screen.getByRole('button', { name: 'シェア' })).toBeInTheDocument();
  });

  it('calls navigator.share when Web Share API is available', async () => {
    share.mockResolvedValueOnce(undefined);

    Object.defineProperty(navigator, 'share', {
      configurable: true,
      writable: true,
      value: share,
    });

    renderShareButton();

    await userEvent.click(screen.getByRole('button', { name: 'シェア' }));

    await waitFor(() => {
      expect(share).toHaveBeenCalledWith({
        title: question,
        text: shareText,
        url,
      });
    });
    expect(clipboardWriteText).not.toHaveBeenCalled();
  });

  it('copies the poll URL when Web Share API is unavailable', async () => {
    renderShareButton();

    await userEvent.click(screen.getByRole('button', { name: 'シェア' }));

    await waitFor(() => {
      expect(clipboardWriteText).toHaveBeenCalledWith(url);
    });
  });

  it('shows a success toast after copying the poll URL', async () => {
    renderShareButton();

    await userEvent.click(screen.getByRole('button', { name: 'シェア' }));

    expect(await screen.findByText('リンクをコピーしました')).toBeInTheDocument();
    expect(
      screen.getByText('この投票を貼り付けてシェアできます。'),
    ).toBeInTheDocument();
  });
});
