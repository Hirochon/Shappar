# フロントエンド状況 - クイックリファレンス

> **最終更新**: 2025-10-05  
> **現在のブランチ**: cursor/SHA-8-document-frontend-status-and-create-diagrams-9cf7

## 📊 一目でわかる現状

| 項目 | 状態 | 進捗 |
|------|------|------|
| **Vue.js削除** | ✅ 完了 | 100% |
| **React/Next.js導入** | ✅ 完了 | 100% |
| **Firebase認証** | ✅ 実装済み | 90% |
| **基本ページ** | ⚠️ 最小限 | 10% |
| **投稿機能** | ❌ 未実装 | 0% |
| **投票機能** | ❌ 未実装 | 0% |
| **マイページ** | ❌ 未実装 | 0% |
| **全体進捗** | ⚠️ 初期段階 | **15%** |

## 🎯 次にやるべきこと（優先順位順）

1. **状態管理の導入** (Zustand推奨)
2. **API通信基盤の構築**
3. **TypeScript化**
4. **投稿一覧ページの実装**
5. **投票機能の実装**

## 📁 重要なファイル

### React実装

```
react-front/
├── pages/
│   ├── index.js       ← ホームページ（ほぼ空）
│   ├── login.js       ← ログインページ（Firebase認証）
│   └── _app.js        ← アプリルート
├── FirebaseApp.js     ← Firebase設定
└── package.json       ← 依存関係
```

### バックエンド

```
django/                ← Django REST Framework
go-server/             ← Go Server（Firebaseユーザー管理）
docker-compose.yml     ← 開発環境
```

## 🛠️ 開発コマンド

### React開発サーバー起動

```bash
cd react-front
yarn dev
# または
npm run dev
# → http://localhost:3000
```

### Django起動

```bash
docker compose up shappar-back
# → http://localhost:8000
```

### Go Server起動

```bash
docker compose up shappar-go-server
# → http://localhost:8040
```

## 📦 技術スタック

### フロントエンド（現在）

- **React**: 18.2.0
- **Next.js**: latest
- **Firebase**: 9.17.1
- **TailwindCSS**: 3.2.7
- **TypeScript**: 4.9.5（設定のみ）

### 推奨追加ライブラリ

```bash
# 状態管理
yarn add zustand

# API通信
yarn add axios swr

# フォーム
yarn add react-hook-form zod

# UI
yarn add @radix-ui/themes

# グラフ
yarn add recharts
```

## 🔑 環境変数

`.env.local`を作成して以下を設定:

```env
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=
```

## 🏗️ アーキテクチャ（簡易版）

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─→ Next.js (Port 3000)
       │   └─→ Firebase Auth
       │
       ├─→ Django REST API (Port 8000)
       │   └─→ PostgreSQL (Port 5432)
       │
       └─→ Go Server (Port 8040)
           └─→ MySQL (Port 3306)
```

## 📋 実装済み機能

### ✅ ログインページ (`pages/login.js`)

- Googleログイン
- ログアウト
- 認証状態確認

```javascript
// 使用例
const doLogin = () => { /* Firebase Google Login */ }
const checkLogin = () => { /* Check Auth State */ }
const doLogout = () => { /* Logout */ }
```

## ❌ 未実装だが必要な機能

### Vue時代に存在した機能（全て未実装）

1. **投稿機能**
   - 投稿一覧表示
   - 投稿作成・編集・削除
   - 下書き保存
   - ページネーション
   - Pull to Refresh

2. **投票機能**
   - ワンタップ投票
   - 投票結果表示
   - グラフ表示
   - 投票者詳細

3. **ユーザー機能**
   - マイページ
   - プロフィール編集
   - 投稿履歴
   - 投票履歴

4. **その他**
   - 検索
   - ランキング
   - レスポンシブデザイン

## 🚀 実装ロードマップ

### Phase 1: 基盤（1-2週間）

- [ ] Zustand導入
- [ ] API Client作成
- [ ] TypeScript化
- [ ] 共通コンポーネント作成

### Phase 2: コア機能（2-3週間）

- [ ] 投稿一覧ページ
- [ ] 投稿詳細ページ
- [ ] 投票機能

### Phase 3: 投稿作成（1-2週間）

- [ ] 投稿作成フォーム
- [ ] バリデーション
- [ ] 画像アップロード

### Phase 4: ユーザー機能（1-2週間）

- [ ] マイページ
- [ ] プロフィール編集

### Phase 5: 付加機能（1-2週間）

- [ ] 検索
- [ ] ランキング
- [ ] 通知

## 🔍 トラブルシューティング

### React開発サーバーが起動しない

```bash
cd react-front
rm -rf node_modules
rm yarn.lock  # または package-lock.json
yarn install  # または npm install
yarn dev
```

### Firebase認証エラー

1. `.env.local`の環境変数を確認
2. Firebaseコンソールでドメイン設定を確認
3. `localhost:3000`が認証ドメインに追加されているか確認

### Docker起動エラー

```bash
docker compose down
docker compose build --no-cache
docker compose up
```

## 📚 参考リンク

### 公式ドキュメント

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### プロジェクト内ドキュメント

- [詳細な移行状況](./frontend-migration-status.md)
- [フロー図・ダイアグラム](./frontend-migration-diagrams.md)
- [プロジェクトREADME](../README.md)
- [Getting Started](../GETTING_STARTED.md)

## 💡 開発のヒント

### 状態管理パターン（Zustand使用）

```typescript
// stores/authStore.ts
import create from 'zustand'

interface AuthState {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}))
```

### API呼び出しパターン

```typescript
// lib/api.ts
export const api = {
  posts: {
    list: () => fetch('/api/posts').then(r => r.json()),
    get: (id: string) => fetch(`/api/posts/${id}`).then(r => r.json()),
    create: (data: PostData) => 
      fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(r => r.json()),
  }
}
```

### カスタムフック例

```typescript
// hooks/usePosts.ts
import useSWR from 'swr'
import { api } from '@/lib/api'

export function usePosts() {
  const { data, error, mutate } = useSWR('posts', api.posts.list)
  
  return {
    posts: data,
    isLoading: !error && !data,
    isError: error,
    refetch: mutate
  }
}
```

## ⚡ パフォーマンス最適化チェックリスト

実装時に考慮すべき点：

- [ ] 画像最適化（Next.js Image component使用）
- [ ] コード分割（dynamic import）
- [ ] メモ化（useMemo, useCallback）
- [ ] 仮想スクロール（長いリスト）
- [ ] Lazy Loading
- [ ] API結果のキャッシング
- [ ] 楽観的UI更新

## 🎨 デザインガイドライン

Vue時代のデザイン原則を踏襲：

- **メインカラー**: 独自性の記憶
- **マテリアルデザイン**: UI参考
- **アイコン中心**: ボタンデザイン
- **レスポンシブ**: モバイルファースト
- **シンプル**: 長期使用可能

## 📞 サポート

質問や問題がある場合：

1. プロジェクトのドキュメントを確認
2. GitHub Issuesを検索
3. 開発チームに連絡

---

**このドキュメントは自動生成されました。**  
詳細は `frontend-migration-status.md` と `frontend-migration-diagrams.md` を参照してください。
