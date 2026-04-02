import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePollDetail } from '@/hooks/usePollDetail';
import { useVote } from '@/hooks/useVote';
import { apiClient } from '@/lib/api-client';
import { getApiErrorMessage } from '@/hooks/use-api-error-handler';
import { useAuthStore } from '@/stores/auth-store';
import type { PostOption } from '@/types/api';

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getNormalizedVotes(votes: number | undefined) {
  return Math.max(votes ?? 0, 0);
}

function getPercentage(option: PostOption, total: number) {
  if (total <= 0) {
    return 0;
  }

  return Math.round((getNormalizedVotes(option.votes) / total) * 100);
}

function LoadingState() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div
        aria-live="polite"
        className="space-y-4 text-center"
        role="status"
      >
        <div className="mx-auto size-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
            Poll Detail
          </p>
          <p className="text-base text-slate-600">
            投票詳細を読み込んでいます...
          </p>
        </div>
      </div>
    </main>
  );
}

export function PollDetailPage() {
  const { id = '', pollId = '' } = useParams();
  const postId = pollId || id;
  const navigate = useNavigate();
  const authUser = useAuthStore((state) => state.authUser);
  const {
    data: post,
    error: pollDetailError,
    isError: isPollDetailError,
    isLoading,
    refetch,
  } = usePollDetail(postId);
  const voteMutation = useVote(postId);
  const deleteMutation = useMutation({
    mutationFn: () => apiClient.delete(`/api/v1/posts/${postId}`),
    onSuccess: () => {
      void navigate('/', { replace: true });
    },
  });

  const errorMessage = useMemo(() => {
    if (voteMutation.isError) {
      return getApiErrorMessage(voteMutation.error);
    }

    if (deleteMutation.isError) {
      return getApiErrorMessage(deleteMutation.error);
    }

    if (isPollDetailError) {
      return getApiErrorMessage(pollDetailError);
    }

    return null;
  }, [
    deleteMutation.error,
    deleteMutation.isError,
    isPollDetailError,
    pollDetailError,
    voteMutation.error,
    voteMutation.isError,
  ]);

  if (!postId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ErrorDisplay
          message="投稿 ID が見つかりませんでした。"
          onRetry={() => {
            void navigate('/');
          }}
        />
      </main>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <ErrorDisplay
          message={getApiErrorMessage(pollDetailError)}
          onRetry={() => {
            void refetch();
          }}
        />
      </main>
    );
  }

  const isOwner = authUser?.user_id === post.user_id;
  const showResults = post.voted;

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="space-y-6">
        <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
          <div className="bg-[linear-gradient(135deg,_rgba(14,165,233,0.15),_rgba(226,232,240,0.8))] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
                  Poll Detail
                </p>
                <div className="space-y-2">
                  <h1 className="text-3xl font-semibold leading-tight text-slate-950">
                    {post.question}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-slate-600">
                    {showResults
                      ? '現在の得票結果を表示しています。'
                      : '気になる選択肢を 1 つ選んで投票してください。'}
                  </p>
                </div>
              </div>
              {isOwner ? (
                <Button
                  className="gap-2 self-start"
                  disabled={deleteMutation.isPending}
                  onClick={() => {
                    deleteMutation.mutate();
                  }}
                  type="button"
                  variant="outline"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M3 6h18M8 6V4h8v2m-7 3v8m6-8v8M6 6l1 14h10l1-14"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                    />
                  </svg>
                  {deleteMutation.isPending ? '削除中...' : '削除'}
                </Button>
              ) : null}
            </div>
          </div>
          <CardContent className="space-y-6 p-6">
            <dl className="grid gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3">
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  作成者
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  @{post.user_id}
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  投票数
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  {post.total}票
                </dd>
              </div>
              <div className="space-y-1">
                <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  作成日時
                </dt>
                <dd className="text-sm font-medium text-slate-900">
                  <time dateTime={post.created_at}>
                    {formatCreatedAt(post.created_at)}
                  </time>
                </dd>
              </div>
            </dl>

            {errorMessage ? (
              <ErrorDisplay
                message={errorMessage}
                onRetry={() => {
                  if (isPollDetailError) {
                    void refetch();
                  }
                }}
              />
            ) : null}

            {showResults ? (
              <section aria-label="投票結果" className="space-y-4">
                {post.options.map((option) => {
                  const votes = getNormalizedVotes(option.votes);
                  const percentage = getPercentage(option, post.total);
                  const isSelected = post.selected_num === option.select_num;

                  return (
                    <article
                      className="space-y-2 rounded-2xl border border-slate-200 p-4"
                      key={option.select_num}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                          <p className="text-base font-semibold text-slate-950">
                            {option.answer}
                          </p>
                          {isSelected ? (
                            <p className="text-xs font-medium text-sky-700">
                              あなたの投票
                            </p>
                          ) : null}
                        </div>
                        <p className="text-sm font-medium text-slate-600">
                          {votes}票 / {percentage}%
                        </p>
                      </div>
                      <div
                        aria-hidden="true"
                        className="h-3 overflow-hidden rounded-full bg-slate-200"
                      >
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,_#0ea5e9,_#38bdf8)] transition-[width] duration-300"
                          data-testid={`poll-result-bar-${option.select_num}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </article>
                  );
                })}
              </section>
            ) : (
              <section aria-label="投票選択肢" className="space-y-3">
                {post.options.map((option) => (
                  <Button
                    className="flex h-auto w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left text-base font-semibold text-slate-950 shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-slate-50"
                    disabled={voteMutation.isPending}
                    key={option.select_num}
                    onClick={() => {
                      voteMutation.mutate({
                        selectNum: option.select_num,
                      });
                    }}
                    type="button"
                    variant="ghost"
                  >
                    <span>{option.answer}</span>
                    <span className="text-sm font-medium text-slate-400">
                      投票する
                    </span>
                  </Button>
                ))}
              </section>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
