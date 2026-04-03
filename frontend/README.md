# Shappar Frontend

`frontend` は `npm create vite@latest -- --template react-ts` で生成した
Vite + React + TypeScript の初期プロジェクトを、Shappar 向けのフロントエンド土台として整えたものです。

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## TypeScript setup

- `tsconfig.json`: strict mode と `@/* -> src/*` を定義する共通設定
- `tsconfig.app.json`: ブラウザ側コード用の設定
- `tsconfig.node.json`: Vite 設定ファイル用の設定
- `vite.config.ts`: `@ -> ./src` の path alias を Vite 側に反映

## Environment variables

開発用の Firebase 設定は、Vite が自動で読む tracked file の
`.env.development` に置いてあります。`frontend` で `npm run dev` を実行すれば、
追加の `export` なしでこの設定が読み込まれます。

ローカルだけで値を上書きしたい場合は、`.env.local` または
`.env.development.local` を作成し、`VITE_` プレフィックス付きで設定します。
これらの local file は git ignore されています。

API を立ち上げずに画面確認したい場合は、MSW を有効にして起動します。

- 一時的に有効化: `VITE_ENABLE_MOCKS=true npm run dev`
- 常用する場合: `.env.development.local` に `VITE_ENABLE_MOCKS=true` を追加

## Directory structure

- `src/App.tsx`: アプリケーションのルートコンポーネント
- `src/components`: 共有 UI コンポーネント
- `src/components/ui`: `shadcn/ui` コンポーネント配置先
- `src/features`: 機能単位の実装
- `src/hooks`: 共通 hooks
- `src/lib`: utility や API client
- `src/pages`: ページコンポーネント
- `src/stores`: Zustand ストア
- `src/test`: テストユーティリティや setup
- `src/types`: 共通型定義
- `src/index.css`: ベーススタイル
- `public/favicon.svg`: ブラウザ用 favicon
