# フロントエンド状況ドキュメント

## 概要

このドキュメントは、Shapparプロジェクトのフロントエンド開発の現状を把握するために作成されました。

## 現在の状況サマリー

### ✅ 完了していること
- **Reactへの移行開始**: Next.jsベースのReactアプリケーションが`react-front`ディレクトリに構築されている
- **Firebase認証の実装**: Googleログイン機能が実装済み
- **基本的なページ構造**: ホームページとログインページが作成されている
- **開発環境の構築**: Docker環境が整っている

### ⚠️ 未完了・進行中のこと
- **Vueからの完全移行**: 元々のVue.jsコードは削除されているが、Reactでの機能実装はまだ初期段階
- **API連携**: バックエンドAPIとの連携が未実装
- **メイン機能の実装**: 投票機能、マイページ、投稿一覧などの主要機能が未実装
- **UI/UXデザイン**: TailwindCSSは導入されているが、デザインはほぼ未実装

## アーキテクチャ概要

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js React App<br/>react-front/]
        A1[index.js<br/>ホームページ]
        A2[login.js<br/>ログインページ]
        A3[FirebaseApp.js<br/>Firebase設定]
    end
    
    subgraph "Backend Layer"
        B[Django REST API<br/>apiv1/]
        C[Go Server<br/>go-server/]
        D[Django Templates<br/>templates/]
    end
    
    subgraph "Authentication"
        E[Firebase Auth]
    end
    
    subgraph "Database"
        F[PostgreSQL<br/>Django用]
        G[MySQL<br/>Go Server用]
    end
    
    A --> A1
    A --> A2
    A --> A3
    A3 --> E
    A -.未実装.-> B
    A -.未実装.-> C
    B --> F
    C --> G
    D --> F
    
    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#00BCD4
    style D fill:#FFC107
    style E fill:#FF5722
```

## フロントエンド技術スタック

### 現在のReactアプリケーション
```mermaid
graph LR
    A[react-front/] --> B[Next.js latest]
    A --> C[React 18.2.0]
    A --> D[Firebase 9.17.1]
    A --> E[TailwindCSS 3.2.7]
    A --> F[TypeScript 4.9.5]
    
    style A fill:#61DAFB,color:#000
    style B fill:#000000,color:#fff
    style C fill:#61DAFB,color:#000
    style D fill:#FFCA28,color:#000
    style E fill:#06B6D4,color:#fff
    style F fill:#3178C6,color:#fff
```

### パッケージ構成
| パッケージ | バージョン | 用途 |
|-----------|----------|------|
| next | latest | Reactフレームワーク |
| react | ^18.2.0 | UIライブラリ |
| react-dom | ^18.2.0 | React DOM操作 |
| firebase | ^9.17.1 | 認証・バックエンドサービス |
| tailwindcss | ^3.2.7 | CSSフレームワーク |
| typescript | 4.9.5 | 型安全性 |

## ディレクトリ構造

```
/workspace/
├── react-front/                 # Reactアプリケーション（新規）
│   ├── pages/                   # Next.jsページ
│   │   ├── _app.js             # アプリケーションルート
│   │   ├── index.js            # ホームページ（基本的なリンクのみ）
│   │   ├── login.js            # ログインページ（Firebase認証実装済み）
│   │   └── api/
│   │       └── hello.js        # サンプルAPIルート
│   ├── styles/
│   │   └── globals.css         # グローバルスタイル
│   ├── public/                 # 静的ファイル
│   ├── FirebaseApp.js          # Firebase初期化設定
│   ├── package.json            # 依存関係管理
│   ├── next.config.js          # Next.js設定
│   ├── tailwind.config.js      # Tailwind設定
│   ├── tsconfig.json           # TypeScript設定
│   └── Dockerfile              # Docker設定
│
├── apiv1/                      # Django REST APIバックエンド
│   ├── views.py                # APIビュー（多数実装済み）
│   ├── serializers.py          # シリアライザー
│   ├── urls.py                 # APIエンドポイント
│   └── models.py               # データモデル
│
├── go-server/                  # Goサーバー
│   └── internal/ui/gen/        # Swagger生成コード
│
└── templates/                  # Django テンプレート（旧実装）
    ├── account/                # アカウント関連ページ
    ├── base.html              # ベーステンプレート
    └── home.html              # ホームページ
