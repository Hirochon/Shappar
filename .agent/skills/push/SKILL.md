---
name: push
description:
  現在のブランチの変更を `origin` に push し、対応する pull request を作成
  または更新する。push、公開、PR 作成を頼まれたときに使う。
---

# Push

## 前提条件

- `gh` CLI がインストール済みで、`PATH` 上にあること。
- このリポジトリで GitHub 操作を行うために `gh auth status` が成功すること。

## 目的

- 現在のブランチ変更を安全に `origin` へ push する。
- そのブランチの PR が未作成なら作成し、既存なら更新する。
- remote 側が進んでいる場合でも、ブランチ履歴をきれいに保つ。

## 関連スキル

- `pull`: push が拒否されたときや同期状態がきれいでないとき（non-fast-forward、競合の恐れ、古いブランチなど）に使う。

## 手順

1. 現在のブランチを特定し、remote の状態を確認する。
2. push 前にローカル検証（`make -C elixir all`）を実行する。
3. 必要なら upstream tracking を設定しつつ、現在設定されている remote URL のまま `origin` へ push する。
4. push がきれいに通らない / 拒否された場合:
   - non-fast-forward や同期不整合なら `pull` スキルを使い、`origin/main` をマージして競合を解消し、検証をやり直す。
   - その後もう一度 push する。`--force-with-lease` は履歴を書き換えた場合に限って使う。
   - 失敗が認証、権限、ワークフロー制約に起因する場合は、remote を書き換えたりプロトコルを切り替えたりせず、正確なエラーをそのまま伝えて止まる。
5. そのブランチに対応する PR があることを確認する。
   - PR がなければ作成する。
   - PR が存在して open なら更新する。
   - closed / merged の PR に紐づいているブランチなら、新しい branch + PR を作る。
   - 変更の着地点が明確にわかる、適切な PR タイトルを書く。
   - ブランチ更新時は、今の PR タイトルが最新のスコープに依然として合っているかを明示的に見直し、ずれていれば更新する。
6. `.github/pull_request_template.md` を使って PR 本文を明示的に作成 / 更新する。
   - すべてのセクションを、この変更に即した具体的内容で埋める。
   - すべてのプレースホルダーコメント（`<!-- ... -->`）を置き換える。
   - テンプレートが期待する箇条書き / チェックボックスは維持する。
   - 既存 PR を更新する場合も、最新コミットだけではなくブランチ全体の意図したスコープが反映されるよう、本文を全面的に見直す。
   - 過去 iteration の古い説明を流用しない。
7. `mix pr_body.check` で PR 本文を検証し、指摘をすべて直す。
8. `gh pr view` で得られる PR URL を返す。

## コマンド

```sh
# ブランチ名を確認
branch=$(git branch --show-current)

# 最低限の検証ゲート
make -C elixir all

# 初回 push。現在設定されている origin をそのまま使う。
git push -u origin HEAD

# remote 側が進んでいて失敗した場合は pull スキルを使う。
# 解消と再検証が終わったら、通常の push を再試行する。
git push -u origin HEAD

# 認証、権限、ワークフロー制約で拒否された場合は止まり、
# 正確なエラーをそのまま伝える。

# ローカルで履歴を書き換えた場合のみ:
git push --force-with-lease origin HEAD

# PR の存在確認（なければ作成）
pr_state=$(gh pr view --json state -q .state 2>/dev/null || true)
if [ "$pr_state" = "MERGED" ] || [ "$pr_state" = "CLOSED" ]; then
  echo "現在のブランチは閉じた PR に紐づいているため、新しい branch + PR を作成する必要があります。" >&2
  exit 1
fi

# 出荷される変更を人間にわかりやすく要約したタイトルを書く。
pr_title="<clear PR title written for this change>"
if [ -z "$pr_state" ]; then
  gh pr create --title "$pr_title"
else
  # ブランチ更新のたびにタイトルを見直し、スコープがずれていれば修正する。
  gh pr edit --title "$pr_title"
fi

# 検証前に `.github/pull_request_template.md` に沿って PR 本文を書く / 更新する。
# 例:
# 1) テンプレートを開いて、この PR 用の本文を下書きする
# 2) gh pr edit --body-file /tmp/pr_body.md
# 3) ブランチ更新時は、title / body が現在の diff に合っているか再確認する

tmp_pr_body=$(mktemp)
gh pr view --json body -q .body > "$tmp_pr_body"
(cd elixir && mix pr_body.check --file "$tmp_pr_body")
rm -f "$tmp_pr_body"

# 返答用に PR URL を取得
gh pr view --json url -q .url
```

## 注意点

- `--force` は使わない。最後の手段として `--force-with-lease` のみ使う。
- 同期問題と remote の認証 / 権限問題は切り分ける。
  - non-fast-forward や古いブランチの問題には `pull` スキルを使う。
  - 認証、権限、ワークフロー制約は、remote やプロトコルを変えずにそのまま表に出す。
