---
name: linear
description: |
  Symphony の `linear_graphql` client tool を使って、コメント編集や
  アップロードフローなどの生の Linear GraphQL 操作を行う。
---

# Linear GraphQL

Symphony の app-server session 中に、生の Linear GraphQL 操作が必要なときはこの skill を使う。

## 主ツール

Symphony の app-server session から公開される `linear_graphql` client tool を使う。
このツールは、その session に設定された Linear 認証をそのまま再利用する。

ツール入力:

```json
{
  "query": "query or mutation document",
  "variables": {
    "optional": "graphql variables object"
  }
}
```

ツールの挙動:

- 1 回の tool call につき 1 つの GraphQL operation だけを送る。
- top-level の `errors` 配列が返った場合、tool call 自体が完了していてもGraphQL operation は失敗として扱う。
- query / mutation は必要最小限の field に絞る。

## 未知の operation を調べる

知らない mutation、input type、object field が必要になったら、`linear_graphql` で対象を絞った introspection を行う。

mutation 名の一覧を出す:

```graphql
query ListMutations {
  __type(name: "Mutation") {
    fields {
      name
    }
  }
}
```

特定の input object を調べる:

```graphql
query CommentCreateInputShape {
  __type(name: "CommentCreateInput") {
    inputFields {
      name
      type {
        kind
        name
        ofType {
          kind
          name
        }
      }
    }
  }
}
```

## よく使うワークフロー

### key / identifier / id で issue を引く

次の順で段階的に使う。

- `MT-686` のようなチケットキーがあるなら、まず `issue(id: $key)` を使う。
- identifier 検索が必要なときは `issues(filter: ...)` に切り替える。
- 内部 issue id が手に入ったら、以後はより狭く読める `issue(id: $id)` を優先する。

issue key で引く:

```graphql
query IssueByKey($key: String!) {
  issue(id: $key) {
    id
    identifier
    title
    state {
      id
      name
      type
    }
    project {
      id
      name
    }
    branchName
    url
    description
    updatedAt
    links {
      nodes {
        id
        url
        title
      }
    }
  }
}
```

identifier filter で引く:

```graphql
query IssueByIdentifier($identifier: String!) {
  issues(filter: { identifier: { eq: $identifier } }, first: 1) {
    nodes {
      id
      identifier
      title
      state {
        id
        name
        type
      }
      project {
        id
        name
      }
      branchName
      url
      description
      updatedAt
    }
  }
}
```

key から内部 id を解決する:

```graphql
query IssueByIdOrKey($id: String!) {
  issue(id: $id) {
    id
    identifier
    title
  }
}
```

内部 id がわかったあとの詳細取得:

```graphql
query IssueDetails($id: String!) {
  issue(id: $id) {
    id
    identifier
    title
    url
    description
    state {
      id
      name
      type
    }
    project {
      id
      name
    }
    attachments {
      nodes {
        id
        title
        url
        sourceType
      }
    }
  }
}
```

### issue に紐づく team workflow state を調べる

issue の state を変更する前に、正確な `stateId` が必要ならこれを使う。

```graphql
query IssueTeamStates($id: String!) {
  issue(id: $id) {
    id
    team {
      id
      key
      name
      states {
        nodes {
          id
          name
          type
        }
      }
    }
  }
}
```

### 既存コメントを編集する

`linear_graphql` 経由で `commentUpdate` を使う。

```graphql
mutation UpdateComment($id: String!, $body: String!) {
  commentUpdate(id: $id, input: { body: $body }) {
    success
    comment {
      id
      body
    }
  }
}
```

### コメントを作成する

`linear_graphql` 経由で `commentCreate` を使う。

```graphql
mutation CreateComment($issueId: String!, $body: String!) {
  commentCreate(input: { issueId: $issueId, body: $body }) {
    success
    comment {
      id
      url
    }
  }
}
```

### issue を別 state に移動する

移動先の `stateId` を指定して `issueUpdate` を使う。

```graphql
mutation MoveIssueToState($id: String!, $stateId: String!) {
  issueUpdate(id: $id, input: { stateId: $stateId }) {
    success
    issue {
      id
      identifier
      state {
        id
        name
      }
    }
  }
}
```

### issue に GitHub PR を紐づける

PR をリンクするときは GitHub 専用の attachment mutation を使う。

```graphql
mutation AttachGitHubPR($issueId: String!, $url: String!, $title: String) {
  attachmentLinkGitHubPR(
    issueId: $issueId
    url: $url
    title: $title
    linkKind: links
  ) {
    success
    attachment {
      id
      title
      url
    }
  }
}
```

GitHub 固有のリンクメタデータが不要で、単なる URL 添付でよいならこちらを使う。

```graphql
mutation AttachURL($issueId: String!, $url: String!, $title: String) {
  attachmentLinkURL(issueId: $issueId, url: $url, title: $title) {
    success
    attachment {
      id
      title
      url
    }
  }
}
```

### スキーマ調査時に使う introspection パターン

field や mutation の正確な shape が不明なときは、以下を使う。

```graphql
query QueryFields {
  __type(name: "Query") {
    fields {
      name
    }
  }
}
```

```graphql
query IssueFieldArgs {
  __type(name: "Query") {
    fields {
      name
      args {
        name
        type {
          kind
          name
          ofType {
            kind
            name
            ofType {
              kind
              name
            }
          }
        }
      }
    }
  }
}
```

### コメントに動画をアップロードする

次の 3 手順で行う。

1. `linear_graphql` で `fileUpload` を呼び、`uploadUrl`、`assetUrl`、そして必要な upload header を受け取る。
2. `fileUpload` が返した header をそのまま使い、`curl -X PUT` でローカルファイルのバイト列を `uploadUrl` へ送る。
3. 再度 `linear_graphql` で `commentCreate`（または `commentUpdate`）を呼び、生成された `assetUrl` をコメント本文に含める。

使う mutation:

```graphql
mutation FileUpload(
  $filename: String!
  $contentType: String!
  $size: Int!
  $makePublic: Boolean
) {
  fileUpload(
    filename: $filename
    contentType: $contentType
    size: $size
    makePublic: $makePublic
  ) {
    success
    uploadFile {
      uploadUrl
      assetUrl
      headers {
        key
        value
      }
    }
  }
}
```

## 利用ルール

- コメント編集、アップロード、アドホックな Linear API 問い合わせには`linear_graphql` を使う。
- issue の取得は、既に知っている情報に対して最も狭い方法を優先する。順序は key -> identifier search -> internal id。
- state 遷移では、先に team states を取得し、mutation 内で名前をハードコードせず正確な `stateId` を使う。
- GitHub PR を Linear issue に紐づけるときは、汎用 URL 添付より`attachmentLinkGitHubPR` を優先する。
- GraphQL アクセス用の raw token ベース shell helper を新設しない。
- upload のために shell が必要なら、`fileUpload` が返す署名付き upload URLに対してだけ使う。必要な認可情報はその URL 自体に含まれている。
