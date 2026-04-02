import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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

export function PollCard({ post }: { post: Post }) {
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
