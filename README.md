# Shappar(しゃぱー)
## 概要
### 気軽に**投票**を【**取れる**】【**見れる**】【**できる**】アプリです。
**《操作が分かりやすい》**
1. 質問を簡単に投稿
2. ワンタップで気軽に投票
3. 結果の情報が多いので次も投票したくなる！

## 使用例
### とある日のAさん
    Aさん(主婦さん)：今日の晩御飯ハンバーグかカレーライスだと家の娘はどっちが喜ぶかな...？(質問を投稿)
    Bさん(10代女性)：ハンバーグ！(回答を投票)
    Cさん(10代女性)：ハンバーグ！(回答を投票)
    Aさん：じゃあハンバーグにしよう！(結果の情報→10代女性が多い)
#### このような意思決定を簡単にできます！気軽に投票を集めてみよう！

## 実装した機能
### SPA(シングルページアプリケーション)
- Vue.js × Django REST FrameworkによるREST APIで実装
- VueCLIによりビルドした静的ファイルをS3にデプロイ、CloudFrontにて配信
- DjangoをAPIサーバーとして使用

### 投稿一覧画面
- ページネーション機能
    - 一番下の投稿の投稿IDをクエリパラメータとしてGETリクエストすることにより実装
    - スクロール途中でリクエストすることによりスムーズな読み込みを実現
- 投稿一覧表示機能
    - シンプルな色使いで長期間使用も可能
    - アイコン画像を表示する→投稿(質問)したユーザーの質問意図の情報量を増加
    - **投稿(質問)したユーザー**か**投票したユーザー**にしか結果は見れない→投票する意欲を増加
    - 投票合計数のみ全てのユーザーに表示する→投票結果が多い場合に投票する意欲を増加
- 投票機能
    - **ワンタップ**で投票可能→煩わしい操作は不要
    - 投票した瞬間結果が見れる→結果をすぐに表示することで次の投票も期待

## 使用技術
### バックエンド
- Python: 3.8.1
- Django: 2.2.10
- Django REST Framework: 3.11.0
### インフラ
- インフラ構成図
![Shappar Diagram](https://user-images.githubusercontent.com/50178851/77857026-3880ff80-7236-11ea-937c-ca12f681582d.png)

- AWS
  - **ECS** / ECR / ALB / RDS / S3 / CroudFront / Route53 / ACM / VPC / EC2
- Docker
  - Docker: 19.03.8
    - ボリュームによるコンテナ間のデータ共有
  - docker-compose: 1.16.1
    - ローカル環境構築
- CircleCI
  - 自動テスト
    - masterブランチ以外へのブランチへマージすることでテスト開始
  - 自動デプロイ
    - masterブランチへのマージによりECR/ECSへデプロイ
    - Orbsを用いたデプロイ
- Nginx(Webサーバー)
  - ロードバランサーとしての負荷分散
  - ヘルスチェッククリア
- Gunicorn(アプリケーションサーバー)
### その他ツール
- タスク管理
  - GitHub Projects
- API仕様書
  - OpenAPI(Swaggar)
