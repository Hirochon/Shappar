import { ErrorDisplay } from '@/components/error-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuthStore } from '@/stores/auth-store';
import type { UserProfile } from '@/types/api';
import { useParams } from 'react-router-dom';
import { MyPage } from '@/pages/MyPage';

function getAvatarFallback(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'U';
  }

  return trimmedName.slice(0, 1).toUpperCase();
}

function ProfileHeader({ profile }: { profile: UserProfile }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div
        className="h-40 bg-slate-200 bg-cover bg-center sm:h-48"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(14,165,233,0.32), rgba(15,23,42,0.24)), url(${profile.homeimage})`,
        }}
      />
      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="-mt-12 flex flex-col gap-5 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <Avatar className="size-24 border-4 border-white bg-slate-100 shadow-lg sm:size-28">
              <AvatarImage alt={profile.name} src={profile.iconimage} />
              <AvatarFallback className="text-2xl">
                {getAvatarFallback(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="pb-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                Profile
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                {profile.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">@{profile.user_id}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:min-w-[240px]">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Followers
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {profile.followers ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Following
              </p>
              <p className="mt-2 text-lg font-semibold text-slate-950">
                {profile.follow ?? 0}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Status
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-950">
                {profile.followed ? 'フォロー中' : '公開中'}
              </p>
            </div>
          </div>
        </div>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
          {profile.introduction}
        </p>
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div
      aria-live="polite"
      className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-slate-300 bg-white/70 text-slate-700"
      role="status"
    >
      <div className="size-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
      <p className="text-sm font-medium">プロフィールを読み込み中...</p>
    </div>
  );
}

export function ProfilePage() {
  const authUser = useAuthStore((state) => state.authUser);
  const { userId: paramUserId } = useParams();
  const resolvedUserId = paramUserId ?? authUser?.user_id ?? '';
  const isOwnPage = !paramUserId || paramUserId === authUser?.user_id;
  const profileQuery = useUserProfile(resolvedUserId, {
    enabled: !isOwnPage,
  });

  if (!resolvedUserId) {
    return <ErrorDisplay message="プロフィールを表示できませんでした。" />;
  }

  if (!isOwnPage && profileQuery.isLoading) {
    return <LoadingState />;
  }

  if (!isOwnPage && profileQuery.isError) {
    return (
      <ErrorDisplay
        message={
          profileQuery.error instanceof Error
            ? profileQuery.error.message
            : 'プロフィールの取得に失敗しました。'
        }
        onRetry={() => {
          void profileQuery.refetch();
        }}
      />
    );
  }

  const profile: UserProfile | null = isOwnPage
    ? authUser
      ? {
          ...authUser,
          followed: false,
          follow: 0,
          followers: 0,
        }
      : null
    : profileQuery.data ?? null;

  if (!profile) {
    return <ErrorDisplay message="プロフィールを表示できませんでした。" />;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader profile={profile} />
      <MyPage isOwnPage={isOwnPage} userId={resolvedUserId} />
    </div>
  );
}
