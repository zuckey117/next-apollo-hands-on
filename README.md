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

## ハンズオン
- [Next.js, Apollo Client概要](/NEXT-APOLLO-SUMMARY.md)
    - Next.js, Apollo Clientについての概要や、その前段となるTypeScriptなどについての講義などフロントエンドの開発経験があまりない人を対象にしたハンズオンです。
- [Next.js](/NEXT.md)
    - React Hooksや、SSR, SSGなど普段Next.jsで軽微な修正はやっていて、新規ページの実装は不安くらいのレベル感の人を対象にしたハンズオンです。


# おすすめ資料・便利ツール

## フロントエンド全般

- [Can I use...](https://caniuse.com/)
    - HTML, CSS, JS などの各種機能のブラウザ実装状況が一括で確認できます。
    
- [JSer.info](http://jser.info/)
    - JS 関連の各種最新情報を日本語で追える便利ブログです。
    

## JavaScript

### JS全般

- [JavaScript Primer](https://jsprimer.net/)

### Promise, async/await

- [JavaScript Promise の本](https://azu.github.io/promises-book/)
- [JavaScript での非同期処理の基本 - 🐾 Nekonote](https://scrapbox.io/dojineko/JavaScript_%E3%81%A7%E3%81%AE%E9%9D%9E%E5%90%8C%E6%9C%9F%E5%87%A6%E7%90%86%E3%81%AE%E5%9F%BA%E6%9C%AC)

## TypeScript

### TypeScript全般

- TypeScript Deep Dive
    - 日本語訳
    [TypeScript Deep Dive 日本語版について](https://typescript-jp.gitbook.io/deep-dive/)
    - 英語原本
    [README](https://basarat.gitbook.io/typescript/)

### 型

- [TypeScript の型入門 - Qiita](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a)

## React

- React Docs BETA - Learn React
[Quick Start](https://beta.reactjs.org/learn)
    - 英語ドキュメントですが、関数コンポーネント前提で書かれていて今どきの React の書き方のみを効率的に学ぶことができます。

## Next.js

- 公式のドキュメントがわかりやすいです。
[Getting Started | Next.js](https://nextjs.org/docs/getting-started)
    - 非公式ですが日本語訳もあります
    [はじめに | Next.js](https://nextjs-ja-translation-docs.vercel.app/docs/getting-started)