```

## 実装済みのページ

### 1. ホームページ (`/pages/index.js`)
```mermaid
graph TD
    A[index.js] --> B[Header<br/>空]
    A --> C[Main<br/>ログインリンクのみ]
    A --> D[Footer<br/>空]
    
    style A fill:#61DAFB
    style B fill:#f0f0f0
    style C fill:#90EE90
    style D fill:#f0f0f0
```

**実装状況**: 
- ✅ ページ構造のみ
- ❌ コンテンツ未実装
- ❌ デザイン未実装

**コード概要**:
```javascript
// 非常にシンプルな構造
<main>
  <Link href="/login">login</Link>
</main>
```

### 2. ログインページ (`/pages/login.js`)
```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Page as login.js
    participant Firebase as Firebase Auth
    participant Google as Google OAuth
    
    User->>Page: ページアクセス
    Page->>User: ログインボタン表示
    User->>Page: 「googleでログインする」クリック
    Page->>Firebase: signInWithPopup()
    Firebase->>Google: OAuth認証リクエスト
    Google->>User: Googleログイン画面
    User->>Google: 認証情報入力
    Google->>Firebase: 認証トークン返却
    Firebase->>Page: ユーザー情報返却
    Page->>User: alert('ログインok!')
```

**実装機能**:
- ✅ Googleログイン
- ✅ ログイン状態確認
- ✅ ログアウト
- ✅ Firebase認証統合
- ❌ エラーハンドリングの改善が必要
- ❌ UIデザイン未実装（素のボタンのみ）

**主要な実装コード**:
```javascript
const doLogin = () => {
  const auth = getAuth();
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          alert('ログインok!');
        })
    })
}
```

## バックエンドAPI（実装済み）

以下のAPIエンドポイントはDjango REST Frameworkで実装済みですが、**フロントエンドからの呼び出しは未実装**です。

```mermaid
graph TB
    subgraph "実装済みDjango REST API"
        A[User APIs]
        B[Post APIs]
        C[Poll APIs]
        
        A --> A1[GET /api/v1/users/&lt;pk&gt;/<br/>マイページ取得]
        A --> A2[PUT/PATCH /api/v1/users/&lt;pk&gt;/<br/>マイページ更新]
        A --> A3[GET /api/v1/users/&lt;pk&gt;/posted/<br/>投稿一覧]
        A --> A4[GET /api/v1/users/&lt;pk&gt;/voted/<br/>投票一覧]
        
        B --> B1[POST /api/v1/posts/<br/>投稿作成]
        B --> B2[GET /api/v1/posts/public/<br/>公開投稿一覧]
        B --> B3[GET /api/v1/posts/public/rank/<br/>ランキング]
        B --> B4[GET /api/v1/posts/&lt;pk&gt;/<br/>投稿詳細]
        B --> B5[DELETE /api/v1/posts/&lt;pk&gt;/<br/>投稿削除]
        
        C --> C1[POST /api/v1/posts/&lt;pk&gt;/polls/<br/>投票]
    end
    
    style A fill:#2196F3
    style B fill:#4CAF50
    style C fill:#FF9800
