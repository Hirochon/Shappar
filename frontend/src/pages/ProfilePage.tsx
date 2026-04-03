import { Link, useParams } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getApiErrorMessage } from '@/hooks/use-api-error-handler';
import { useUser } from '@/hooks/useUser';
import { useAuthStore } from '@/stores/auth-store';

function getAvatarFallback(label: string) {
  const trimmedLabel = label.trim();

  if (!trimmedLabel) {
    return 'U';
  }

  return trimmedLabel.slice(0, 1).toUpperCase();
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
            Profile
          </p>
          <p className="text-base text-slate-600">
            プロフィールを読み込んでいます...
          </p>
        </div>
      </div>
    </main>
  );
}

interface ProfileMetricProps {
  label: string;
  value: string;
}

function ProfileMetric({ label, value }: ProfileMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

export function ProfilePage() {
  const { userId = '' } = useParams();
  const authUserId = useAuthStore((state) => state.authUser?.user_id ?? '');
  const { data: user, error, isLoading, refetch } = useUser(userId);

  if (!userId) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorDisplay message="ユーザー ID が見つかりませんでした。" />
      </main>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorDisplay
          message={getApiErrorMessage(error)}
          onRetry={() => {
            void refetch();
          }}
        />
      </main>
    );
  }

  const isOwnProfile = authUserId === user.user_id;
  const displayName = user.name.trim() || user.user_id;
  const description =
    user.introduction.trim() || '自己紹介はまだ設定されていません。';
  const iconImage = user.iconimage.trim() || undefined;

  return (
    <section className="mx-auto w-full max-w-4xl">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <div className="bg-[linear-gradient(135deg,_rgba(14,165,233,0.16),_rgba(226,232,240,0.85))] px-6 py-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-24 border-4 border-white/90 shadow-lg shadow-slate-950/10">
                {iconImage ? (
                  <img
                    alt={`${displayName}のアイコン`}
                    className="aspect-square h-full w-full object-cover"
                    src={iconImage}
                  />
                ) : null}
                <AvatarFallback className="bg-slate-200 text-3xl font-semibold text-slate-700">
                  {getAvatarFallback(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                    Profile
                  </p>
                  <h1 className="text-3xl font-semibold text-slate-950">
                    {displayName}
                  </h1>
                  <p className="text-sm font-medium text-slate-500">
                    @{user.user_id}
                  </p>
                </div>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  {description}
                </p>
              </div>
            </div>
            <div className="flex min-h-10 min-w-32 items-start justify-start lg:justify-end">
              {isOwnProfile ? (
                <Button asChild className="min-w-32">
                  <Link to="/profile/edit">編集</Link>
                </Button>
              ) : (
                <Button
                  className="min-w-32"
                  disabled
                  type="button"
                  variant="outline"
                >
                  フォロー
                </Button>
              )}
            </div>
          </div>
        </div>
        <CardContent className="space-y-6 p-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <ProfileMetric label="投稿数" value={`${user.postedCount}件`} />
            <ProfileMetric label="投票数" value={`${user.votedCount}件`} />
          </dl>
        </CardContent>
      </Card>
    </section>
  );
}
