# Shappar アーキテクチャ図集

このドキュメントには、Shapparプロジェクトの各種アーキテクチャ図が含まれています。

## 1. システム全体のアーキテクチャ

```mermaid
C4Context
    title システムコンテキスト図

    Person(user, "ユーザー", "Shapparを使う人")
    
    System_Boundary(shappar, "Shappar System") {
        System(frontend, "React Frontend", "Next.js, Firebase Auth")
        System(django, "Django Backend", "REST API, PostgreSQL")
        System(goserver, "Go Server", "追加API, MySQL")
    }
    
    System_Ext(firebase, "Firebase", "認証サービス")
    System_Ext(google, "Google OAuth", "ログイン認証")
    
    Rel(user, frontend, "使用する", "HTTPS")
    Rel(frontend, firebase, "認証", "Firebase SDK")
    Rel(firebase, google, "OAuth", "HTTPS")
    Rel(frontend, django, "API呼び出し", "REST/HTTPS")
    Rel(frontend, goserver, "API呼び出し", "REST/HTTPS")
```

## 2. 現在のフロントエンド構成

```mermaid
graph TB
    subgraph "ブラウザ"
        A[React Application]
        A --> A1[Next.js Router]
        A --> A2[React Components]
        A --> A3[Firebase SDK]
        A --> A4[TailwindCSS]
    end
    
    subgraph "実装済みページ"
        P1[index.js<br/>ホームページ<br/>★基本構造のみ]
        P2[login.js<br/>ログインページ<br/>★Firebase認証実装済み]
        P3[_app.js<br/>アプリルート]
    end
    
    subgraph "未実装ページ"
        U1[投稿一覧ページ]
        U2[投稿詳細ページ]
        U3[投稿作成ページ]
        U4[マイページ]
        U5[プロフィール編集ページ]
    end
    
    A1 --> P1
    A1 --> P2
    A1 --> P3
    A1 -.未実装.-> U1
    A1 -.未実装.-> U2
    A1 -.未実装.-> U3
    A1 -.未実装.-> U4
    A1 -.未実装.-> U5
    
    style P1 fill:#90EE90
    style P2 fill:#90EE90
    style P3 fill:#90EE90
    style U1 fill:#FFB6C1
    style U2 fill:#FFB6C1
    style U3 fill:#FFB6C1
    style U4 fill:#FFB6C1
    style U5 fill:#FFB6C1
```

## 3. 認証フロー詳細

```mermaid
sequenceDiagram
    autonumber
    participant U as ユーザー
    participant F as React Frontend
    participant FB as Firebase Auth
    participant G as Google OAuth
    participant D as Django Backend
    participant DB as PostgreSQL
    
    Note over U,DB: ログインフロー（現在実装済み）
    U->>F: /loginにアクセス
    F->>U: ログインページ表示
    U->>F: 「Googleでログイン」クリック
    F->>FB: signInWithPopup()
    FB->>G: OAuth認証リクエスト
    G->>U: Googleログイン画面表示
    U->>G: 認証情報入力
    G->>FB: 認証成功、トークン返却
    FB->>F: ユーザー情報 + IDトークン
    F->>U: alert('ログインok!')
    
    Note over U,DB: 今後実装すべきフロー
    F->>D: IDトークンを送信<br/>POST /api/v1/auth/
    D->>FB: トークン検証
    FB->>D: ユーザー情報返却
    D->>DB: ユーザー作成/取得
    DB->>D: ユーザーデータ
    D->>F: JWTトークン発行
    F->>F: トークンをLocalStorageに保存
    
    Note over U,DB: 以降のAPI呼び出し
    U->>F: 投稿一覧を見る
    F->>D: GET /api/v1/posts/public/<br/>Authorization: Bearer {JWT}
    D->>D: JWT検証
    D->>DB: データ取得
    DB->>D: 投稿データ
    D->>F: JSON Response
    F->>U: 投稿一覧表示
```

## 4. データフロー図

```mermaid
graph LR
    subgraph "Frontend State"
        S1[User State<br/>認証情報]
        S2[Posts State<br/>投稿データ]
        S3[UI State<br/>ローディング等]
    end
    
    subgraph "API Layer"
        API[API Client<br/>axios/fetch]
    end
    
    subgraph "Backend"
        BE1[Django REST API]
        BE2[Go Server API]
    end
    
    subgraph "Database"
        DB1[(PostgreSQL)]
        DB2[(MySQL)]
    end
    
    S1 --> API
    S2 --> API
    API --> BE1
    API --> BE2
    BE1 --> DB1
    BE2 --> DB2
    
    DB1 -.data.-> BE1
    BE1 -.response.-> API
    API -.update.-> S2
```

## 5. コンポーネント構成（提案）

