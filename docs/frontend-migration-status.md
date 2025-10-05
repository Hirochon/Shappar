# フロントエンド移行状況ドキュメント

**作成日**: 2025-10-05  
**対象プロジェクト**: Shappar

## 目次

1. [概要](#概要)
2. [移行の背景](#移行の背景)
3. [現在の状況](#現在の状況)
4. [アーキテクチャ図](#アーキテクチャ図)
5. [実装済み機能](#実装済み機能)
6. [未実装機能](#未実装機能)
7. [技術スタック](#技術スタック)
8. [今後のタスク](#今後のタスク)

---

## 概要

ShapparプロジェクトはVue.jsからReact（Next.js）へのフロントエンド移行を実施中です。Vue.jsのコードは完全に削除され、React/Next.jsベースの新しいフロントエンドが構築されています。

## 移行の背景

### 元々の構成（Vue.js時代）
- **フロントエンド**: Vue.js 2.6.11 + Vue CLI 4.1.2
- **バックエンド**: Django REST Framework
- **デプロイ**: VueCLIでビルドした静的ファイルをS3にデプロイ、CloudFrontで配信
- **機能**: 投票アプリの完全実装（投稿一覧、投票、マイページなど）

### 移行の理由
- モダンなフレームワークへの更新
- TypeScript対応の強化
- Next.jsによるSSR/SSG機能の活用
- React生態系の活用

## 現在の状況

### ✅ 完了している部分

1. **Vue.jsコードの完全削除**
   - `.vue`ファイルは全て削除済み
   - Vue関連の依存関係も削除済み

2. **React/Next.jsプロジェクトのセットアップ**
   - Next.js（latest版）のインストール
   - TypeScript設定（tsconfig.json）
   - TailwindCSSの導入
   - プロジェクト構造の構築

3. **Firebase認証の実装**
   - Firebaseプロジェクトの設定
   - Google認証の実装
   - ログイン/ログアウト機能
   - 認証状態の確認機能

4. **バックエンドの拡張**
   - Django REST Framework（既存）
   - Go ServerによるFirebaseユーザー管理の追加
   - PlanetScale（MySQL）の導入

### ⚠️ 進行中・未完了の部分

1. **基本ページの実装が最小限**
   - ホームページ（`index.js`）: ログインページへのリンクのみ
   - ログインページ（`login.js`）: Firebase認証のみ

2. **Vue時代の機能が未移植**
   - 投稿一覧表示
   - 投票機能
   - 投票結果の表示・ソート
   - マイページ
   - プロフィール編集
   - 検索機能
   - ランキング機能
   - 下書き保存機能

3. **UI/UXの未実装**
   - デザインシステムの再構築
   - レスポンシブデザイン
   - マテリアルデザインの適用
   - アニメーション・トランジション

4. **状態管理の未実装**
   - Redux/Zustand等の状態管理ライブラリの導入なし
   - グローバル状態管理の設計なし

## アーキテクチャ図

### 現在のシステム構成

\`\`\`mermaid
graph TB
    subgraph "フロントエンド"
        React[React/Next.js<br/>react-front/]
        Pages[Pages<br/>index.js, login.js]
        Firebase[Firebase SDK<br/>認証]
    end

    subgraph "バックエンド"
        Django[Django<br/>REST Framework<br/>Port: 8000]
        GoServer[Go Server<br/>Firebase User管理<br/>Port: 8040]
    end

    subgraph "データベース"
        Postgres[(PostgreSQL<br/>Port: 5432)]
        MySQL[(MySQL/PlanetScale<br/>Port: 3306)]
    end

    subgraph "インフラ"
        Nginx[Nginx<br/>Port: 80]
    end

    React --> Firebase
    React --> Django
    React --> GoServer
    Django --> Postgres
    GoServer --> MySQL
    Nginx --> Django

    style React fill:#61dafb
    style Django fill:#092e20
    style GoServer fill:#00add8
    style Postgres fill:#336791
    style MySQL fill:#4479a1
\`\`\`

### Vue時代の構成（参考）

\`\`\`mermaid
graph TB
    subgraph "フロントエンド（削除済み）"
        Vue[Vue.js 2.6.11]
        VueCLI[Vue CLI]
    end

    subgraph "AWS"
        S3[S3<br/>静的ファイル配信]
        CloudFront[CloudFront<br/>CDN]
        ALB[Application Load Balancer]
        ECS[ECS<br/>Djangoコンテナ]
        RDS[(RDS<br/>PostgreSQL)]
    end

    Vue -->|ビルド| VueCLI
    VueCLI -->|デプロイ| S3
    S3 --> CloudFront
    CloudFront -->|API通信| ALB
    ALB --> ECS
    ECS --> RDS

    style Vue fill:#42b883,stroke:#333,stroke-width:4px,stroke-dasharray: 5 5
    style VueCLI fill:#42b883,stroke:#333,stroke-width:4px,stroke-dasharray: 5 5
\`\`\`

### 認証フロー

\`\`\`mermaid
sequenceDiagram
    participant User as ユーザー
    participant React as React App
    participant Firebase as Firebase Auth
    participant GoServer as Go Server
    participant MySQL as MySQL

    User->>React: ログインボタンクリック
    React->>Firebase: Google認証開始
    Firebase->>User: Google認証画面表示
    User->>Firebase: Google認証情報入力
    Firebase->>React: IDトークン返却
    React->>GoServer: IDトークン検証リクエスト
    GoServer->>Firebase: トークン検証
    Firebase->>GoServer: ユーザー情報返却
    GoServer->>MySQL: ユーザー情報保存/更新
    MySQL->>GoServer: 保存完了
    GoServer->>React: 認証成功レスポンス
    React->>User: ログイン完了表示
\`\`\`

### React実装のディレクトリ構造

\`\`\`mermaid
graph TD
    Root[react-front/]
    Root --> Pages[pages/]
    Root --> Public[public/]
    Root --> Styles[styles/]
    Root --> Config[設定ファイル群]
    
    Pages --> Index[index.js<br/>ホーム画面]
    Pages --> Login[login.js<br/>ログイン画面]
    Pages --> App[_app.js<br/>アプリケーションルート]
    Pages --> API[api/<br/>APIルート]
    
    Config --> NextConfig[next.config.js]
    Config --> TSConfig[tsconfig.json]
    Config --> TailwindConfig[tailwind.config.js]
    Config --> PackageJSON[package.json]
    Config --> FirebaseApp[FirebaseApp.js]
    
    Styles --> GlobalCSS[globals.css]
    
    Public --> Favicon[favicon.ico]
    Public --> Images[画像ファイル]

    style Index fill:#ffffcc
    style Login fill:#ccffcc
    style App fill:#ccccff
    style FirebaseApp fill:#ffcccc
\`\`\`

## 実装済み機能

### 1. 認証機能（Firebase）
- **ファイル**: `react-front/pages/login.js`, `react-front/FirebaseApp.js`
- **実装内容**:
  - Googleログイン（OAuth）
  - ログアウト
  - ログイン状態の確認
  - ローカルストレージによる永続化

### 2. 基本ページ構造
- **ホームページ** (`pages/index.js`): ログインページへのリンク
- **ログインページ** (`pages/login.js`): 認証UI

### 3. 開発環境
- Next.js開発サーバー
- TailwindCSS（スタイリング）
- TypeScript設定（ただし実際のコードはJavaScript）
- Docker対応

## 未実装機能

以下はVue時代に実装されていたが、React版では未実装の機能です：

### 投稿関連
- [ ] 投稿一覧表示
- [ ] 投稿詳細表示
- [ ] 投稿作成機能
- [ ] 投稿編集機能
- [ ] 投稿削除機能
- [ ] 下書き保存機能（LocalStorage）
- [ ] 画像アップロード

### 投票関連
- [ ] ワンタップ投票機能
- [ ] 投票結果表示
- [ ] 投票結果のソート（番号順、多い順、少ない順）
- [ ] 投票者の詳細情報表示
- [ ] グラフ表示（Chart.js等）

### ユーザー関連
- [ ] マイページ
- [ ] プロフィール編集
- [ ] ホーム画像アップロード
- [ ] 自己紹介編集
- [ ] 自分の投稿一覧
- [ ] 自分が投票した投稿一覧

### その他機能
- [ ] 検索機能
- [ ] ランキング表示
- [ ] ページネーション（非同期）
- [ ] Pull to Refresh
- [ ] レスポンシブデザイン
- [ ] エラーハンドリング
- [ ] ローディング表示
- [ ] 通知機能

### 技術的な未実装
- [ ] 状態管理ライブラリ（Redux/Zustand等）
- [ ] API通信の抽象化
- [ ] エラーバウンダリー
- [ ] テストコード
- [ ] Storybook
- [ ] 型定義（TypeScript化）
- [ ] パフォーマンス最適化
- [ ] SEO対策
- [ ] アクセシビリティ対応

## 技術スタック

### フロントエンド（React）

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| フレームワーク | Next.js | latest | React SSR/SSG |
| ライブラリ | React | ^18.2.0 | UIライブラリ |
| 言語 | TypeScript | 4.9.5 | 型安全性（設定のみ） |
| スタイリング | TailwindCSS | ^3.2.7 | CSSフレームワーク |
| 認証 | Firebase | ^9.17.1 | 認証・データベース |

### フロントエンド（Vue - 削除済み）

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フレームワーク | Vue.js | 2.6.11 |
| CLI | Vue CLI | 4.1.2 |
| 開発ツール | Storybook | - |
| スタイリング | Sass (scss) | - |

### バックエンド

| カテゴリ | 技術 | バージョン | 用途 |
|---------|------|-----------|------|
| Python | Django | 3.2.x | メインAPIサーバー |
| Python | DRF | - | REST API |
| Go | Go | latest | Firebaseユーザー管理 |

### データベース

| 種類 | 用途 | ポート |
|------|------|--------|
| PostgreSQL 13.4 | Djangoアプリデータ | 5432 |
| MySQL 8.0.23 | Firebaseユーザーデータ | 3306 |

### インフラ

| カテゴリ | 技術 |
|---------|------|
| コンテナ | Docker, Docker Compose |
| Webサーバー | Nginx |
| CI/CD | CircleCI（設定あり） |

## 今後のタスク

### フェーズ1: 基盤整備（優先度: 高）

1. **状態管理の導入**
   - Zustand または Redux Toolkit の導入
   - 認証状態の管理
   - ユーザー情報の管理

2. **API通信基盤の構築**
   - axios または fetch のラッパー作成
   - エラーハンドリングの統一
   - ローディング状態の管理

3. **型定義の強化**
   - JavaScript → TypeScript 変換
   - API レスポンスの型定義
   - コンポーネントの Props 型定義

4. **デザインシステムの構築**
   - カラーパレットの定義
   - コンポーネントライブラリの選定（Radix UI等）
   - 共通コンポーネントの作成

### フェーズ2: コア機能の実装（優先度: 高）

5. **投稿一覧機能**
   - 投稿一覧の表示
   - ページネーション
   - Pull to Refresh

6. **投票機能**
   - ワンタップ投票
   - 投票結果表示
   - リアルタイム更新

7. **投稿作成機能**
   - フォーム作成
   - バリデーション
   - 下書き保存

### フェーズ3: ユーザー機能の実装（優先度: 中）

8. **マイページ**
   - プロフィール表示
   - プロフィール編集
   - 画像アップロード

9. **ユーザーの投稿・投票履歴**
   - 自分の投稿一覧
   - 投票した投稿一覧

### フェーズ4: 付加機能の実装（優先度: 中〜低）

10. **検索・ランキング**
    - 投稿検索機能
    - ランキング表示

11. **UX向上**
    - アニメーション
    - トランジション
    - エラーメッセージの改善

### フェーズ5: 品質向上（優先度: 中）

12. **テストの追加**
    - Unit Test（Jest）
    - Integration Test
    - E2E Test（Playwright）

13. **パフォーマンス最適化**
    - コード分割
    - 画像最適化
    - キャッシング戦略

14. **SEO・アクセシビリティ**
    - メタタグの最適化
    - 構造化データ
    - WAI-ARIA対応

### フェーズ6: デプロイ・運用（優先度: 低）

15. **デプロイ設定**
    - Vercel / AWS へのデプロイ設定
    - 環境変数の管理
    - CI/CDパイプライン

---

## 付録

### ファイル一覧

#### React実装ファイル

\`\`\`
react-front/
├── pages/
│   ├── _app.js          # Next.jsアプリのルート
│   ├── index.js         # ホームページ（最小実装）
│   ├── login.js         # ログインページ（Firebase認証）
│   └── api/
│       └── hello.js     # サンプルAPIルート
├── styles/
│   └── globals.css      # グローバルスタイル
├── public/
│   ├── favicon.ico
│   └── vercel.svg
├── FirebaseApp.js       # Firebase初期化
├── package.json         # 依存関係
├── next.config.js       # Next.js設定
├── tsconfig.json        # TypeScript設定
├── tailwind.config.js   # TailwindCSS設定
├── postcss.config.js    # PostCSS設定
└── Dockerfile           # Docker設定
\`\`\`

### 環境変数

#### React (.env.local)

\`\`\`env
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
\`\`\`

### 開発コマンド

\`\`\`bash
# React開発サーバー起動
cd react-front
yarn dev  # または npm run dev

# ビルド
yarn build

# Django開発サーバー起動
docker compose up shappar-back

# Go Server起動
docker compose up shappar-go-server
\`\`\`

---

## まとめ

**現状**: Vue.jsから React/Next.jsへの移行は**基盤構築フェーズ**にあります。

**進捗率**: 
- インフラ整備: ✅ 100%
- 認証機能: ✅ 90%
- UI実装: ⚠️ 5-10%
- 機能実装: ⚠️ 0-5%

**次のステップ**: 
1. 状態管理ライブラリの導入
2. API通信基盤の構築
3. 投稿一覧機能の実装

この移行は大規模なため、段階的に進めることを推奨します。
