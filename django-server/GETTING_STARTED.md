# Shapparの始め方！

## Pythonサーバーの起動

1. 開発メンバーから環境変数をもらいましょう
1. Shapparのルートdirで、docker compose down // 変なの立ち上がってたらdownさせる
1. docker compose build shappar-back --no-cache
1. make migrations
1. make migrate
1. make createsuperuser // ここで管理者ユーザーを作成する
1. docker compose up shappar-back
1. localhost:8000/admin // ここで作成した管理者ユーザーでログインできる
