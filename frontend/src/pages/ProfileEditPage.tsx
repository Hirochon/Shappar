import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorDisplay } from '@/components/error-display';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getApiErrorMessage } from '@/hooks/use-api-error-handler';
import { useUpdateUser } from '@/hooks/useUpdateUser';
import { useAuthStore } from '@/stores/auth-store';

function getProfilePath(userId: string) {
  return `/profile/${userId}`;
}

export function ProfileEditPage() {
  const authUser = useAuthStore((state) => state.authUser);
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();
  const [name, setName] = useState(authUser?.name ?? '');
  const [introduction, setIntroduction] = useState(authUser?.introduction ?? '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setName(authUser?.name ?? '');
    setIntroduction(authUser?.introduction ?? '');
  }, [authUser?.introduction, authUser?.name]);

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

  const profilePath = getProfilePath(authUser.user_id);

  const handleCancel = () => {
    void navigate(profilePath);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedName = name.trim();
    const normalizedIntroduction = introduction.trim();

    setSubmitError(null);

    if (!normalizedName) {
      setNameError('名前を入力してください。');
      return;
    }

    setNameError(null);

    try {
      await updateUserMutation.mutateAsync({
        userId: authUser.user_id,
        name: normalizedName,
        introduction: normalizedIntroduction,
      });

      void navigate(profilePath);
    } catch (error) {
      setSubmitError(getApiErrorMessage(error));
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-6">
      <Card className="overflow-hidden border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <div className="bg-[linear-gradient(135deg,_rgba(14,165,233,0.14),_rgba(226,232,240,0.82))] px-6 py-8">
          <CardHeader className="space-y-3 p-0">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Profile Edit
            </p>
            <CardTitle className="text-3xl font-semibold text-slate-950">
              プロフィールを編集
            </CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6 text-slate-600">
              名前と説明文を更新できます。画像アップロードはバックエンド仕様の確定後に追加予定です。
            </CardDescription>
          </CardHeader>
        </div>
        <CardContent className="space-y-6 p-6">
          {submitError ? <ErrorDisplay message={submitError} /> : null}

          <form className="space-y-6" onSubmit={(event) => void handleSubmit(event)}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-900"
                htmlFor="profile-name"
              >
                名前
              </label>
              <Input
                autoComplete="name"
                id="profile-name"
                onChange={(event) => {
                  setName(event.target.value);
                  if (nameError) {
                    setNameError(null);
                  }
                }}
                placeholder="表示名を入力"
                value={name}
              />
              {nameError ? (
                <p className="text-sm font-medium text-red-600">{nameError}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-slate-900"
                htmlFor="profile-introduction"
              >
                説明文
              </label>
              <Textarea
                id="profile-introduction"
                onChange={(event) => {
                  setIntroduction(event.target.value);
                }}
                placeholder="好きな撮影スタイルや自己紹介を書いてください"
                value={introduction}
              />
            </div>

            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Media
                </p>
                <p className="text-lg font-semibold text-slate-900">
                  画像アップロード機能は準備中
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  アイコン画像とホーム画像のアップロードは、バックエンドの更新 API 仕様確定後に追加します。
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                onClick={handleCancel}
                type="button"
                variant="outline"
              >
                キャンセル
              </Button>
              <Button
                disabled={updateUserMutation.isPending}
                type="submit"
              >
                {updateUserMutation.isPending ? '保存中...' : '保存'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
