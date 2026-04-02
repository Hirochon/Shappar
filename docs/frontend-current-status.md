# フロントエンド現状把握

## 結論

- 現行 repo で確認できる frontend 実装は repo 直下の `frontend/` であり、旧ドキュメントが前提にしていた別 frontend ディレクトリは存在しない
- `frontend/` は Vite + React + TypeScript を土台に、React Router、TanStack Query、Zustand、Firebase Auth、Tailwind CSS、Vitest を組み合わせた構成になっている
- `.github/workflows/frontend-ci.yml` が `frontend/**` を対象に `npm ci`、lint、test、build を実行しており、現行 repo で確認できる frontend の CI 導線は GitHub Actions である
- 一方で、`django-server/config/urls.py` は引き続き `index.html` を返す SPA ルートを持つが、repo 内に `django-server/templates/index.html` は見当たらない。Django 配信導線と `frontend/` の build 成果物の接続方法は、この repo だけでは未確認

## 調査対象

- `README.md`
- `docs/frontend-current-status.md`
- `frontend/`
- `.github/workflows/frontend-ci.yml`
- `django-server/config/urls.py`
- `django-server/config/views.py`
- `django-server/templates/`
- `django-server/accounts/`
- `docker-compose.yml`
- `Makefile`

## 現状サマリ

### 1. README には旧 Vue SPA の説明が残っている

`README.md` には以下の説明が残っている。

- Vue.js + Django REST Framework の SPA
- Vue CLI でビルドした静的ファイルを S3 / CloudFront に配置
- Storybook を含む frontend 構成

一方で、この workspace では以下を確認できなかった。

- `.vue` ファイル
- Vue 用の `package.json` や `vue.config.js`
- Storybook 設定
- Vue のビルド成果物

このため、README の Vue 記述は現行 repo の実装状況というより、過去構成の説明として読むのが安全である。

### 2. 現行 frontend は `frontend/` の Vite アプリ

`frontend/package.json` から、現行 frontend は Vite ベースの React + TypeScript プロジェクトとして管理されている。

- scripts
  - `npm run dev`
  - `npm run build` (`tsc -b && vite build`)
  - `npm run lint`
  - `npm run test`
  - `npm run test:coverage`
  - `npm run preview`
- runtime 依存
  - `react`
  - `react-dom`
  - `react-router-dom`
  - `@tanstack/react-query`
  - `zustand`
  - `firebase`
- 開発ツール
  - `vite`
  - `typescript`
  - `vitest`
  - `@testing-library/*`
  - `msw`
  - `eslint`
  - `prettier`
  - `tailwindcss`

実体として確認できる主なファイルは次のとおり。

- `frontend/src/main.tsx`
  - Vite の entrypoint
  - 開発時に `VITE_ENABLE_MOCKS=true` のときだけ MSW を起動する
- `frontend/src/App.tsx`
  - `QueryClientProvider` と `RouterProvider` を束ねる
  - `useAuthStore` の `initAuthListener()` で認証状態監視を開始する
- `frontend/src/router.tsx`
  - `/login`
  - `/`
  - `*`
  の 3 系統を定義する
  - 未認証ユーザーは `ProtectedRoute` から `/login` へリダイレクトされる
- `frontend/src/pages/login-page.tsx`
  - Firebase Auth の Google ログイン popup を起点に認証を開始する
  - ログイン後は `useAuthMutation()` で backend 側の認証導線に繋ぐ実装になっている
- `frontend/src/pages/home-page.tsx`
  - 「投票一覧などの内容は後続イシューで追加します」と表示するプレースホルダ画面

現時点で repo から確認できる frontend は、「別ディレクトリに置かれた独立試作」ではなく、「Vite ベースで再構築が進んでいる app shell と認証導線の土台」である。

### 3. frontend CI は GitHub Actions にある

`.github/workflows/frontend-ci.yml` では、frontend 用の CI が GitHub Actions として定義されている。

- trigger
  - `push` on `main`
  - `pull_request`
  - いずれも `frontend/**` または `.github/workflows/frontend-ci.yml` の変更時のみ実行
- 実行環境
  - `ubuntu-latest`
  - `actions/setup-node@v4`
  - Node.js `24`
  - working directory は `frontend`
- 実行内容
  - `npm ci`
  - `npm run lint`
  - `npm run test -- --coverage`
  - `npm run build`

少なくとも現行 repo で確認できる frontend CI 導線は、この GitHub Actions workflow である。README に残る CircleCI の説明が現在も使われているかどうかは、この repo だけでは断定できない。

### 4. frontend のローカル実行導線は root の Docker 導線と分かれている

root の `docker-compose.yml` には以下の service がある。

- `shappar-back`
- `db`
- `nginx`
- `swagger-generate-go-code`

一方で、`frontend/` を起動する service は定義されていない。

`Makefile` にも frontend 用のコマンドはなく、定義されているのは Django 管理コマンド群だけである。

そのため、repo から確認できる現行の frontend 開発導線は、

- Docker / Makefile ベースの backend 導線
- `frontend/` で個別に `npm run dev` などを使う frontend 導線

の 2 本に分かれていると読むのが自然である。

### 5. Django 側には SPA 前提と server-rendered 画面が混在している

`django-server/config/urls.py` では、以下のルートが `TemplateView(template_name='index.html')` に向いている。

- `/`
- `/mypage/*`
- `/settings/*`
- `/login/*`
- `/home/*`

これは Django 側に SPA 入口を返す前提が残っていることを示している。

一方で、repo 内には `django-server/templates/index.html` が存在しない。

また、以下の Django テンプレートは現在も存在する。

- `django-server/templates/account/*.html`
- `django-server/templates/home.html`

つまり現在の repo は、

- Django 側に旧来の SPA 入口前提が残っている
- 認証や補助画面の一部は server-rendered template が残っている
- ただし SPA 入口 `index.html` の実体や `frontend/` build との接続は repo 内では確認できない

という状態にある。

## 進捗の見方

### repo から確認できること

- 旧ドキュメントが前提にしていた別 frontend 試作ではなく、`frontend/` の Vite + React + TypeScript app が存在する
- Firebase Auth を使った Google ログイン導線、auth guard、router、query client、test 基盤が実装されている
- frontend CI は `.github/workflows/frontend-ci.yml` にあり、lint / test / build まで自動化されている

### repo からは未確認なこと

- `frontend/` の build 成果物を Django / nginx が本番でどう配信しているか
- README に残る旧 Vue 資産が別 repo、別 branch、外部ストレージのどこにあるか
- 現行 `frontend/` が投稿一覧、投稿作成、マイページ、設定など旧 README 記載の主要画面をどこまで置き換えているか
- `frontend/README.md` に書かれたディレクトリ構成のうち、将来用の空ディレクトリと運用中の実装境界がどこか

## 補足

この repo だけを見る限り、frontend の現在地は「別ディレクトリの試作 frontend」ではない。実際には `frontend/` に Vite ベースの新しい frontend があり、認証導線と app shell を先に固めつつ、backend 側の旧導線との接続方法はまだ repo から断定できない段階にある。