```

### 主要APIエンドポイント一覧

| エンドポイント | メソッド | 説明 | フロントエンド実装 |
|--------------|---------|------|------------------|
| `/api/v1/users/<pk>/` | GET | マイページ情報取得 | ❌ |
| `/api/v1/users/<pk>/` | PUT/PATCH | マイページ更新 | ❌ |
| `/api/v1/users/<pk>/posted/` | GET | ユーザーの投稿一覧 | ❌ |
| `/api/v1/users/<pk>/voted/` | GET | ユーザーの投票一覧 | ❌ |
| `/api/v1/posts/` | POST | 新規投稿作成 | ❌ |
| `/api/v1/posts/public/` | GET | 公開投稿一覧（検索・ページネーション） | ❌ |
| `/api/v1/posts/public/rank/` | GET | 投票数ランキング | ❌ |
| `/api/v1/posts/public/<pk>/` | GET | 投稿の投票結果更新取得 | ❌ |
| `/api/v1/posts/<pk>/` | GET | 投稿詳細（統計情報） | ❌ |
| `/api/v1/posts/<pk>/` | DELETE | 投稿削除 | ❌ |
| `/api/v1/posts/<pk>/polls/` | POST | 投票実行 | ❌ |

## 未実装の主要機能

```mermaid
mindmap
  root((未実装機能))
    投稿機能
      投稿作成画面
      投稿一覧表示
      投稿詳細表示
      投稿削除
    投票機能
      投票実行
      結果表示
      統計情報表示
    マイページ
      プロフィール表示
      プロフィール編集
      自分の投稿一覧
      自分の投票一覧
    UI/UX
      レスポンシブデザイン
      マテリアルデザイン
      アニメーション
      ローディング表示
    その他
      検索機能
      ランキング表示
      ページネーション
      Pull to Refresh
```

## 開発フロー（現在地）

```mermaid
graph LR
    A[Vue.js実装<br/>完了] --> B[Vue削除<br/>完了]
    B --> C[Next.js環境構築<br/>完了]
    C --> D[Firebase認証<br/>完了]
    D --> E[基本ページ作成<br/>完了]
    E --> F[API連携<br/>未実装]
    F --> G[主要機能実装<br/>未実装]
    G --> H[UIデザイン<br/>未実装]
    H --> I[テスト<br/>未実装]
    
    style A fill:#90EE90
    style B fill:#90EE90
    style C fill:#90EE90
    style D fill:#90EE90
    style E fill:#90EE90
    style F fill:#FFB6C1
    style G fill:#FFB6C1
    style H fill:#FFB6C1
    style I fill:#FFB6C1
```

## 次のステップ（推奨実装順序）

```mermaid
gantt
    title フロントエンド実装ロードマップ
    dateFormat  YYYY-MM-DD
    
    section 基盤整備
    API連携の基盤作成           :a1, 2025-10-05, 3d
    認証トークン管理             :a2, after a1, 2d
    
    section コア機能
    投稿一覧表示                :b1, after a2, 5d
    投稿詳細表示                :b2, after b1, 3d
    投票機能                    :b3, after b2, 4d
    投稿作成機能                :b4, after b3, 5d
    
    section ユーザー機能
    マイページ表示              :c1, after b1, 4d
    プロフィール編集            :c2, after c1, 3d
    投稿・投票履歴              :c3, after c2, 3d
    
    section UI/UX
    デザインシステム構築        :d1, after a2, 7d
    レスポンシブ対応            :d2, after d1, 5d
    アニメーション実装          :d3, after d2, 3d
    
    section 追加機能
    検索機能                    :e1, after b4, 3d
    ランキング表示              :e2, after e1, 2d
    ページネーション            :e3, after b1, 3d