```mermaid
graph TD
    subgraph "Pages"
        Page1[pages/index.js]
        Page2[pages/login.js]
        Page3[pages/posts/index.js<br/>未実装]
        Page4[pages/posts/create.js<br/>未実装]
        Page5[pages/posts/[id].js<br/>未実装]
        Page6[pages/mypage/[username].js<br/>未実装]
    end
    
    subgraph "Layout Components"
        L1[Layout]
        L2[Header]
        L3[Footer]
        L4[Sidebar]
    end
    
    subgraph "Feature Components"
        C1[PostList<br/>投稿一覧]
        C2[PostCard<br/>投稿カード]
        C3[PostDetail<br/>投稿詳細]
        C4[VoteButton<br/>投票ボタン]
        C5[VoteResults<br/>投票結果]
        C6[CreatePostForm<br/>投稿作成フォーム]
        C7[UserProfile<br/>ユーザープロフィール]
    end
    
    subgraph "Common Components"
        U1[Button]
        U2[Input]
        U3[Modal]
        U4[Loading]
        U5[ErrorMessage]
    end
    
    Page1 --> L1
    Page2 --> L1
    Page3 --> L1
    Page4 --> L1
    Page5 --> L1
    Page6 --> L1
    
    L1 --> L2
    L1 --> L3
    L1 --> L4
    
    Page3 --> C1
    C1 --> C2
    Page5 --> C3
    Page5 --> C5
    C2 --> C4
    C3 --> C4
    Page4 --> C6
    Page6 --> C7
    
    C1 --> U1
    C2 --> U1
    C6 --> U2
    C3 --> U3
    C1 --> U4
    Page3 --> U5
    
    style Page1 fill:#90EE90
    style Page2 fill:#90EE90
    style Page3 fill:#FFB6C1
    style Page4 fill:#FFB6C1
    style Page5 fill:#FFB6C1
    style Page6 fill:#FFB6C1
```

## 6. バックエンドAPI構造

```mermaid
graph TB
    subgraph "Django REST Framework API"
        subgraph "User Endpoints"
            U1[GET /api/v1/users/:pk/<br/>マイページ取得]
            U2[PUT/PATCH /api/v1/users/:pk/<br/>マイページ更新]
            U3[GET /api/v1/users/:pk/posted/<br/>投稿一覧]
            U4[GET /api/v1/users/:pk/voted/<br/>投票一覧]
        end
        
        subgraph "Post Endpoints"
            P1[POST /api/v1/posts/<br/>投稿作成]
            P2[GET /api/v1/posts/public/<br/>公開投稿一覧]
            P3[GET /api/v1/posts/public/rank/<br/>ランキング]
            P4[GET /api/v1/posts/:pk/<br/>投稿詳細・統計]
            P5[DELETE /api/v1/posts/:pk/<br/>投稿削除]
            P6[GET /api/v1/posts/public/:pk/<br/>投票結果取得]
        end
        
        subgraph "Poll Endpoints"
            PO1[POST /api/v1/posts/:pk/polls/<br/>投票実行]
        end
        
        subgraph "Auth Endpoints"
            A1[POST /api/v1/auth/jwt/create/<br/>JWT取得]
            A2[POST /api/v1/auth/jwt/refresh/<br/>JWT更新]
        end
    end
    
    subgraph "Models"
        M1[(User<br/>ユーザー)]
        M2[(Post<br/>投稿)]
        M3[(Option<br/>選択肢)]
        M4[(Poll<br/>投票)]
    end
    
    U1 --> M1
    U2 --> M1
    U3 --> M2
    U4 --> M4
    
    P1 --> M2
    P1 --> M3
    P2 --> M2
    P3 --> M2
    P4 --> M2
    P4 --> M1
    P5 --> M2
    P6 --> M2
    
    PO1 --> M4
    PO1 --> M2
    PO1 --> M3
```

## 7. 実装優先度マトリックス

```mermaid
quadrantChart
    title 機能の優先度マトリックス
    x-axis 実装難易度低 --> 実装難易度高
    y-axis ユーザー価値低 --> ユーザー価値高
    
    quadrant-1 後で実装
    quadrant-2 最優先で実装
    quadrant-3 実装不要
    quadrant-4 次に実装
    
    投稿一覧表示: [0.3, 0.9]
    投票機能: [0.4, 0.95]
    投稿作成: [0.6, 0.85]
    マイページ表示: [0.35, 0.7]
    プロフィール編集: [0.5, 0.6]
    検索機能: [0.6, 0.75]
    ランキング表示: [0.4, 0.65]
    統計情報可視化: [0.75, 0.7]
    アニメーション: [0.7, 0.3]
    Pull to Refresh: [0.8, 0.5]
    投稿削除: [0.2, 0.4]
```

## 8. 技術スタック比較（Vue.js → React）

