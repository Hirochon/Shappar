import { Link, useParams } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { MyPage } from '@/pages/MyPage';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getApiErrorMessage } from '@/hooks/use-api-error-handler';
import { usePostedPolls } from '@/hooks/usePostedPolls';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useVotedPolls } from '@/hooks/useVotedPolls';
import { useAuthStore } from '@/stores/auth-store';
import type { User } from '@/types/api';

function getAvatarFallback(label: string) {
  const trimmedLabel = label.trim();

  if (!trimmedLabel) {
    return 'U';
  }

  return trimmedLabel.slice(0, 1).toUpperCase();
}

function getDisplayName(profile: User) {
  return profile.name.trim() || profile.user_id;
}

function getDescription(profile: User) {
  return profile.introduction.trim() || '自己紹介はまだ設定されていません。';
}

function getHomeImage(profile: User) {
  return profile.homeimage?.trim() || profile.homeImage?.trim() || '';
}

function LoadingState() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4 py-10">
      <div aria-live="polite" className="space-y-4 text-center" role="status">
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

function ProfileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <dt className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-2 text-2xl font-semibold text-slate-950">{value}</dd>
    </div>
  );
}

function ProfileHeader({
  isOwnPage,
  postedCount,
  profile,
  votedCount,
}: {
  isOwnPage: boolean;
  postedCount: number;
  profile: User;
  votedCount: number;
}) {
  const displayName = getDisplayName(profile);
  const description = getDescription(profile);
  const homeImage = getHomeImage(profile);
  const iconImage = profile.iconimage.trim() || undefined;

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div
        className="h-40 bg-[linear-gradient(135deg,_rgba(14,165,233,0.16),_rgba(226,232,240,0.85))] bg-cover bg-center sm:h-48"
        style={
          homeImage
            ? {
                backgroundImage: `linear-gradient(135deg, rgba(14,165,233,0.16), rgba(226,232,240,0.85)), url(${homeImage})`,
              }
            : undefined
        }
      />
      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="-mt-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <Avatar className="size-24 border-4 border-white/90 bg-slate-100 shadow-lg shadow-slate-950/10 sm:size-28">
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
            <div className="space-y-3 pb-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Profile
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {displayName}
                </h1>
                <p className="text-sm font-medium text-slate-500">
                  @{profile.user_id}
                </p>
              </div>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                {description}
              </p>
            </div>
          </div>
          <div className="flex min-h-10 min-w-32 items-start justify-start lg:justify-end">
            {isOwnPage ? (
              <Button asChild className="min-w-32">
                <Link to="/profile/edit">編集</Link>
              </Button>
            ) : (
              <Button className="min-w-32" disabled type="button" variant="outline">
                フォロー
              </Button>
            )}
          </div>
        </div>
        <dl
          className={`mt-6 grid gap-4 ${
            isOwnPage ? 'sm:grid-cols-2' : 'sm:grid-cols-1'
          }`}
        >
          <ProfileMetric label="投稿数" value={`${postedCount}件`} />
          {isOwnPage ? (
            <ProfileMetric label="投票数" value={`${votedCount}件`} />
          ) : null}
        </dl>
      </div>
    </section>
  );
}

export function ProfilePage() {
  const authUser = useAuthStore((state) => state.authUser);
  const authUserId = authUser?.user_id ?? '';
  const { userId: paramUserId } = useParams();
  const resolvedUserId = paramUserId ?? authUserId;
  const isOwnPage = authUserId.length > 0 && authUserId === resolvedUserId;
  const shouldLoadRemoteProfile = Boolean(paramUserId && resolvedUserId);
  const profileQuery = useUserProfile(resolvedUserId, {
    enabled: shouldLoadRemoteProfile,
  });
  const postedQuery = usePostedPolls(resolvedUserId, {
    enabled: resolvedUserId.length > 0,
  });
  const votedQuery = useVotedPolls(resolvedUserId, {
    enabled: isOwnPage && resolvedUserId.length > 0,
  });

  if (!resolvedUserId) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorDisplay message="プロフィールを表示できませんでした。" />
      </main>
    );
  }

  if (
    shouldLoadRemoteProfile &&
    (profileQuery.isLoading ||
      postedQuery.isLoading ||
      (isOwnPage && votedQuery.isLoading))
  ) {
    return <LoadingState />;
  }

  if (shouldLoadRemoteProfile && profileQuery.isError) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorDisplay
          message={getApiErrorMessage(profileQuery.error)}
          onRetry={() => {
            void profileQuery.refetch();
          }}
        />
      </main>
    );
  }

  const profile: User | null = shouldLoadRemoteProfile
    ? profileQuery.data ?? null
    : authUser;

  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <ErrorDisplay message="プロフィールを表示できませんでした。" />
      </main>
    );
  }

  const postedCount = postedQuery.data?.posts.length ?? 0;
  const votedCount = isOwnPage ? votedQuery.data?.posts.length ?? 0 : 0;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <ProfileHeader
        isOwnPage={isOwnPage}
        postedCount={postedCount}
        profile={profile}
        votedCount={votedCount}
      />
      <MyPage isOwnPage={isOwnPage} userId={resolvedUserId} />
    </div>
  );
}
