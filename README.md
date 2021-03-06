# Shappar(しゃぱー)
## URL
**料金がかかるため現在は稼働しておりません。**

## イメージ図
![Screenshot from 2020-05-23 17-29-29](https://user-images.githubusercontent.com/50178851/82725865-01513b00-9d1b-11ea-896b-a093b0a534da.png)

## 概要
### 気軽に**投票**を【**取れる**】【**見れる**】【**できる**】アプリです。
**《操作が分かりやすい》**
1. 質問を簡単操作で投稿
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

### URI設計
- エンドポイントは直感的に分かりやすいように設計しました。

### デザイン
- Hirochonとfujiya228とで議論の上で決定
- マテリアルデザインを参考
- メインカラーとサブカラーを決定することでアプリの独自性を記憶してもらう
- レスポンシブデザインに対応

### 投稿一覧画面
- デザイン
    - ボタンをアイコン中心に作成→ユーザーに投稿(質問や回答の内容)の文字に集中させたい
- 非同期のページネーション機能
    - 一番下の投稿の投稿IDをクエリパラメータとしてGETリクエストすることにより実装
    - **スクロールしているページの途中でリクエスト**することによりスムーズな読み込みを実現
- PullToRefresh機能
    - スクロールしていない状態（画面一番上）で画面を下に引っ張ることで更新を実現
- 投稿一覧表示機能
    - シンプルな色使いで長期間使用も可能
    - アイコン画像を表示する→投稿(質問)したユーザーの質問意図の情報量を増加
    - **投稿(質問)したユーザー**か**投票したユーザー**にしか結果は見れない→投票する意欲を増加
    - 投票合計数のみ全てのユーザーに表示する→投票結果が多い場合に投票する意欲を増加
- 投票機能
    - **ワンタップ**で投票可能→煩わしい操作は不要
    - 投票した瞬間結果が見れる→結果をすぐに表示することで次の投票も期待
- 投票結果のソート/更新機能
    - 投票の番号順・投票数の多い順・少ない順に対応
    - 投稿ごとに更新を可能に
- 投票したユーザーの詳細情報取得機能
    - 投票したユーザーの情報を可視化
    - 急に【**デザインを明るく**】【**グラフに動きをつける**】ことで、アプリの中で**驚き**を与えたい！
    - こちらも**投稿(質問)したユーザー**か**投票したユーザー**にしか結果は見れない→投票する意欲を増加
- 検索機能
    - クエリパラメータをGETリクエストすることで実装
- 投票数のランキング機能
    - ランキングを作ることでユーザーの投票/投稿意欲を向上
### 投稿画面
- ユーザー目線のバリデーション
    - 文字制限がわかるように常に表示
    - 回答の選択肢に何も記入していなくても投稿可能(記入していない箇所は自動削除)
    - タップできなくするを採用(ワンタップ動作が必要なポップアップはできるだけ使わない)
- 下書き保存機能
    - ローカルストレージに保存することで実装
- スライド削除機能
    - スライドで回答選択肢を削除できることによりスマホユーザーの操作性向上
### マイページ画面
- 鉄板のマイページ機能
    - ホーム画像や自己紹介欄
    - ユーザーの設定画面にはアップロード画像の見本が見れる
- 投稿一覧表示機能
    - 訪れたマイページのユーザーが投稿(質問)した投稿の一覧を表示
- 投票した投稿一覧表示
    - 訪れたマイページが自分自身のマイページだった時は、自分が投票した投稿の一覧を表示
### テスト
- バックエンド
    - ビュー: エンドポイントへのテストはほとんど網羅。エラーハンドリングテストも。
    - シリアライザ
- フロントエンド
## 使用技術
### フロントエンド
- Vue.js: 2.6.11
- Vue CLI: 4.1.2
- Storybook
- Sass(scss)
- HTML/CSS
### バックエンド
- Python: 3.8.1
- Django: 2.2.10
- Django REST Framework: 3.11.0
### インフラ
- インフラ構成図
![Shappar Diagram](https://user-images.githubusercontent.com/50178851/77857026-3880ff80-7236-11ea-937c-ca12f681582d.png)

- AWS
  - **ECS** / ECR / ALB / EC2 / VPC / RDS(PostgreSQL) / S3 / CroudFront / Route53 / ACM / SES / CloudWatch
    - ECSのデプロイメントタイプでローリングアップデートを採用することでアップデートした際も稼働し続けられる
    - PostgreSQL: 11.5
- Docker
  - Docker: 19.03.8
    - ボリュームによるコンテナ間のデータ共有
  - docker-compose: 1.16.1
    - ローカル環境構築
- CircleCI
  - 自動テスト
    - masterブランチ以外へのブランチへマージすることでテスト開始
  - 自動デプロイ
    - masterブランチへのマージによりECR/ECS/S3へデプロイ
    - Orbsを用いたデプロイを実装
- Nginx(Webサーバー)
  - ロードバランサーとしての負荷分散
  - ヘルスチェッククリア
- Gunicorn(アプリケーションサーバー)
### その他ツール
- タスク管理
  - GitHub Projects
- API仕様書
  - OpenAPI(Swaggar)