```mermaid
graph LR
    subgraph "旧実装 (Vue.js)"
        V1[Vue.js 2.6.11]
        V2[Vue CLI 4.1.2]
        V3[Vuex<br/>状態管理]
        V4[Vue Router]
        V5[Sass/SCSS]
    end
    
    subgraph "新実装 (React)"
        R1[React 18.2.0]
        R2[Next.js latest]
        R3[Context API<br/>状態管理候補]
        R4[Next Router<br/>ファイルベース]
        R5[TailwindCSS]
    end
    
    subgraph "共通"
        C1[Django REST API]
        C2[Firebase Auth]
        C3[PostgreSQL]
        C4[Docker]
    end
    
    V1 -.移行.-> R1
    V2 -.移行.-> R2
    V3 -.移行.-> R3
    V4 -.移行.-> R4
    V5 -.移行.-> R5
    
    R1 --> C1
    R2 --> C2
    V1 --> C1
    
    style V1 fill:#42b883
    style V2 fill:#42b883
    style V3 fill:#42b883
    style V4 fill:#42b883
    style V5 fill:#42b883
    style R1 fill:#61dafb
    style R2 fill:#000000,color:#fff
    style R3 fill:#61dafb
    style R4 fill:#000000,color:#fff
    style R5 fill:#06b6d4
```

## 9. デプロイメントアーキテクチャ

```mermaid
graph TB
    subgraph "Development"
        D1[localhost:3000<br/>React Dev Server]
        D2[localhost:8000<br/>Django Server]
        D3[localhost:8040<br/>Go Server]
    end
    
    subgraph "Docker Compose"
        DC1[react-front<br/>未定義]
        DC2[shappar-back<br/>Django]
        DC3[shappar-go-server<br/>Go]
        DC4[db<br/>PostgreSQL]
        DC5[shappar-mysql<br/>MySQL]
        DC6[nginx]
    end
    
    subgraph "Production (将来)"
        P1[Vercel / CloudFront<br/>React Frontend]
        P2[ECS<br/>Django API]
        P3[ECS<br/>Go Server]
        P4[RDS PostgreSQL]
        P5[RDS MySQL]
        P6[ALB]
    end
    
    D1 -.開発中.-> DC1
    DC2 --> DC4
    DC3 --> DC5
    DC6 --> DC2
    
    style DC1 fill:#FFB6C1
    style DC2 fill:#90EE90
    style DC3 fill:#90EE90
    style DC4 fill:#90EE90
    style DC5 fill:#90EE90
    style DC6 fill:#90EE90
```

## 10. 開発フロー詳細

```mermaid
stateDiagram-v2
    [*] --> Vue実装完了
    Vue実装完了 --> Vue削除: Vue.jsの廃止決定
    Vue削除 --> Next環境構築: React移行開始
    Next環境構築 --> Firebase実装: 認証機能の実装
    Firebase実装 --> 基本ページ作成: ページ構造作成
    基本ページ作成 --> 現在地: 2025-10-05
    
    現在地 --> API連携: Phase 1
    API連携 --> 投稿一覧: Phase 2-1
    投稿一覧 --> 投票機能: Phase 2-2
    投票機能 --> 投稿作成: Phase 2-3
    投稿作成 --> マイページ: Phase 3
    マイページ --> UIデザイン: Phase 4
    UIデザイン --> テスト: Phase 5
    テスト --> [*]: リリース
    
    note right of 現在地
        ここまで完了
        進捗: 約15%
    end note
    
    note right of API連携
        最優先タスク
        推定: 3-5日
    end note
```

## 11. データベースER図（簡易版）

```mermaid
erDiagram
    USER ||--o{ POST : creates
    USER ||--o{ POLL : votes
    POST ||--o{ OPTION : has
    POST ||--o{ POLL : receives
    OPTION ||--o{ POLL : selected_by
    
    USER {
        int id PK
        string username UK
        string email
        string usernonamae
        text introduction
        image iconimage
        image homeimage
        int age
        string sex
        string blood_type
        date born_at
    }
    
    POST {
        int id PK
        int user_id FK
        text question
        int total
        uuid share_id
        datetime created_at
    }
    
    OPTION {
        int id PK
        int select_num
        text answer
        int votes
        uuid share_id FK
    }
    
    POLL {
        int id PK
        int user_id FK
        int post_id FK
        int option_id FK
        datetime created_at
    }
```

## 12. 実装チェックリスト

```mermaid
mindmap
  root((実装状況))
    環境構築
      ::icon(fa fa-check)
      Next.js setup
      TailwindCSS
      TypeScript
      Docker設定
    認証
      Firebase Auth ✓
      バックエンド連携 ✗
      トークン管理 ✗
      ログアウト ✓
    ページ
      ホーム ◐
      ログイン ✓
      投稿一覧 ✗
      投稿詳細 ✗
      投稿作成 ✗
      マイページ ✗
    機能
      投票 ✗
      投稿 ✗
      検索 ✗
      ランキング ✗
    UI/UX
      デザインシステム ✗
      レスポンシブ ✗
      アニメーション ✗
      ローディング ✗
```

凡例:
- ✓ : 完了
- ◐ : 部分的に完了
- ✗ : 未実装

---

**最終更新日**: 2025-10-05  
**作成者**: Background Agent
