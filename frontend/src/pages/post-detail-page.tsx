import { useLocation, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { CreatePostOptionRequest } from '@/types/api';

type PostDetailLocationState = {
  question?: string;
  options?: CreatePostOptionRequest[];
};

export function PostDetailPage() {
  const { postId = '' } = useParams();
  const location = useLocation();
  const state = (location.state ?? null) as PostDetailLocationState | null;

  return (
    <section className="mx-auto w-full max-w-3xl">
      <Card className="border-white/70 bg-white/90 shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
        <CardHeader className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-700">
              Poll
            </p>
            <CardTitle className="text-3xl text-slate-950">
              投票詳細
            </CardTitle>
          </div>
          <CardDescription className="text-base text-slate-600">
            <span className="font-medium text-slate-900">{postId}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {state?.question ? (
            <>
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Question
                </p>
                <p className="text-lg font-medium text-slate-950">
                  {state.question}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Options
                </p>
                <ol className="space-y-2">
                  {state.options?.map((option) => (
                    <li
                      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                      key={option.answer}
                    >
                      {option.answer}
                    </li>
                  ))}
                </ol>
              </div>
            </>
          ) : (
            <p className="text-sm leading-7 text-slate-600">
              作成した投票の詳細表示は後続イシューで拡張します。
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
