# フロントエンド移行フロー図とダイアグラム

このドキュメントは、Shapparプロジェクトのフロントエンド移行に関する詳細なフロー図とダイアグラムを提供します。

## 目次

1. [移行タイムライン](#移行タイムライン)
2. [機能比較マップ](#機能比較マップ)
3. [コンポーネント構造](#コンポーネント構造)
4. [データフロー](#データフロー)
5. [デプロイメントフロー](#デプロイメントフロー)

---

## 移行タイムライン

### Git履歴から見る移行の流れ

\`\`\`mermaid
gitGraph
    commit id: "Vue 3へのアップグレード開始"
    commit id: "Vue 3.2 + @vue/compat導入"
    commit id: "eslint-plugin-vue設定"
    commit id: "Vuex, Vue Router追加"
    commit id: "Vue廃止されるAPI修正"
    branch react-migration
    checkout react-migration
    commit id: "Firebase追加"
    commit id: "Go Server実装開始"
    commit id: "Firebase認証実装"
    commit id: "React/Next.js導入"
    commit id: "Vue完全削除" type: HIGHLIGHT
    checkout main
    merge react-migration
    commit id: "現在地" type: HIGHLIGHT
\`\`\`

### 移行ステータス詳細

\`\`\`mermaid
gantt
    title フロントエンド移行進捗
    dateFormat YYYY-MM-DD
    section Phase 1: Vue保守
    Vue3アップグレード準備     :done,    des1, 2023-01-01, 30d
    Vue3移行作業           :done,    des2, 2023-02-01, 60d
    
    section Phase 2: React準備
    Firebase導入           :done,    des3, 2023-04-01, 20d
    Go Server構築          :done,    des4, 2023-04-10, 40d
    React/Next.js setup    :done,    des5, 2023-05-01, 15d
    
    section Phase 3: Vue削除
    Vue完全削除            :done,    des6, 2023-05-15, 5d
    
    section Phase 4: React実装（現在）
    認証機能実装           :done,    des7, 2023-05-20, 10d
    基盤整備              :active,  des8, 2023-06-01, 30d
    
    section Phase 5: 機能移植（未来）
    投稿機能              :        des9, after des8, 30d
    投票機能              :        des10, after des9, 20d
    マイページ            :        des11, after des10, 20d
    検索・ランキング       :        des12, after des11, 15d
\`\`\`

---

## 機能比較マップ

### Vue vs React: 実装状況比較

\`\`\`mermaid
mindmap
  root((Shappar機能))
    認証
      ::icon(fa fa-check)
      Vue実装済み
        メール認証
        ソーシャルログイン
      React実装済み
        ✅ Google認証
        ✅ ログイン状態管理
      React未実装
        ❌ メール認証
        ❌ その他SNS認証
    投稿機能
      Vue実装済み
        投稿一覧表示
        投稿作成
        投稿編集
        投稿削除
        下書き保存
        画像アップロード
        ページネーション
        Pull to Refresh
      React未実装
        ❌ 全機能未実装
    投票機能
      Vue実装済み
        ワンタップ投票
        投票結果表示
        結果ソート
        投票者詳細
        グラフ表示
        リアルタイム更新
      React未実装
        ❌ 全機能未実装
    マイページ
      Vue実装済み
        プロフィール表示
        プロフィール編集
        ホーム画像設定
        自分の投稿一覧
        投票履歴
      React未実装
        ❌ 全機能未実装
    その他
      Vue実装済み
        検索機能
        ランキング
        レスポンシブ
      React未実装
        ❌ 全機能未実装
\`\`\`

### 機能実装マトリクス

\`\`\`mermaid
quadrantChart
    title 機能実装の優先度マトリクス
    x-axis 実装難易度低 --> 実装難易度高
    y-axis ビジネス価値低 --> ビジネス価値高
    quadrant-1 後回し
    quadrant-2 優先実装
    quadrant-3 早期実装
    quadrant-4 計画的実装
    
    認証機能: [0.2, 0.9]
    投稿一覧: [0.3, 0.95]
    投票機能: [0.4, 0.95]
    投稿作成: [0.5, 0.85]
    マイページ: [0.5, 0.7]
    検索機能: [0.6, 0.6]
    ランキング: [0.7, 0.5]
    グラフ表示: [0.8, 0.6]
    通知機能: [0.7, 0.4]
    テーマ設定: [0.3, 0.2]
\`\`\`

---

## コンポーネント構造

### 現在のReactコンポーネント構造

\`\`\`mermaid
graph TD
    App["_app.js<br/>アプリケーションルート"]
    
    App --> Home["pages/index.js<br/>ホームページ"]
    App --> Login["pages/login.js<br/>ログインページ"]
    App --> API["pages/api/*<br/>APIルート"]
    
    Login --> FirebaseApp["FirebaseApp.js<br/>Firebase初期化"]
    Login --> Auth["Firebase Auth<br/>認証ロジック"]
    
    Auth --> GoogleLogin["Googleログイン"]
    Auth --> CheckAuth["認証状態確認"]
    Auth --> Logout["ログアウト"]
    
    style App fill:#e1f5ff
    style Home fill:#fff9c4
    style Login fill:#c8e6c9
    style FirebaseApp fill:#ffccbc
    style Auth fill:#f8bbd0
\`\`\`

### 理想的なReactコンポーネント構造（実装予定）

\`\`\`mermaid
graph TD
    App["App Root<br/>_app.tsx"]
    
    App --> Layout["Layout<br/>共通レイアウト"]
    App --> Providers["Providers<br/>Context・状態管理"]
    
    Layout --> Header["Header<br/>ヘッダー"]
    Layout --> Footer["Footer<br/>フッター"]
    Layout --> Sidebar["Sidebar<br/>サイドバー"]
    
    App --> Pages["Pages"]
    Pages --> Home["Home<br/>ホーム"]
    Pages --> PostList["PostList<br/>投稿一覧"]
    Pages --> PostDetail["PostDetail<br/>投稿詳細"]
    Pages --> PostCreate["PostCreate<br/>投稿作成"]
    Pages --> MyPage["MyPage<br/>マイページ"]
    Pages --> Login["Login<br/>ログイン"]
    
    PostList --> PostCard["PostCard<br/>投稿カード"]
    PostList --> Pagination["Pagination<br/>ページネーション"]
    
    PostDetail --> VoteButton["VoteButton<br/>投票ボタン"]
    PostDetail --> VoteResult["VoteResult<br/>投票結果"]
    PostDetail --> Chart["Chart<br/>グラフ"]
    
    PostCreate --> Form["Form<br/>フォーム"]
    PostCreate --> ImageUpload["ImageUpload<br/>画像アップロード"]
    PostCreate --> DraftSave["DraftSave<br/>下書き保存"]
    
    MyPage --> Profile["Profile<br/>プロフィール"]
    MyPage --> UserPosts["UserPosts<br/>ユーザー投稿"]
    MyPage --> VoteHistory["VoteHistory<br/>投票履歴"]
    
    Providers --> AuthProvider["AuthProvider<br/>認証"]
    Providers --> StateProvider["StateProvider<br/>状態管理"]
    Providers --> APIProvider["APIProvider<br/>API通信"]
    
    style App fill:#e1f5ff
    style Layout fill:#fff9c4
    style Pages fill:#c8e6c9
    style Providers fill:#ffccbc
    style PostList fill:#f0f4c3
    style PostDetail fill:#f0f4c3
    style PostCreate fill:#f0f4c3
    style MyPage fill:#f0f4c3
\`\`\`

---

## データフロー

### Vue時代のデータフロー

\`\`\`mermaid
sequenceDiagram
    participant User as ユーザー
    participant Vue as Vue Component
    participant Vuex as Vuex Store
    participant API as Django REST API
    participant DB as PostgreSQL

    User->>Vue: アクション実行
    Vue->>Vuex: action dispatch
    Vuex->>API: HTTP Request
    API->>DB: SQLクエリ
    DB->>API: データ返却
    API->>Vuex: JSON Response
    Vuex->>Vuex: mutation commit
    Vuex->>Vue: state更新
    Vue->>User: UIレンダリング
\`\`\`

### React実装予定のデータフロー

\`\`\`mermaid
sequenceDiagram
    participant User as ユーザー
    participant React as React Component
    participant Hook as Custom Hook
    participant State as Zustand Store
    participant API as API Client
    participant Django as Django API
    participant Go as Go Server API
    participant DB as Database

    User->>React: アクション実行
    React->>Hook: useXXX() call
    Hook->>State: getState/setState
    Hook->>API: fetch request
    
    alt Django API
        API->>Django: REST API call
        Django->>DB: PostgreSQL query
        DB->>Django: データ返却
        Django->>API: JSON Response
    else Go Server API
        API->>Go: gRPC/REST call
        Go->>DB: MySQL query
        DB->>Go: データ返却
        Go->>API: JSON Response
    end
    
    API->>State: update store
    State->>Hook: state変更通知
    Hook->>React: re-render trigger
    React->>User: UIレンダリング
\`\`\`

### 投稿作成フロー（実装予定）

\`\`\`mermaid
flowchart TD
    Start([ユーザーが投稿作成開始])
    
    Start --> Input[投稿内容入力]
    Input --> ValidateLocal{クライアント側<br/>バリデーション}
    
    ValidateLocal -->|NG| ShowError[エラー表示]
    ShowError --> Input
    
    ValidateLocal -->|OK| SaveDraft{下書き保存?}
    SaveDraft -->|Yes| LocalStorage[LocalStorageに保存]
    LocalStorage --> Done1([下書き保存完了])
    
    SaveDraft -->|No| Submit[サーバーに送信]
    Submit --> Auth{認証確認}
    
    Auth -->|未認証| Login[ログイン画面へ]
    Login --> Start
    
    Auth -->|認証済み| APICall[Django API呼び出し]
    APICall --> ValidateServer{サーバー側<br/>バリデーション}
    
    ValidateServer -->|NG| ShowAPIError[APIエラー表示]
    ShowAPIError --> Input
    
    ValidateServer -->|OK| SaveDB[(PostgreSQLに保存)]
    SaveDB --> ClearDraft[下書きクリア]
    ClearDraft --> Redirect[投稿一覧へリダイレクト]
    Redirect --> Done2([投稿作成完了])
    
    style Start fill:#c8e6c9
    style Done1 fill:#c8e6c9
    style Done2 fill:#c8e6c9
    style ShowError fill:#ffcdd2
    style ShowAPIError fill:#ffcdd2
    style SaveDB fill:#bbdefb
\`\`\`

### 投票フロー（実装予定）

\`\`\`mermaid
flowchart TD
    Start([ユーザーが投票ボタンクリック])
    
    Start --> CheckAuth{認証状態確認}
    CheckAuth -->|未認証| ShowLoginModal[ログインモーダル表示]
    ShowLoginModal --> Login[ログイン]
    Login --> CheckAuth
    
    CheckAuth -->|認証済み| CheckVoted{既に投票済み?}
    
    CheckVoted -->|Yes| ShowAlreadyVoted[投票済みメッセージ]
    ShowAlreadyVoted --> ShowResult[結果を表示]
    
    CheckVoted -->|No| OptimisticUpdate[楽観的UI更新]
    OptimisticUpdate --> APICall[Django API呼び出し]
    
    APICall --> ValidateAPI{API検証}
    
    ValidateAPI -->|NG| Rollback[UI更新をロールバック]
    Rollback --> ShowError[エラーメッセージ]
    ShowError --> End1([投票失敗])
    
    ValidateAPI -->|OK| SaveVote[(投票をDB保存)]
    SaveVote --> UpdateCache[キャッシュ更新]
    UpdateCache --> ShowResult
    
    ShowResult --> FetchDetails[投票者詳細取得]
    FetchDetails --> DisplayChart[グラフ表示]
    DisplayChart --> End2([投票完了])
    
    style Start fill:#c8e6c9
    style End1 fill:#ffcdd2
    style End2 fill:#c8e6c9
    style ShowError fill:#ffcdd2
    style SaveVote fill:#bbdefb
    style OptimisticUpdate fill:#fff9c4
\`\`\`

---

## デプロイメントフロー

### Vue時代のCI/CDフロー

\`\`\`mermaid
flowchart LR
    subgraph Developer
        Code[コード変更]
        Push[GitHubにPush]
    end
    
    subgraph CircleCI
        Trigger[CI/CDトリガー]
        Test[テスト実行]
        Build[Vueビルド]
        BuildDocker[Dockerイメージビルド]
    end
    
    subgraph AWS
        ECR[ECR<br/>イメージ保存]
        S3[S3<br/>静的ファイル]
        ECS[ECS<br/>デプロイ]
        CF[CloudFront<br/>配信]
    end
    
    Code --> Push
    Push --> Trigger
    Trigger --> Test
    Test --> Build
    Test --> BuildDocker
    
    Build --> S3
    S3 --> CF
    
    BuildDocker --> ECR
    ECR --> ECS
    
    style Test fill:#fff9c4
    style Build fill:#c8e6c9
    style S3 fill:#bbdefb
    style ECR fill:#bbdefb
    style ECS fill:#bbdefb
\`\`\`

### React実装予定のCI/CDフロー

\`\`\`mermaid
flowchart LR
    subgraph Developer
        Code[コード変更]
        Push[GitHubにPush]
    end
    
    subgraph CI["CI/CD (CircleCI/GitHub Actions)"]
        Trigger[トリガー]
        Lint[Lint・型チェック]
        Test[テスト実行]
        BuildFront[Next.jsビルド]
        BuildBack[Dockerビルド]
    end
    
    subgraph Deployment["デプロイ先（選択肢）"]
        direction TB
        
        subgraph Option1["Option 1: Vercel"]
            VercelDeploy[Vercel Deploy]
            VercelCDN[Edge Network]
        end
        
        subgraph Option2["Option 2: AWS"]
            S3Next[S3 + CloudFront]
            ECS2[ECS/Fargate]
        end
        
        subgraph Option3["Option 3: Docker"]
            DockerHub[Docker Hub]
            Kubernetes[K8s/ECS]
        end
    end
    
    subgraph Backend
        DjangoAPI[Django API<br/>Port 8000]
        GoAPI[Go Server<br/>Port 8040]
    end
    
    Code --> Push
    Push --> Trigger
    Trigger --> Lint
    Lint --> Test
    Test --> BuildFront
    Test --> BuildBack
    
    BuildFront -.Option 1.-> VercelDeploy
    VercelDeploy --> VercelCDN
    
    BuildFront -.Option 2.-> S3Next
    
    BuildFront -.Option 3.-> DockerHub
    DockerHub --> Kubernetes
    
    BuildBack --> DjangoAPI
    BuildBack --> GoAPI
    
    VercelCDN -.-> DjangoAPI
    VercelCDN -.-> GoAPI
    S3Next -.-> DjangoAPI
    S3Next -.-> GoAPI
    
    style Lint fill:#fff9c4
    style Test fill:#fff9c4
    style BuildFront fill:#c8e6c9
    style VercelDeploy fill:#bbdefb
    style S3Next fill:#bbdefb
\`\`\`

### ローカル開発環境

\`\`\`mermaid
graph TB
    subgraph "開発者のマシン"
        Browser[ブラウザ<br/>localhost:3000]
        
        subgraph "Docker Compose"
            Next[Next.js Dev Server<br/>Port: 3000]
            Django[Django Server<br/>Port: 8000]
            Go[Go Server<br/>Port: 8040]
            Nginx[Nginx<br/>Port: 80]
            Postgres[(PostgreSQL<br/>Port: 5432)]
            MySQL[(MySQL<br/>Port: 3306)]
        end
    end
    
    subgraph "外部サービス"
        Firebase[Firebase<br/>Authentication]
    end
    
    Browser --> Next
    Next --> Firebase
    Next --> Django
    Next --> Go
    
    Nginx --> Django
    Django --> Postgres
    Go --> MySQL
    
    style Browser fill:#e1f5ff
    style Next fill:#c8e6c9
    style Django fill:#fff9c4
    style Go fill:#b2dfdb
    style Firebase fill:#ffccbc
\`\`\`

---

## 状態管理フロー

### 推奨状態管理アーキテクチャ（Zustand使用）

\`\`\`mermaid
graph TB
    subgraph "React Components"
        CompA[Component A]
        CompB[Component B]
        CompC[Component C]
    end
    
    subgraph "Zustand Stores"
        AuthStore[Auth Store<br/>ユーザー認証状態]
        PostStore[Post Store<br/>投稿データ]
        VoteStore[Vote Store<br/>投票データ]
        UIStore[UI Store<br/>UI状態]
    end
    
    subgraph "Services"
        AuthService[Auth Service<br/>Firebase]
        APIService[API Service<br/>Django/Go]
    end
    
    subgraph "Persistence"
        LocalStorage[LocalStorage<br/>下書き・設定]
        Cache[Cache<br/>API結果]
    end
    
    CompA --> AuthStore
    CompB --> PostStore
    CompB --> VoteStore
    CompC --> UIStore
    
    AuthStore --> AuthService
    PostStore --> APIService
    VoteStore --> APIService
    
    PostStore --> Cache
    UIStore --> LocalStorage
    
    AuthService -.認証トークン.-> APIService
    
    style AuthStore fill:#ffccbc
    style PostStore fill:#c8e6c9
    style VoteStore fill:#b2dfdb
    style UIStore fill:#fff9c4
    style Cache fill:#e1f5ff
\`\`\`

### 認証状態のライフサイクル

\`\`\`mermaid
stateDiagram-v2
    [*] --> Initial: アプリ起動
    
    Initial --> Checking: Firebase初期化
    
    Checking --> Authenticated: トークン有効
    Checking --> Unauthenticated: トークン無効/なし
    
    Unauthenticated --> Authenticating: ログイン開始
    
    Authenticating --> Authenticated: ログイン成功
    Authenticating --> AuthError: ログイン失敗
    
    AuthError --> Unauthenticated: エラー処理
    
    Authenticated --> RefreshingToken: トークン期限切れ近い
    RefreshingToken --> Authenticated: リフレッシュ成功
    RefreshingToken --> Unauthenticated: リフレッシュ失敗
    
    Authenticated --> Unauthenticated: ログアウト
    
    Authenticated --> [*]: アプリ終了
    Unauthenticated --> [*]: アプリ終了
    
    note right of Authenticated
        ユーザー情報を
        グローバルステートに保存
        API呼び出し時に
        トークンを付与
    end note
    
    note right of Unauthenticated
        保護されたページへの
        アクセスをブロック
        ログインページへ
        リダイレクト
    end note
\`\`\`

---

## API統合パターン

### マルチバックエンドとの通信パターン

\`\`\`mermaid
graph TB
    subgraph "Frontend (Next.js)"
        Pages[Pages/Components]
        Hooks[Custom Hooks]
        APIClient[API Client Layer]
    end
    
    subgraph "API Router"
        Router{API Router<br/>エンドポイント振り分け}
    end
    
    subgraph "Django Backend"
        DjangoAuth[認証API]
        DjangoPost[投稿API]
        DjangoVote[投票API]
        DjangoUser[ユーザーAPI]
    end
    
    subgraph "Go Server Backend"
        GoFirebaseUser[Firebaseユーザー管理]
        GoFirebaseAuth[トークン検証]
    end
    
    subgraph "External Services"
        Firebase[Firebase Auth]
    end
    
    Pages --> Hooks
    Hooks --> APIClient
    
    APIClient --> Router
    
    Router -->|/api/auth/*| DjangoAuth
    Router -->|/api/posts/*| DjangoPost
    Router -->|/api/votes/*| DjangoVote
    Router -->|/api/users/*| DjangoUser
    
    Router -->|/go-api/firebase-users/*| GoFirebaseUser
    Router -->|/go-api/verify/*| GoFirebaseAuth
    
    Pages --> Firebase
    GoFirebaseAuth --> Firebase
    
    style APIClient fill:#fff9c4
    style Router fill:#ffccbc
    style Firebase fill:#e1f5ff
\`\`\`

---

このドキュメントは、フロントエンドの移行状況を視覚的に理解するための補足資料です。
詳細な実装状況については `frontend-migration-status.md` を参照してください。
