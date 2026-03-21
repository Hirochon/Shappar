---
name: debug
description:
  issue / session 識別子を手がかりに Symphony と Codex のログを追い、停滞した実行や失敗の原因を調べる。実行が止まる、何度もリトライする、あるいは予期せず失敗するときに使う。
---

# Debug

## 目的

- 実行が停滞・再試行・失敗している理由を特定する。
- Linear の issue と Codex セッションを素早く対応付ける。
- 適切なログを適切な順序で読み、根本原因を切り分ける。

## ログの場所

- メインのランタイムログ: `log/symphony.log`
  - 既定値は `SymphonyElixir.LogFile` の `log/symphony.log`。
  - orchestrator、agent runner、Codex app-server のライフサイクルログを含む。
- ローテート済みランタイムログ: `log/symphony.log*`
  - 対象の実行が古い場合はこちらも確認する。

## 突合キー

- `issue_identifier`: 人間向けのチケットキー（例: `MT-625`）
- `issue_id`: Linear の UUID（安定した内部 ID）
- `session_id`: Codex の thread-turn ペア（`<thread_id>-<turn_id>`）

`elixir/docs/logging.md` では issue / session のライフサイクルログにこれらのフィールドが必須です。デバッグ時の join key として使う。

## クイックトリアージ（停滞した実行）

1. そのチケットで scheduler / worker にどんな症状が出ているか確認する。
2. まず `issue_identifier` を起点に、そのチケットの最近のログ行を探す。
3. 一致した行から `session_id` を抜き出す。
4. その `session_id` を、開始・ストリーム・完了 / 失敗・停滞処理の各ログで追いかける。
5. 失敗種別を決める。候補は timeout / stall、app-server 起動失敗、turn failure、orchestrator の retry loop。

## コマンド

```bash
# 1) まずチケットキーで絞る（最速の入口）
rg -n "issue_identifier=MT-625" log/symphony.log*

# 2) 必要なら Linear UUID でも絞る
rg -n "issue_id=<linear-uuid>" log/symphony.log*

# 3) そのチケットで観測された session_id を集める
rg -o "session_id=[^ ;]+" log/symphony.log* | sort -u

# 4) 1 つの session を端から端まで追う
rg -n "session_id=<thread>-<turn>" log/symphony.log*

# 5) 停滞 / リトライ系シグナルに絞る
rg -n "Issue stalled|scheduling retry|turn_timeout|turn_failed|Codex session failed|Codex session ended with error" log/symphony.log*
```

## 調査フロー

1. チケットに対応するログ範囲を見つける。
   - `issue_identifier=<KEY>` で検索する。
   - ノイズが多ければ `issue_id=<UUID>` も足す。
2. 時系列を作る。
   - 最初の `Codex session started ... session_id=...` を特定する。
   - 続く `Codex session completed`、`ended with error`、worker exit 行を追う。
3. 問題を分類する。
   - stall loop: `Issue stalled ... restarting with backoff`
   - app-server 起動失敗: `Codex session failed ...`
   - turn 実行失敗: `turn_failed`、`turn_cancelled`、`turn_timeout`、`ended with error`
   - worker crash: `Agent task exited ... reason=...`
4. 影響範囲を確認する。
   - 失敗が 1 つの issue / session に閉じているか、複数チケットで繰り返しているかを見る。
5. 証跡を残す。
   - タイムスタンプ、`issue_identifier`、`issue_id`、`session_id` を含む重要ログを保存する。
   - 想定される根本原因と、どの段階で失敗したかを記録する。

## Codex セッションログの読み方

Symphony では Codex セッション診断ログが `log/symphony.log` に出力され、`session_id` で追跡できる。ライフサイクルとして読むこと。

1. `Codex session started ... session_id=...`
2. 同じ `session_id` の stream / lifecycle event
3. 終端イベント
   - `Codex session completed ...`
   - `Codex session ended with error ...`
   - `Issue stalled ... restarting with backoff`

特定の 1 セッションだけを調べるときは、追跡対象を絞る。

1. そのチケットに対応する `session_id` を 1 つ取る。
2. そのセッションだけのタイムスタンプ付きログ断面を作る。
   - `rg -n "session_id=<thread>-<turn>" log/symphony.log*`
3. 正確な失敗段階を特定する。
   - stream event 前の起動失敗（`Codex session failed ...`）
   - stream event 後の turn / runtime failure（`turn_*` / `ended with error`）
   - stall recovery（`Issue stalled ... restarting with backoff`）
4. 近傍の `issue_identifier` と `issue_id` を併せて見て、並行リトライを取り違えていないことを確認する。

同時実行中の別 run と混同しないため、session の所見は必ず`issue_identifier` / `issue_id` と対で扱う。

## 注意点

- 大きいログでは `grep` より `rg` を優先する。
- データがないと判断する前に、ローテート済みログ（`log/symphony.log*`）も確認する。
- 新しいログ文に必要なコンテキスト項目が欠けている場合は、`elixir/docs/logging.md` の規約に合わせる。
