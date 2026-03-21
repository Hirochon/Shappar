---
name: land
description:
  PR の競合監視、解消、チェック待ち、グリーン後の squash merge までを行い、PR を着地させる。land、merge、あるいは PR を最後まで面倒見るよう頼まれたときに使う。
---

# Land

## 目的

- PR が main と競合していない状態を保つ。
- CI をグリーンに保ち、失敗したら修正する。
- チェック通過後に PR を squash merge する。
- PR がマージされるまでユーザーへ返して終わらない。ブロックされない限りwatcher loop を回し続ける。
- マージ後の remote branch 削除は不要。このリポジトリでは head branch が自動削除される。

## 前提条件

- `gh` CLI が認証済みであること。
- クリーンな working tree の PR branch 上にいること。

## 手順

1. 現在の branch に対応する PR を特定する。
2. push 前に、必要なローカル検証がすべてグリーンであることを確認する。
3. working tree に未コミット変更があれば、先に `commit` スキルでコミットし、`push` スキルで push してから進む。
4. main に対する mergeability と競合の有無を確認する。
5. 競合がある場合は `pull` スキルで `origin/main` を fetch / merge して解消し、その後 `push` スキルで更新 branch を公開する。
6. Codex review comment が存在する場合は、マージ前に必ず応答し、必要な修正を反映する。
7. チェックが完了するまで監視する。
8. チェックが失敗したら、ログを取り、問題を修正し、`commit` スキルでコミット、`push` スキルで push し、再度チェックを流す。
9. すべてのチェックがグリーンで、レビュー対応も終わったら、PR の title/bodyを merge subject/body として squash merge する。branch 削除は repo の振る舞いに従う。
10. **Context guard:** レビュー指摘を実装する前に、それがユーザーの意図やタスク文脈と矛盾しないか確認する。矛盾する場合は、コードを変える前に理由を添えて inline で返答し、ユーザー確認を取る。
11. **Pushback template:** 同意しない場合は、「受領 -> 理由 -> 代替案」の順で inline に返す。
12. **Ambiguity gate:** 曖昧さが進行を止める場合は clarification flow を使う（現在の GH user に PR を assign し、mention し、返答を待つ）。曖昧さが解消するまで実装しない。
    - レビュアーより自分の判断に十分根拠があるなら、ユーザー確認なしで進めてもよいが、その理由は inline で返す。
13. **Per-comment mode:** 各レビューコメントごとに、accept / clarify / push back のいずれかを選ぶ。コード変更前に、そのモードをinline（Codex review なら issue thread）で明言する。
14. **Reply before change:** コードを push する前に、必ず「何をするか」を先に返答する。レビューコメントには inline、Codex review には issue thread を使う。

## コマンド

```
# branch と PR の文脈を確認
branch=$(git branch --show-current)
pr_number=$(gh pr view --json number -q .number)
pr_title=$(gh pr view --json title -q .title)
pr_body=$(gh pr view --json body -q .body)

# mergeability と競合を確認
mergeable=$(gh pr view --json mergeable -q .mergeable)

if [ "$mergeable" = "CONFLICTING" ]; then
  # `pull` スキルで fetch + merge + conflict resolution を行う。
  # その後 `push` スキルで更新 branch を公開する。
fi

# 推奨は下の Async Watch Helper。Python が使えない、または helper script が
# 使えない場合のみ手動ループを fallback として使う。
# レビュー待ち: Codex review は "## Codex Review — <persona>" で始まる
# issue comment として届く。通常の reviewer feedback と同様に扱い、
# 所見を受けたことと、今対応するのか defer するのかを `[codex]`
# issue comment で返す。
while true; do
  gh api repos/{owner}/{repo}/issues/"$pr_number"/comments \
    --jq '.[] | select(.body | startswith("## Codex Review")) | .id' | rg -q '.' \
    && break
  sleep 10
done

# チェックを監視
if ! gh pr checks --watch; then
  gh pr checks
  # 失敗した run を特定してログを確認
  # gh run list --branch "$branch"
  # gh run view <run-id> --log
  exit 1
fi

# squash merge（この repo では remote branch はマージ時に自動削除される）
gh pr merge --squash --subject "$pr_title" --body "$pr_body"
```

## Async Watch Helper

推奨は asyncio watcher を使い、レビューコメント、CI、head 更新を並列監視する。

```
python3 .codex/skills/land/land_watch.py
```

終了コード:

- 2: レビューコメントを検知（フィードバック対応へ）
- 3: CI チェック失敗
- 4: PR head が更新された（autofix commit を検知）

## 失敗時の扱い

