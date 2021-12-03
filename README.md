## 概要
- Next.js + ApolloClientのハンズオン用のセットアップ済みリポジトリです。
    - GitHubのGraphQL APIに対して各種リクエストができるようになっています。
- クローンして使ってください。

## Getting Started

- まずは各種パッケージをインストールしてください。

```bash
yarn install
```

- GitHubのPersonal Access Tokenを作成してトークンをコピーしておいてください。
    - 権限はrepoがあればOKです。

- 次にenv.local.sampleをコピーしNEXT_PUBLIC_GITHUB_TOKENに先程のトークンを貼り付けます。
```bash
cp .env.local.sample .env.local
```

- 下記コマンドで開発環境を立ち上げて、[http://localhost:3000](http://localhost:3000) をブラウザで開くとサンプル画面が表示されます。

```bash
yarn dev
```

- lib/graphql 配下にクエリなどのファイルを配置しています。
    - 追加、更新した場合は下記コマンドでTypeScirptの型定義やReact Hooksの更新が行えます。

    ```bash
        yarn generate
    ``` 