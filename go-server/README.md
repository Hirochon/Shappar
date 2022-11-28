## go-serverの起動方法

1. Shapparのルート直下で以下コマンド実行

```
docker compose up go-server
docker compose exec go-server ash
```

2. docker containerの中でGoを実行！

```
make run
```

3. docker containerの中でテスト実行！

以下コマンドで、Shapparのルート/go-server/.outputディレクトリのhtmlでテスト結果が出力される

```
make test
```

## ディレクトリ構成について

- cmd: プログラムのエントリーポイント
- internal: プログラムの内部パッケージ
    - pkg: プログラム内部の共通パッケージ
    - ui: ユーザーインターフェース層
    - usecase: ユースケース層
    - domain: ドメイン層
    - infrastructure: インフラ層
    - di: 依存性注入
- .output: テスト結果の出力先
    - coverage.out: テストのカバー内容を吐き出す
    - coverage.html: テスト結果のhtmlファイル
