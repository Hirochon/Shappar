import { Link, useNavigate, useParams } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuthStore } from '@/stores/auth-store';

function getAvatarFallback(name: string) {
  const trimmedName = name.trim();

  if (!trimmedName) {
    return 'U';
  }

  return trimmedName.slice(0, 1).toUpperCase();
}

export function ProfilePage() {
  const authUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();
  const { userId = '' } = useParams();

  if (!authUser) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <ErrorDisplay
          message="プロフィール情報を取得できませんでした。"
          onRetry={() => {
            void navigate('/', { replace: true });
          }}
        />
      </main>
    );
  }

  if (userId && userId !== authUser.user_id) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <ErrorDisplay
          message="指定されたプロフィールを表示できません。"
          onRetry={() => {
            void navigate('/', { replace: true });
          }}
        />
      </main>
    );
  }

  const introduction =
    authUser.introduction.trim() || 'まだ自己紹介は登録されていません。';

  return (
    <section className="mx-auto max-w-4xl px-4 py-6">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <div className="relative h-48 bg-[linear-gradient(135deg,_rgba(14,165,233,0.18),_rgba(226,232,240,0.92))] sm:h-56">
          {authUser.homeimage ? (
            <img
              alt=""
              className="h-full w-full object-cover"
              src={authUser.homeimage}
            />
          ) : null}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05),rgba(15,23,42,0.3))]" />
        </div>

        <CardHeader className="relative -mt-16 gap-5 px-6 pb-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <Avatar className="size-24 border-4 border-white shadow-xl shadow-slate-950/10">
                <AvatarImage alt={authUser.name} src={authUser.iconimage} />
                <AvatarFallback className="text-2xl">
                  {getAvatarFallback(authUser.name)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 pb-1">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
                  Profile
                </p>
                <CardTitle className="text-3xl font-semibold text-slate-950">
                  プロフィール
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500">
                  @{authUser.user_id}
                </CardDescription>
              </div>
            </div>

            <Button asChild>
              <Link to="/profile/edit">プロフィールを編集</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Display Name
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {authUser.name}
            </p>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Introduction
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
              {introduction}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
