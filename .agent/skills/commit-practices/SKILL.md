---
name: commit-practices
description: "変更差分を file/hunk 単位で分割し、コミット設計から staging、push、PR 作成までを一貫して進める運用を定義します。"
---

# Commit Practices

## Scope

このリポジトリで、以下のようなまとめての変更を扱う際に参照します。

- AGENTS の運用ルール更新と実装変更が混在する場合
- ドキュメント・設定・実装を同時に扱う場合
- 複数の小変更をレビューしやすい単位にまとめ直す場合
- コミット前に分割案を一覧で提示したい場合
- コミット後に push と PR 作成まで進めたい場合

## 基本原則

- 1コミットは「1 意図」のみ扱う。
- 影響範囲とレビュー観点が重ならない変更は分割する。
- 依存関係がある変更は、上流から下流へ順序を守ってコミットする。
- 小分けしすぎず、しかし巻き戻しコストを上げないサイズを狙う。
- 行単位の採否調整は `git add -p` を使うが、目的は最終的なコミット設計。
- 先にコミット案を出し、ユーザーが見える形で分割方針を固定する。
- 最初に「何コミットになりそうか」を件数つきで提示し、ユーザー確認を取ってから実行に進む。
- 導入と利用は別意図として扱う。
- `main/master`や`develop`への push は原則避ける。必要なら明示確認する。

## STEP 0: 差分を観測する

1. 変更全体をカテゴリ化する
   - `Docs-Index`（`AGENTS.md`、共通手順書）
   - `Guidance`（`SKILL.md`）
   - `Environment`（CLI 導入、devcontainer、各種設定）
   - `Implementation`（`apps/...` 配下のコード）
   - `Validation`（テスト、lint、config 追加）
2. file 単位でコミット候補を作る
   - docs / skills / config / implementation / validation に分ける
   - 1 ファイルしか変わっていなくても、意図が独立していれば独立コミット候補にする
3. hunk 分割が必要か確認する
   - 同一ファイルに機能追加と整形だけの変更が混在していないか
   - 新しい運用ルールと単なる説明改善が混在していないか
   - 依存更新とコード修正が混在していないか
   - 混在があるなら `git add -p` 前提で切り分ける

## STEP 1: コミット数を見積もる

1. 受け入れ条件を先に決める
   - どの変更が「必須」か
   - どの変更が「後回し可能」か
   - 依存で順序が必要か
2. コミット数を見積もる
   - まず「今回は `N` コミット想定」と件数を明示する
   - 件数が増える理由があるなら短く添える
   - hunk 分割がある場合は、そのファイルも先に明示する
3. 先にコミット案を一覧で出す
   - 各コミットに仮メッセージを付ける
   - 対象ファイルを列挙する
   - hunk 分割が必要なファイルを明示する
4. ユーザー確認を取る
   - 件数と分割案を見せたあとで、commit 実行前に確認を取る
   - 修正希望があればここで反映する

## STEP 2: staging と commit を作る

1. 最小単位で staging を分割する
   - ファイル単位なら `git add -- <path>`
   - 混在があるなら `git add -p`
   - `git diff --cached --stat` と `git diff --cached` で毎回確認する
2. コミット実行
   - `Docs-Index` → `Guidance` → `Environment` → `Implementation` → `Validation`
   - 各コミットでメッセージは `type: 目的` を1行にまとめる
3. 各コミット後に残差分を確認する
   - `git status --short`
   - 想定した次コミットの差分だけが残っているか確認する

## STEP 3: リモート反映する

1. リモート反映する
   - 初回の追跡なしブランチ: `git push -u origin <branch>`
   - 既存ブランチ: `git push`
   - push が拒否されたら先に `git pull --rebase` 方針で解決する
2. PR を作成する
   - `gh auth status` を先に確認する
   - タイトルは 1 文で変更意図を表現する
   - 本文には背景、変更点、影響範囲、検証結果、リスクを含める
   - `gh pr create --body-file <file>` 形式で本文を渡す
3. 終了確認
   - `git status` がクリーン
   - `git log --oneline -n 10` で順序を確認

## コミットメッセージ規約

- `docs: ...`
- `docs(skills): ...`
- `feat: ...`
- `fix: ...`
- `refactor: ...`
- `test: ...`
- `chore: ...`

## 判断基準

- 「新しいツールを入れる」と「そのツールで運用を変える」は分ける
- 「コードの意味変更」と「フォーマット修正」は分ける
- 「README の恒久運用」と「一時的な作業メモ」は分ける
- `AGENTS.md` と新しい Skill は同じテーマならまとめてよい
- ある変更の説明に別変更が必須なら、無理に分けない

## 出力フォーマット

コミット前は、まず件数を出してから次の形式で案を出す。

- `想定コミット数: N`
- `確認ポイント: 分割案をこの件数で進めてよいか`

- `type(scope): summary`
  - files: `path/to/a`, `path/to/b`
  - note: hunk 分割が必要なら理由を書く

## 良い分割の例

- `AGENTS.md` 更新のみ
  - `docs: refresh skill catalog categories`
- 新規スキル追加のみ
  - `docs(skills): add commit-practices`
- CLI 導入のみ
  - `chore(devcontainer): install GitHub CLI`
- CLI を使う運用ドキュメントのみ
  - `docs: document GitHub auth flow`
- コード変更のみ
  - `feat: add shared composition guard`
- テスト・検証のみ
  - `test: add commit helper checks`

## 禁止/注意

- `AGENTS.md` と本体実装を同一コミットにまとめる
- 関係のない 2 テーマを 1 コミットで処理
- `git add .` で無差別追加したままコミット
- メッセージだけを変えて中身は再編集する
- 環境整備、依存追加、CLI 導入を、その利用変更と安易に混ぜる
- push 前にブランチと base を確認しない

## References

- `AGENTS.md`
- `.agent/skills/*/SKILL.md`
- `docs-skills-sync` Skill
