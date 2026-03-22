# Shappar Frontend

`Shappar/frontend` は `npm create vite@latest -- --template react-ts` で生成した
Vite + React + TypeScript の初期プロジェクトです。

## Scripts

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## TypeScript setup

- `tsconfig.app.json`: ブラウザ側コード用の設定
- `tsconfig.node.json`: Vite 設定ファイル用の設定
- `@/*`: `src/*` に解決される path alias

## Directory structure

- `src/app`: アプリケーションのエントリ UI
- `src/components`: 共有 UI コンポーネント
- `src/features`: 機能単位の実装
- `src/hooks`: 共通 hooks
- `src/lib`: utility や API client
- `src/styles`: グローバルスタイル
