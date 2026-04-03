import { useState } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import { PollCard } from '@/components/poll-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePostedPolls } from '@/hooks/usePostedPolls';
import { useVotedPolls } from '@/hooks/useVotedPolls';
import type { Post } from '@/types/api';

type MyPageTab = 'posted' | 'voted';

function LoadingState({ label }: { label: string }) {
  return (
    <div
      aria-live="polite"
      className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 text-slate-700"
      role="status"
    >
      <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300 bg-white/70 px-6 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
        My Page
      </p>
      <h3 className="mt-3 text-2xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function PollGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {posts.map((post) => (
        <PollCard key={post.post_id} post={post} />
      ))}
    </div>
  );
}

function PollListContent({
  emptyDescription,
  emptyTitle,
  errorMessage,
  isError,
  isLoading,
  loadingLabel,
  onRetry,
  posts,
}: {
  emptyDescription: string;
  emptyTitle: string;
  errorMessage: string;
  isError: boolean;
  isLoading: boolean;
  loadingLabel: string;
  onRetry: () => void;
  posts: Post[];
}) {
  if (isLoading) {
    return <LoadingState label={loadingLabel} />;
  }

  if (isError) {
    return <ErrorDisplay message={errorMessage} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  return <PollGrid posts={posts} />;
}

export function MyPage({
  isOwnPage,
  userId,
}: {
  isOwnPage: boolean;
  userId: string;
}) {
  const [activeTab, setActiveTab] = useState<MyPageTab>('posted');
  const postedQuery = usePostedPolls(userId);
  // Voted history is private and only needs fetching when the user opens that tab.
  const votedQuery = useVotedPolls(userId, {
    enabled: isOwnPage && activeTab === 'voted',
  });
  const postedPosts = postedQuery.data?.posts ?? [];
  const votedPosts = votedQuery.data?.posts ?? [];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
          My Page
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              投稿と投票の履歴
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              自分の活動を振り返ったり、気になるユーザーの投稿一覧を確認できます。
            </p>
          </div>
          <div className="rounded-2xl bg-sky-50 px-4 py-3 text-sm text-sky-900">
            {activeTab === 'posted'
              ? `投稿 ${postedPosts.length} 件`
              : `投票履歴 ${votedPosts.length} 件`}
          </div>
        </div>
      </div>

      <Tabs
        className="space-y-0"
        onValueChange={(value) => setActiveTab(value as MyPageTab)}
        value={activeTab}
      >
        <TabsList
          className={`grid w-full max-w-md ${
            isOwnPage ? 'grid-cols-2' : 'grid-cols-1'
          }`}
        >
          <TabsTrigger value="posted">投稿した投票</TabsTrigger>
          {isOwnPage ? <TabsTrigger value="voted">投票した履歴</TabsTrigger> : null}
        </TabsList>

        <TabsContent value="posted">
          <PollListContent
            emptyDescription="投票を作成すると、ここに自分の投稿が並びます。"
            emptyTitle="まだ投稿した投票はありません。"
            errorMessage={
              postedQuery.error instanceof Error
                ? postedQuery.error.message
                : '投稿した投票の取得に失敗しました。'
            }
            isError={postedQuery.isError}
            isLoading={postedQuery.isLoading}
            loadingLabel="投稿した投票を読み込み中..."
            onRetry={() => {
              void postedQuery.refetch();
            }}
            posts={postedPosts}
          />
        </TabsContent>

        {isOwnPage ? (
          <TabsContent value="voted">
            <PollListContent
              emptyDescription="投票に参加すると、ここからいつでも履歴を見返せます。"
              emptyTitle="まだ投票した履歴はありません。"
              errorMessage={
                votedQuery.error instanceof Error
                  ? votedQuery.error.message
                  : '投票した履歴の取得に失敗しました。'
              }
              isError={votedQuery.isError}
              isLoading={votedQuery.isLoading}
              loadingLabel="投票した履歴を読み込み中..."
              onRetry={() => {
                void votedQuery.refetch();
              }}
              posts={votedPosts}
            />
          </TabsContent>
        ) : null}
      </Tabs>
    </section>
  );
}
