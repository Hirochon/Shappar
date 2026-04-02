import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { usePublicPolls } from '@/hooks/usePublicPolls';
import type { Post } from '@/types/api';

function formatCreatedAt(createdAt: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(createdAt));
}

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

function PollCard({ post }: { post: Post }) {
  return (
    <Link
      aria-label={post.question}
      className="group block"
      to={`/polls/${post.post_id}`}
    >
      <Card className="h-full rounded-[1.75rem] border-slate-200/80 bg-white/95 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:border-sky-200 group-hover:shadow-[0_24px_60px_rgba(14,116,144,0.12)]">
        <CardHeader className="gap-4 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  投稿者 {post.user_id}
                </span>
                <span>{formatCreatedAt(post.created_at)}</span>
              </div>
              <CardTitle className="text-xl leading-8 text-slate-950">
                {post.question}
              </CardTitle>
            </div>
            {post.voted ? (
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                投票済み
              </span>
            ) : null}
          </div>
          <CardDescription className="text-sm leading-6 text-slate-600">
            回答候補を確認して、気になる投票にそのまま参加できます。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Choices
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                選択肢 {post.options.length}件
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Votes
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                投票 {post.total}票
              </p>
            </div>
          </div>
          <ul className="grid gap-2">
            {post.options.slice(0, 3).map((option) => (
              <li
                key={`${post.post_id}-${option.select_num}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700"
              >
                <span>{option.answer}</span>
                <span className="font-medium text-slate-500">
                  {post.voted ? `${option.votes ?? 0}票` : '結果は投票後に表示'}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </Link>
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
