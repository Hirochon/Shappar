# Shappar(しゃぱー)
気軽に**投票**を**取れる**・**見れる**・**できる**アプリ。その名は**Shappar(しゃぱー)**。

## 概要
### とある日のAさん
    Aさん：今日の晩御飯ハンバーグかカレーライスかどっちにしよう...！？
    Bさん：ハンバーグ！
    Cさん：ハンバーグ！
    Aさん：じゃあハンバーグにしよう！
#### こんな意思決定を簡単にできます！気軽に投票を集めてみよう！

## 使用技術
### バックエンド
- Python: 3.8.1
- Django: 2.2.10
- Django REST Framework: 3.11.0
### インフラ
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
  - 静的ファイルの配信
  - ロードバランサーとしての負荷分散
- Gunicorn(アプリケーションサーバー)
### その他ツール
- タスク管理
  - GitHub Projects
- API仕様書
  - OpenAPI(Swaggar)
