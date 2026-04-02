import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function ProfileEditPage() {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <Card className="border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <CardHeader className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
              Profile
            </p>
            <CardTitle className="text-3xl text-slate-950">
              プロフィール編集
            </CardTitle>
          </div>
          <CardDescription className="text-base leading-7 text-slate-600">
            この画面は後続フェーズで実装予定です。現在はプロフィール導線を先に接続しています。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-6 text-slate-600">
            編集機能の本体は未実装ですが、プロフィール画面の「編集」ボタンからこの導線に遷移できます。
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
