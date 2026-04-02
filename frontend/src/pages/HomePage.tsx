import { Button } from '@/components/ui/button';

const directories = [
  {
    name: 'components/ui',
    description: '共通 UI と shadcn/ui コンポーネントの配置先です。',
  },
  {
    name: 'features',
    description: 'auth や posts など機能別モジュールを切り出します。',
  },
  {
    name: 'hooks',
    description: '横断的に使うカスタムフックを集約します。',
  },
  {
    name: 'lib',
    description: 'API client や設定など再利用ロジックを置きます。',
  },
  {
    name: 'pages',
    description: '画面単位のコンポーネントを管理します。',
  },
  {
    name: 'stores',
    description: 'Zustand ストアの配置先です。',
  },
  {
    name: 'types',
    description: '共通型定義をまとめます。',
  },
  {
    name: 'test',
    description: 'テストユーティリティとセットアップを配置します。',
  },
] as const;

const commands = ['npm install', 'npm run dev', 'npm run build'] as const;
const verificationPillars = [
  {
    label: 'Tailwind utility',
    detail: '`bg-blue-500` chip confirms utility classes are compiling.',
  },
  {
    label: 'shadcn Button',
    detail: 'Primary / secondary / outline variants render from shared UI code.',
  },
  {
    label: 'Theme tokens',
    detail: 'CSS variables flow through `bg-background`, `text-foreground`, and Button variants.',
  },
] as const;

export function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fcf9f2_0%,#eef4fb_100%)]">
      <div className="relative container py-10 md:py-16">
        <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_58%)]" />

        <section className="grid gap-6 rounded-[2rem] border border-slate-200/70 bg-white/80 p-8 shadow-[0_32px_120px_rgba(15,23,42,0.12)] backdrop-blur md:p-10 xl:grid-cols-[minmax(0,1.15fr)_360px]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
              Tailwind + shadcn/ui
            </div>
            <div className="space-y-4">
              <h1 className="max-w-[12ch] text-4xl font-semibold leading-none tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
                UI foundation for the next screens.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                frontend に Tailwind CSS v3 と shadcn/ui の基盤を追加し、
                以降のログイン画面や共通レイアウトで共有できる UI レイヤーを先に整えています。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="shadow-lg shadow-slate-950/15">
                Primary action
              </Button>
              <Button variant="secondary">Secondary action</Button>
              <Button variant="outline">Outline action</Button>
            </div>
          </div>

          <aside className="rounded-[1.75rem] border border-slate-800/80 bg-slate-950 p-6 text-slate-50 shadow-inner">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Smoke test
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight">
              Shared tokens are live.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              右側の chip は Tailwind utility、上の buttons は shadcn/ui
              component の確認ポイントです。
            </p>
            <div className="mt-5 inline-flex rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/30">
              bg-blue-500 utility active
            </div>
            <div className="mt-6 grid gap-3">
              {verificationPillars.map((pillar) => (
                <article
                  key={pillar.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-sm font-semibold text-white">{pillar.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    {pillar.detail}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)]">
          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Directory map
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                機能追加の起点になるディレクトリを最小構成で用意しました。
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                `components/ui` と `lib` を UI 共通化の中心に据え、今後の feature
                実装を差し込みやすい構成にしています。
              </p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {directories.map((directory) => (
                <article
                  key={directory.name}
                  className="rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-5 transition-colors hover:border-slate-300 hover:bg-white"
                >
                  <code className="text-sm font-semibold text-cyan-700">
                    {directory.name}/
                  </code>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {directory.description}
                  </p>
                </article>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Quick validation
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                ローカルで確認するコマンド
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                build 成功と dev 起動を見れば、このチケットで整えるべき基盤確認は完了です。
              </p>
            </div>
            <ul className="mt-6 grid gap-3">
              {commands.map((command) => (
                <li
                  key={command}
                  className="rounded-2xl border border-slate-200 bg-slate-950 px-4 py-4 text-sm text-slate-50"
                >
                  <code>{command}</code>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </div>
    </main>
  );
}
