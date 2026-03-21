# バックエンド現状メモ

最終確認日: 2026-03-22

## 結論

- リポジトリ内の起動設定を見る限り、現行の主系バックエンドはまだ Django です。
- Go への書き換えは `go-server/` 配下で着手済みですが、現時点で HTTP として実装されているのは `/api/v1/health` だけです。
- Go 側で進んでいるのは、Swagger からの API 骨組み生成、health check、Firebase トークン検証、Firebase user 永続化用の MySQL/PlanetScale 周辺です。
- つまり現在地は「Django の本体は残っている」「Go は土台作成と一部周辺実装まで進んだが、機能移植は未完了」と整理するのが妥当です。

注記:
この「現行」の判断は、このリポジトリにある起動設定・コード配線からの推定です。実運用が別リポジトリや別 IaC で切り替わっているかどうかまでは、この repo だけでは断定できません。

## どこに何があるか

| パス | 役割 | 現状 |
| --- | --- | --- |
| `manage.py` / `Dockerfile` / `Makefile` | Django バックエンドの起動入口 | 今も root 側の標準起動線 |
| `docker-compose.yml` | ローカル構成 | Django + PostgreSQL + nginx と、別系統の `go-server` + MySQL を同居 |
| `config/` / `accounts/` / `apiv1/` | Django アプリ本体 | 投稿・投票・マイページ・JWT 認証まで実装済み |
| `apiv1/tests/` | Django API テスト | `test_views.py` と `test_serializers.py` が厚い |
| `Swagger/swagger_api_v1.yml` | Go 側の API 仕様 | Django 系 API をベースにした移行先仕様 |
| `go-server/internal/ui/gen/` | go-swagger 生成コード | API の型・routing 骨組みのみ |
| `go-server/internal/ui/server.go` | Go の手書き UI 配線 | `health` handler のみ登録 |
| `go-server/internal/domain/firebaseuser` | Go のドメイン層 | Firebase user 関連のみ存在 |
| `go-server/internal/infrastructure/...` | Go のインフラ層 | Firebase / PlanetScale / SQLC / migration を一部実装 |
| `go-server/internal/usecase` / `go-server/internal/di` | Go のユースケース / DI | まだ空 (`.gitkeep` のみ) |

## Django 側で確認できたこと

### 起動と構成

- root の `Dockerfile` は Python ベースで Django を起動する前提です。
- root の `Makefile` も `runserver`、`migrate`、`test` など Django 用コマンドだけを提供しています。
- `docker-compose.yml` には `shappar-back`、`db`、`nginx` があり、`shappar-back` は `manage.py migrate` の後に `runserver` を起動します。
- DB は Django 側が PostgreSQL、Go 側が MySQL で、同じストレージを共有する構成にはなっていません。

### 実装済みの API / モデル

- `config/urls.py` で `/api/v1/` を Django 側に接続しています。
- `apiv1/urls.py` では以下を公開しています。
  - ユーザー詳細 / 更新
  - 自分の投稿一覧 / 投票一覧
  - 投稿作成
  - 投稿一覧
  - ランキング一覧
  - 投稿詳細 / 削除
  - 投票作成
  - Djoser / JWT 認証
- `accounts/models.py` には拡張ユーザー `CustomUser` があります。
- `apiv1/models.py` には `Post`、`Option`、`Poll` があり、Shappar の主要投票機能は Django モデルとして成立しています。
- `config/settings/local.py` と `config/settings/product.py` では Django REST Framework + Djoser + SimpleJWT を使う構成になっています。

### テストの厚み

- Django 側は `apiv1/tests/test_views.py` が 1589 行、`apiv1/tests/test_serializers.py` が 491 行あり、API と serializer のテストがかなりあります。
- これは「古いが実機能がまとまっている本体」は Django 側であることの強い根拠です。

## Go 側で確認できたこと

### 進んでいる部分

- `go-server/cmd/go-server/main.go` から Go サーバーを単独起動できます。
- `Swagger/swagger_api_v1.yml` には以下の API が定義されています。
  - posts
  - users
  - friendships
  - health
- `go-server/internal/ui/gen/` には go-swagger 生成コードがあり、API の型や router は一通り出力されています。
- `go-server/internal/ui/server.go` では `AdministrationsGetAPIV1HealthHandler` だけを hand-written で登録しています。
- `go-server/internal/domain/firebaseuser` と `go-server/internal/infrastructure/firebaseuserinfrastructure` には、Firebase ID token 検証と Firebase user 永続化のためのドメイン / repository 実装があります。
- `go-server/internal/infrastructure/migration/schema/` には `firebase_user` と `firebase_token_verify` の migration があります。
- `go-server/Makefile` には `run`、`test`、`migrate-up`、`sqlc-gen` など、開発基盤用のコマンドがそろっています。