```

### Phase 1: API連携基盤 (優先度: 最高)

1. **API通信ライブラリの設定**
   - axiosまたはfetchのラッパー作成
   - 認証トークンのインターセプター設定
   - エラーハンドリングの統一

2. **Firebase認証とバックエンドの連携**
   - Firebase IDトークンをバックエンドに送信
   - バックエンド側でトークン検証
   - ユーザーセッション管理

### Phase 2: コア機能実装 (優先度: 高)

1. **投稿一覧画面**
   - `/api/v1/posts/public/` を使用
   - 無限スクロール（ページネーション）
   - 検索機能
   
2. **投票機能**
   - ワンタップ投票
   - 即座の結果表示
   - 統計情報の可視化

3. **投稿作成画面**
   - 質問と選択肢の入力フォーム
   - バリデーション（2-10個の選択肢）
   - 下書き保存（LocalStorage）

### Phase 3: ユーザー機能 (優先度: 中)

1. **マイページ**
   - プロフィール表示・編集
   - 自分の投稿一覧
   - 自分の投票履歴

### Phase 4: UI/UXの改善 (優先度: 中)

1. **デザインシステムの構築**
   - カラースキーム定義
   - コンポーネントライブラリ構築
   - レスポンシブデザイン対応

2. **ユーザー体験の向上**
   - ローディング表示
   - エラーメッセージの改善
   - アニメーション追加

## 技術的な課題と推奨事項

### 1. 認証フロー

**現状の問題**:
- Firebase認証のみで、バックエンドとの連携が未実装
- Djangoの認証システムとの統合が必要

**推奨解決策**:
```mermaid
sequenceDiagram
    participant F as Frontend
    participant FB as Firebase
    participant BE as Django Backend
    
    F->>FB: Googleでログイン
    FB->>F: IDトークン取得
    F->>BE: IDトークンを送信
    BE->>FB: トークン検証
    FB->>BE: ユーザー情報返却
    BE->>BE: ユーザー作成/取得
    BE->>F: JWTトークン発行
    F->>F: トークン保存
    F->>BE: 以降のリクエストでJWT使用
```

### 2. 状態管理

**推奨**:
- React Context API（小規模な状態管理）
- または Redux/Zustand（大規模になる場合）

**管理すべき状態**:
- ユーザー認証情報
- 投稿データ
- UI状態（モーダル、ローディングなど）

### 3. APIクライアントの実装例

```javascript
// lib/api.js (例)
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

apiClient.interceptors.request.use(async (config) => {
  const auth = getAuth();
  if (auth.currentUser) {
    const token = await auth.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  posts: {
    list: () => apiClient.get('/api/v1/posts/public/'),
    create: (data) => apiClient.post('/api/v1/posts/', data),
    detail: (id) => apiClient.get(`/api/v1/posts/${id}/`),
    vote: (id, optionNum) => apiClient.post(`/api/v1/posts/${id}/polls/`, {
      option: { select_num: optionNum }
    }),
  },
  users: {
    mypage: (username) => apiClient.get(`/api/v1/users/${username}/`),
    updateProfile: (username, data) => apiClient.patch(`/api/v1/users/${username}/`, data),
  }
};
```

## 元々のVue.js実装について

### Vue.js時代の特徴（README.mdより）

元々は以下の技術スタックで実装されていました:

- **フロントエンド**: Vue.js 2.6.11 + Vue CLI 4.1.2
- **特徴**:
  - SPA (Single Page Application)
  - Vue.js × Django REST Framework
  - S3 + CloudFront で配信
  - マテリアルデザイン
  - レスポンシブデザイン対応

### Vue.jsで実装されていた機能

以下の機能がVue.jsで実装されていましたが、現在のReactアプリでは**未実装**です:

1. **投稿一覧画面**
   - 非同期ページネーション
   - Pull to Refresh
   - 投票機能（ワンタップ）
   - 結果のソート/更新
   - 検索機能
   - ランキング機能

2. **投稿画面**
   - バリデーション
   - 下書き保存（LocalStorage）
   - スライド削除機能

3. **マイページ**
   - プロフィール表示・編集
   - 投稿一覧表示
   - 投票した投稿一覧

**これらの機能を参考にしながら、Reactで再実装する必要があります。**

## まとめ

### 進捗率
- **環境構築**: ✅ 100%
- **認証機能**: ✅ 80% (Firebase実装済み、バックエンド連携が未実装)
- **コア機能**: ❌ 5% (ページ構造のみ)
- **UI/UX**: ❌ 10% (TailwindCSSの設定のみ)

### 総合進捗: 約15%

### 推定作業時間
- **Phase 1 (API連携基盤)**: 3-5日
- **Phase 2 (コア機能)**: 10-15日
- **Phase 3 (ユーザー機能)**: 5-7日
- **Phase 4 (UI/UX)**: 7-10日

**合計**: 約25-37日（1人での作業を想定）

## 参考リンク

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [TailwindCSS](https://tailwindcss.com/)

---

**最終更新日**: 2025-10-05  
**作成者**: Background Agent
