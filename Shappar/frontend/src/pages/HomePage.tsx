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

export function HomePage() {
  return (
    <main className="shell">
      <section className="hero-card">
        <p className="eyebrow">Shappar frontend</p>
        <h1>Vite + React + TypeScript の土台を作成</h1>
        <p className="lead">
          `Shappar/frontend` を今後の実装開始点として使えるように、strict な
          TypeScript 設定と機能分割しやすい `src/` 構成を先に整えています。
        </p>
      </section>

      <section className="content-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Directory map</h2>
            <p>機能追加の起点になるディレクトリを最小構成で用意しました。</p>
          </div>
          <div className="directory-grid">
            {directories.map((directory) => (
              <article key={directory.name} className="directory-card">
                <code>{directory.name}/</code>
                <p>{directory.description}</p>
              </article>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-header">
            <h2>Quick start</h2>
            <p>ローカル起動と build 確認に使う基本コマンドです。</p>
          </div>
          <ul className="command-list">
            {commands.map((command) => (
              <li key={command}>
                <code>{command}</code>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
