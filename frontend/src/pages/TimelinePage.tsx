import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PollCard } from '@/components/poll-card';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import { usePublicPolls } from '@/hooks/usePublicPolls';

function LoadingState() {
  return (
    <div
      aria-live="polite"
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 text-slate-700"
      role="status"
    >
      <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
      <p className="text-sm font-medium">公開投票を読み込み中...</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
        Timeline
      </p>
      <h2 className="mt-3 text-2xl font-semibold text-slate-950">
        公開中の投票はまだありません。
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        最初の投票を作成すると、ここに新着の公開投票が並びます。
      </p>
    </div>
  );
}

export function TimelinePage() {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isError,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = usePublicPolls();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        rootMargin: '240px 0px',
      },
    );

    observer.observe(loadMoreElement);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorDisplay
        message={
          error instanceof Error
            ? error.message
            : '公開投票の取得に失敗しました。'
        }
        onRetry={() => {
          void refetch();
        }}
      />
    );
  }

  return (
    <section className="relative space-y-8 pb-16">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          Public Timeline
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              みんなの公開投票
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              新着の公開投票を流し見しながら、気になるテーマにそのまま参加できます。
            </p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
            新着 {posts.length} 件
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post) => (
            <PollCard key={post.post_id} post={post} />
          ))}
        </div>
      )}

      <div aria-hidden="true" ref={loadMoreRef} />

      {isFetchingNextPage ? (
        <div className="flex items-center justify-center gap-3 py-2 text-sm text-slate-500">
          <div className="size-4 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />
          <span>さらに読み込み中...</span>
        </div>
      ) : null}

      <Button
        aria-label="投票を作成"
        asChild
        className="fixed bottom-8 right-8 h-14 w-14 rounded-full bg-sky-600 text-xl shadow-[0_20px_40px_rgba(2,132,199,0.35)] hover:bg-sky-500"
        size="icon"
      >
        <Link to="/create">+</Link>
      </Button>
    </section>
  );
}