### まだ未完了の部分

- `go-server/internal/ui/gen/restapiv1/operations/shappar_api.go` では、health 以外の handler がすべて `middleware.NotImplemented(...)` の初期値です。
- `go-server/internal/ui/server.go` でも、実際に override しているのは health check だけです。
- `go-server/internal/usecase` と `go-server/internal/di` は空で、UI から usecase / repository までの本配線がまだありません。
- `go-server/internal/infrastructure/migration/` にあるテーブルは Firebase user 系だけで、Django 側の `Post` / `Option` / `Poll` に対応する移行先スキーマは確認できませんでした。
- Go 側テストは health check と Firebase user repository 周辺が中心で、posts / users / friendships の業務 API テストはありません。
- 2026-03-22 時点では `GOTOOLCHAIN=auto go test ./...` も `google.golang.org/api/transport/grpc` のビルドエラーで失敗しており、Go 側は「機能移植途中」に加えて「全体テストも未健全」です。

## Django と Go の対応差分

| 観点 | Django | Go |
| --- | --- | --- |
| HTTP 入口 | 実際に `manage.py` と compose から起動 | 単独起動はできる |
| 主要 API | 実装済み | Swagger 定義はあるが未配線が大半 |
| 投稿 / 投票機能 | 実装済み | 未実装 |
| 認証 | Djoser + SimpleJWT | Firebase token 周辺のみ一部実装 |
| 永続化 | PostgreSQL 前提 | MySQL / PlanetScale 前提 |
| テスト | API / serializer が厚い | health + Firebase user 周辺のみ |
| 移行完了度 | 現行本体 | 骨組み + 周辺部品の段階 |

## 履歴から見える流れ

- 2021-09: Django 側の主要更新が入っている。
- 2022-11: `go-server/` の開発環境、ディレクトリ、server 骨組みの追加が始まる。
- 2022-12 から 2023-01: Swagger 生成、health check、Docker / migration / SQLC 整備が進む。
- 2023-02: Firebase user の domain / repository / persistence 実装まで進む。
- 2026-03: `go-server` には依存更新コミットがあるが、機能追加ではない。

この流れから、Go 化は 2022-11 から 2023-02 に集中的に進められ、その後は大きく前進していない可能性が高いです。

## 現在地の判定

現時点の整理:

1. 既存サービス本体は Django 側に残っている。
2. Go 側は「全面移行後の本番 backend」ではなく、「新 backend の土台と一部認証 / 永続化基盤を作った段階」。
3. 特に未完了なのは、posts / polls / users / friendships の handler 実装、usecase / DI 配線、Django データモデルとの移行戦略です。
4. そのため、repo から見える現在地は「Go に書き換え中だったが、機能移植は途中で止まっている」に近いです。

## フロー図

```mermaid
flowchart LR
    Client["Client / Browser"] --> Nginx["nginx\n`docker-compose.yml`"]
    Nginx --> Django["Django backend\n`manage.py` / `shappar-back`"]
    Django --> Postgres["PostgreSQL\n`db` service"]
    Django --> Auth["Djoser + SimpleJWT"]
    Django --> Aws["S3 / SES 連携"]

    subgraph GoRewrite["Go rewrite (`go-server/`)"]
        Swagger["Swagger spec\n`Swagger/swagger_api_v1.yml`"]
        Generated["go-swagger generated router\n`internal/ui/gen/`"]
        Health["実装済み\n`/api/v1/health`"]
        NotImpl["未実装\nposts / users / friendships"]
        Usecase["usecase / di\n未着手"]
        Firebase["Firebase token verify"]
        PlanetScale["MySQL / PlanetScale"]

        Swagger --> Generated
        Generated --> Health
        Generated --> NotImpl
        Usecase -. 将来ここを配線する想定 .-> Firebase
        Usecase -. 将来ここを配線する想定 .-> PlanetScale
    end

    Client -. 別導線として試作 .-> Generated
```

## ひとことで言うと

「Django の backend はまだ残っている。Go は health check と Firebase user 周辺の基礎実装まではあるが、主要 API の移植は未完了」です。
