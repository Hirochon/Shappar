import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type ShareButtonProps = {
  question: string;
  url: string;
};

function ShareIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24">
      <path
        d="M14 4h6v6m-7 7 7-7M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ShareButton({ question, url }: ShareButtonProps) {
  const { toast } = useToast();
  const shareText = `${question} - Shappar で投票しよう！`;

  async function handleShare() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: question,
          text: shareText,
          url,
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }

      return;
    }

    await navigator.clipboard.writeText(url);
    toast({
      title: 'リンクをコピーしました',
      description: 'この投票を貼り付けてシェアできます。',
    });
  }

  return (
    <Button
      className="gap-2 self-start border-white/60 bg-white/80 text-slate-900 shadow-sm backdrop-blur hover:bg-white"
      onClick={() => {
        void handleShare();
      }}
      type="button"
      variant="outline"
    >
      <ShareIcon />
      シェア
    </Button>
  );
}
