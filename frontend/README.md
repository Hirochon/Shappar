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

将来的な API / Firebase 設定の追加に備えて `.env.example` を配置しています。
必要になったら `.env.local` を作成し、`VITE_` プレフィックス付きで値を設定します。

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
