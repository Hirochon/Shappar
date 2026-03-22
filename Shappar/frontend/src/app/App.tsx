import './App.css'

const structureItems = [
  {
    name: 'app',
    description: 'アプリケーションのエントリ UI と将来の provider 配置用です。',
  },
  {
    name: 'components',
    description: '複数 feature から再利用する UI 部品を置きます。',
  },
  {
    name: 'features',
    description: '画面や機能単位の実装を feature ごとに分離します。',
  },
  {
    name: 'hooks',
    description: '共通の React hooks や副作用ラッパーを集約します。',
  },
  {
    name: 'lib',
    description: 'API client や utility など framework 非依存の処理を置きます。',
  },
  {
    name: 'styles',
    description: 'グローバルスタイルとデザイントークンの入口です。',
  },
] as const

const commands = ['npm install', 'npm run dev', 'npm run build'] as const

function App() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Shappar frontend scaffold</p>
        <h1>Vite + React + TypeScript の初期構成</h1>
        <p className="lead">
          `Shappar/frontend` に新しいフロントエンド基盤を作成しました。今後の
          実装起点として扱いやすいように、型設定と `src/` の責務を先に整理しています。
        </p>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Directory map</h2>
          <p>feature 実装を増やしても構成が崩れにくい最小単位です。</p>
        </div>
        <div className="directory-grid">
          {structureItems.map((item) => (
            <article key={item.name} className="directory-card">
              <code>{item.name}/</code>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Quick start</h2>
          <p>ローカル開発と build 確認の基本コマンドです。</p>
        </div>
        <ul className="command-list">
          {commands.map((command) => (
            <li key={command}>
              <code>{command}</code>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
