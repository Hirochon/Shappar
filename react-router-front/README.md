# react-router-front

`SHA-13` 向けの React Router フロントエンド土台です。Vite + React + TypeScript をベースにしつつ、開発サーバーは Express から起動し、Vite は middleware mode で配下にぶら下げています。

## Stack

- TypeScript
- Vite
- Vitest
- React Router
- pnpm
- Tailwind CSS v4
- Biome
- Express

## Prerequisites

- Node.js 20 以上
- `pnpm`

`corepack` は使わず、通常の `pnpm` CLI を前提にしています。

## Commands

```bash
pnpm install
pnpm dev
pnpm test --run
pnpm build
```

## Routes

- `/`: 構成サマリとセットアップ導線を表示
- `/status`: 検証観点と実行コマンドを表示
- `/health`: Express のヘルスチェック JSON を返す

## Notes

- `pnpm dev` は Express を `http://localhost:3000` で起動します
- クライアント描画は React Router、アセットと HMR は Vite middleware が担当します
- `pnpm preview` でも Express が `dist` を配信します