- チェック失敗時は `gh pr checks` と `gh run view --log` で詳細を取り、ローカルで修正し、`commit` スキルでコミット、`push` スキルで push し、watch を再開する。
- flake は見極める。単一プラットフォームの timeout など明らかな flake なら、修正せず進めてもよい。
- GitHub Actions が auto-fix commit を push しても、新しい CI は自動では走らない。PR head 更新を検知したら、ローカルに取り込み、必要なら`origin/main` をマージし、人間の author 付きコミットを足してforce-push し、CI を再起動させてからチェックループを再開する。
- merge commit 上で全 job が壊れた pnpm lockfile エラーになる場合は、最新 `origin/main` を fetch してマージし、force-push して CI を再実行する。
- mergeability が `UNKNOWN` なら待って再確認する。
- 人間レビューでも Codex review でも、未対応コメントがある間は merge しない。
- Codex review job は失敗時に再試行され、blocking ではない。レビュー到着の合図は job status ではなく `## Codex Review — <persona>` issue comment の出現で判断する。
- auto-merge は有効化しない。この repo には required checks がないため、テストを飛ばして merge される可能性がある。
- 自分の以前の force-push や merge によって remote PR branch が進んだ場合は、不要な重複マージを避ける。必要なら formatter をローカルで再実行し、`git push --force-with-lease` を使う。

## レビュー対応

- Codex review は GitHub Actions が投稿する issue comment として届く。`## Codex Review — <persona>` で始まり、使われた方法論と guardrail が含まれる。これらは merge 前に必ず受領・応答すべきフィードバックとして扱う。
- 人間の review comment は blocking であり、新しい review 要求や merge の前に必ず対応（返答と解消）する。
- 同じ thread に複数 reviewer のコメントがある場合も、thread を閉じる前にそれぞれへ返答する（まとめてよい）。
- review comment の取得には `gh api` を使い、返答は prefix 付きコメントで行う。
- inline feedback の取得には issue comment ではなく review comment endpoint を使う。
  - PR review comment 一覧:
    ```
    gh api repos/{owner}/{repo}/pulls/<pr_number>/comments
    ```
  - PR issue comment（トップレベル議論）:
    ```
    gh api repos/{owner}/{repo}/issues/<pr_number>/comments
    ```
  - 特定 review comment への返信:
    ```
    gh api -X POST /repos/{owner}/{repo}/pulls/<pr_number>/comments \
      -f body='[codex] <response>' -F in_reply_to=<comment_id>
    ```
- `in_reply_to` には GraphQL node id（`PRRC_...`）ではなく、数値のreview comment id（例: `2710521800`）を使う。また endpoint にはPR 番号を含める必要がある（`/pulls/<pr_number>/comments`）。
- GraphQL の review reply mutation が禁止されているなら REST を使う。
- reply で 404 が出る場合は、たいてい endpoint が誤っている（PR 番号欠落など）か権限不足。まず comment 一覧を取って確認する。
- この agent が生成する GitHub comment はすべて `[codex]` 接頭辞を付ける。
- Codex review の issue comment には、review thread ではなく issue thread に`[codex]` で返し、「今対応するのか defer するのか」とその理由を書く。
- フィードバックが変更を要求する場合:
  - 人間の inline review comment には、元コメントへの **inline reply** として返答する。`[codex] ...` を review comment endpoint と `in_reply_to` で送り、issue comment は使わない。
  - 修正を実装し、commit し、push する。
  - 修正内容と commit sha も、最初に受領を返したのと同じ場所へ`[codex] ...` で返す（Codex review なら issue comment、人間レビューなら inline reply）。
  - land watcher は、新しい `[codex]` issue comment で所見受領が投稿されるまで、Codex review issue comment を未解決として扱う。
- 新しい Codex review を依頼するのは rerun が必要なときだけ（例: 新しい commit のあと）。前回 review 以降に変更がない状態では依頼しない。
  - 新しい Codex review を依頼する前に land watcher を再実行し、未対応 review comment が 0 件であること（すべてに `[codex]` inline reply があること）を確認する。
  - 新しい commit を push すると、PR synchronization で Codex review workflow が再実行される（必要なら手動 rerun も可）。reviewer が最新差分を把握できるよう、簡潔なルートコメントを投稿する。
    ```
    [codex] 前回レビューからの変更:
    - <差分の要約>
    Commits: <sha>, <sha>
    Tests: <実行したコマンド>
    ```
  - 新しい review を依頼するのは、前回依頼以降に少なくとも 1 つ新しい commit がある場合だけ。
  - merge 前に、次の Codex review comment を待つ。

## スコープと PR メタデータ

- PR title と description は、直近の修正だけでなく変更全体のスコープを反映する。
- review 指摘でスコープが広がる場合、それを今含めるか defer するかを決める。accept / defer / decline のいずれも選べる。defer または decline する場合は、ルートの `[codex]` 更新コメントで短い理由（例: out-of-scope、意図と衝突、不要）を明記する。
- review comment で指摘された correctness 問題は原則対応する。defer や declineを考えるなら、まず検証し、その懸念が当てはまらない理由を説明する。
- 各 review comment を次のいずれかに分類する:correctness、design、style、clarification、scope。
- correctness 系フィードバックは、閉じる前に具体的な検証（テスト、ログ、または論理的説明）を添える。
- フィードバックを受け入れる場合は、ルート更新コメントに 1 行の理由を入れる。
- decline する場合は、短い代替案か follow-up のきっかけを示す。
- 細かい更新コメントを何本も出すより、修正群のあとに 1 本の「review addressed」ルートコメントへまとめるのを優先する。
- ドキュメント指摘では、doc 変更が実際の挙動と一致していることを確認する。レビューを満足させるためだけの doc-only 修正にしない。
