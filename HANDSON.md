# Next.js+ApolloClient ハンズオン

- 社内用にnotionで作成したものをmarkdownとして出力したので崩れなどあった場合ご了承ください。
- 2時間でハンズオンまでを行う前提で作成した資料です。

# はじめに

- フロントエンドの開発経験があまりない人を対象に、Next.js と ApolloClient を用いたフロントエンドの開発に最低限必要な知識をインプットし、実際にハンズオン形式で実装してみて理解を深めることを目的としています。
  - 公式ドキュメントなどを参照しつつ、自走して Next.js + ApolloClient を用いた開発ができるようになるための取っ掛かりとなる知識のインプットを目的としているため、説明を省略しているものも多いです。
- JavaScript が何となく読み書きできることを前提に本文を書いています。
  - JavaScript 全然知らないよという人は下記などで一通り勉強するのをおすすめします。
  - 書籍の内容を著者の[azu](https://twitter.com/azu_re)さん、[lacolaco](https://twitter.com/laco2net)さんがインターネットに全編公開してくださっている神資料です。
  [JavaScript Primer - 迷わないための入門書 #jsprimer](https://jsprimer.net/)
- 既存のコードを読んだり、手を加えていくのに必要になりそうな知識を中心に紹介していますので、細かい部分は適宜公式ドキュメントなどを参照することをおすすめします。

# 講義編

## Next.js って何？

[Next.js by Vercel - The React Framework](https://nextjs.org/)

- Vercel が開発を行っている React.js のフレームワークです。
  - サーバーサイドレンダリングや静的サイトジェネレーターやルーティング周りなど、React の機能をベースにより開発体験を向上させてくれます。
  - TypeScript との親和性も高く、型安全に開発を行うことができます。

## ApolloClient って何？

[Introduction to Apollo Client](https://www.apollographql.com/docs/react/)

- GraphQL の API クライアントです。
- 今回は詳しく解説はしませんが、オブジェクトベースの強力なキャッシュ機構を持っており、状態管理のライブラリとしての側面もあります。

## 開発環境構築

- プロジェクトを 1 から作る場合以下の手順で作成を行います。

<details>

- 環境構築手順
  - アプリのベースの作成
  ```bash
  # yarnの場合
  yarn create next-app --typescript

  # npmの場合
  npx create-next-app --typescript
  ```
  - `yarn dev` または `npm run dev`でアプリが立ち上がります
    ![Untitled](Next%20js+ApolloClient%20%E3%83%8F%E3%83%B3%E3%82%B9%E3%82%99%E3%82%AA%E3%83%B3%208ade93c0b1cd48549acd6b6ba4695d68/Untitled.png)
  - ApolloClient 関連のパッケージをインストールします。
  ```bash
  # yarnの場合
  yarn add @apollo/client graphql

  ****# npmの場合
  npm i @apollo/client graphql
  ```
  - \_app.tsx に下記のコードを追加します。
  ```tsx
  import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'

  import '../styles/globals.css'

  const client = new ApolloClient({
    uri: 'https://api.github.com/graphql',
    headers: {
      Authorization: `bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}` || '',
    },
    ssrMode: typeof window === 'undefined',
    cache: new InMemoryCache(),
  })
  ```
  - コンポーネントを`ApolloProvider` でラップします。これにより各コンポーネントで ApolloClient の Hooks を利用できるようになります。
  ```tsx
  function MyApp({ Component, pageProps }: AppProps) {
    return (
      <>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </>
    )
  }
  ```
  - ApolloClient の設定は以上です。これで各コンポーネントで Hooks の実行ができます。
  - 次に GraphQL のレスポンスに型を付けるために、GraphQL Code Generator のセットアップを行います。`graphql-codegen init` したあとはスキーマファイルのパス orURL などを対話的に指定していけば OK です
  ```bash
  # yarnの場合
  yarn add -D @graphql-codegen/cli
  yarn graphql-codegen init

  # npmの場合
  npm install --save @graphql-codegen/cli
  npx graphql-codegen init
  ```
  [Installation](https://www.graphql-code-generator.com/docs/getting-started/installation)
  - 環境構築は以上です。

</details>

- 今回は時間の都合上事前にセットアップ済みのリポジトリを使います。興味がある人は自分でやってみてください。
  [https://github.com/zuckey117/next-apollo-hands-on](https://github.com/zuckey117/next-apollo-hands-on)



## TypeScript

- TypeScript って何！？JavaScript と何が違うの！？となる人もいるかもしれませんが、TypeScript は JavaScript のスーパセットです。JavaScript が読み書きできればおおよそは困らずに書けるはずです。
- 雑な理解では型定義のできる JavaScript だと思って問題ないかと思います。
  - [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/recap)にも以下の記述があります
    > TypeScript is just JavaScript with docs.
    ![https://raw.githubusercontent.com/basarat/typescript-book/master/images/venn.png](https://raw.githubusercontent.com/basarat/typescript-book/master/images/venn.png)

### 型定義

- 変数や関数の戻り値、引数などに型をつけることができます。
- 型と合わない代入などを行おうとしたり、null や undifined の可能性のある参照を行おうとしたりするとコンパイルエラーになります。VSCode などのエディタを利用するとリアルタイムにエラーが見れます。
  ```tsx
  const greet = (name: string): string => {
    return `Hello ${name}!`
  }

  console.log(greet('Taro')) // [LOG]: "Hello Taro!"
  console.log(greet(1)) // type error
  ```
- 変数の初期化時や、戻り値の方が自明な場合は下記のように省略が可能です。
  ```tsx
  //　戻り値がstringなのが確定してるので戻り値の型を省略
  const greet = (name: string) => {
    // stringで初期化
    let message = 'Hello'
    message = 'Good morning' // OK
    message = 1 // エラー
    return `${message} ${name}!`
  }
  ```
  - 戻り値の型を省略するかはプロジェクトごとに ESLint で指定があったりするので各プロジェクトの設定に従ってください。
- オブジェクトの型も interface や type を用いて下記のように定義することができます
  ```tsx
  interface Person {
    name: string
    age: number
  }

  type Person = {
    name: string
    age: number
  }

  const p1: Person = {
    name: 'Taro',
    age: 24,
  }
  const p2: Person = {
    name: 'Jiro',
  } // ageがないのでエラー
  ```
  - interface と type のどちらを使うかはしばしば議論になりますが、複雑なので今回は割愛します。
    [TypeScript で type と interface どっち使うのか問題](https://zenn.dev/seya/articles/aa94166c977280#comment-9ec4de4f5c65a9)
    - minne では現状 type をよく使っています。
- ジェネリクス(Generics)
  - ジェネリクスは色々な型に対して共通の処理を実装したいときなどに使います。
  - 下記は fetch に対して型を指定できるようにする例です。
    ```tsx
    async function fetchApi<T>(path: string): Promise<T> {
      const response = await fetch(`https://example.sample/api${path}`)
      return response.json()
    }

    type User = {
      id: number
      name: string
      age: number
    }

    type Article = {
      id: number
      title: string
      url: string
    }

    ;async () => {
      // users, articlesに型が指定される
      const users = await fetchApi<User[]>('/users')
      const articles = await fetchApi<Article[]>('/articles')
    }
    ```
- その他に `Pick<T, K>` や `Omit<T, K>` などの型を生成する型(Utility Types)などをしばしば使います。
  ```tsx
  interface Todo {
    title: string
    description: string
    completed: boolean
  }
  // Todoのうち使いたいプロパティである"title"と"completed"のみの型を生成
  type TodoPreview = Pick<Todo, 'title' | 'completed'>

  const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
  }

  interface Todo {
    title: string
    description: string
    completed: boolean
    createdAt: number
  }
  // Todoのうち不要なプロパティである"description"を除外した型を生成
  type TodoPreview = Omit<Todo, 'description'>

  const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
    createdAt: 1615544252770,
  }
  ```
  - 他にも Utility Types は色々な種類がありますが、今回は時間がないので割愛します。
  - 気になる人は下記を見てみてください。
    [Documentation - Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)

## React

### コンポーネント

[コンポーネントと props - React](https://ja.reactjs.org/docs/components-and-props.html)

- React アプリケーションではコンポーネントと呼ばれるパーツを組み合わせてページを表示します。
- props と呼ばれる親コンポーネントからの任意の入力を受け取り、画面上に表示すべきものを記述する React 要素を返します。
- 関数コンポーネントとクラスコンポーネントがあり最近は関数コンポーネントが主流です。
  - 関数コンポーネントで簡単なコンポーネントを実装すると下記のようになります。
  - 変数や関数の結果は`{}` で囲って HTML 中に展開することができます。
  ```tsx
  function Welcome(props: { name: string }) {
    return <h1>Hello, {props.name}</h1>
  }
  ```
  - 下記のように他のコンポーネントから props の値を指定して呼び出すことができます。
  ```tsx
  function App() {
    return (
      <div>
        <Welcome name="Sara" />
        <Welcome name="Cahal" />
        <Welcome name="Edite" />
      </div>
    )
  }
  ```
- 上記の HTML のタグのようなものを JavaScript で扱う構文を JSX(TypeScript の場合は TSX)と言います。

### Hooks

- 関数コンポーネントにおいて、状態をもたせたりなど、クラスコンポーネントと同様の機能をもたせるためのものです。
- useXXXX という命名規則になっています。
- **useState**
  - 状態を保持、更新するための hook です。
  - `const [hoge, setHoge] = useState(初期値)` の形式で記述します。
  ```tsx
  import { useState } from 'react'
  const Counter = () => {
    const [count, setCount] = useState(0)
    return (
      <>
        <p>count: {count}</p>
        <button onClick={() => setCount((prevCount) => prevCount + 1)}></button>
      </>
    )
  }
  ```
- **useEffect**
  - 副作用フックと呼ばれる hook です。
  - コンポーネントのレンダリング後に副作用がある関数を実行したいときに使います。
    - `useEffect(副作用のある関数, 監視対象(省略可))` の形式で記述します。
    - DOM に対してアクセスや、API を遅延実行し、結果を setState したり様々な用途に使います。
    - 必要がある場合のみ関数を return することで unmount 時などにクリーンアップ関数を実行することができます。
    - 親コンポーネントから渡される Props の監視などにも使います。
    ```tsx
    // 親コンポーネントから受け取ったmessageIdの変更を監視してAPIリクエストして内容表示したい場合の例
    useEffect(() => {
      fetch(`/api/messages/${props.messageId}`)
        .then((response) => response.json())
        .then((json) => setMessage(json.content))
    }, props.messageId)

    // ブラウザバックや閉じるなどでのページ離脱時にアラートを出したい場合の例
    useEffect(() => {
      const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        event.preventDefault()
        event.returnValue = ''
      }
      window.addEventListener('beforeunload', handleBeforeUnload)
      // 別ページに遷移後にアラートを出したくないのでクリーンアップ
      // のためのremoveEventListenerを実行する関数をreturn
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
      }
    })
    ```
- 他の hooks などを知りたい人はこちらの記事の解説がわかりやすいです。
  [最近 React を始めた人向けの React Hooks 入門](https://sbfl.net/blog/2019/11/12/react-hooks-introduction/)

## Next.js

React のフレームワークなので基本的には React が分かればおおよそは書けますが、Next.js 特有な部分について解説していきます。

### ルーティング

[Routing: Dynamic Routes | Next.js](https://nextjs-ja-translation-docs.vercel.app/docs/routing/dynamic-routes)

- ディレクトリ構成ベースで自動的にルーティングされます。

  - 例えば`pages/users.tsx` というファイルを作成すると`/users` で表示できます。

- `[変数名]` で動的なルーティングも実現できます。
  - 例えば`pages/users/[id].tsx` というファイルを作成し`/users/1` のようにアクセスすることでユーザーごとの情報を出し分けて表示できます。
  - 下記のように`next/router` を用いて値を取得できます。
  ```tsx
  import { useRouter } from 'next/router'

  const User = () => {
    const router = useRouter()
    const { id } = router.query

    return <p>UserId: {id}</p>
  }
  ```

### Server Side Rendering(SSR), Static Site Generation(SSG)

[Basic Features: データ取得 | Next.js](https://nextjs-ja-translation-docs.vercel.app/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)

- SSR, SSG をサポートしていてページ単位で使いわけることもできます。
- SSR は`getServerSideProps` を用いて props にデータを渡します。
  - `getServerSideProps` はサーバーサイドでのみ実行されます。URL に直接アクセスした際の初回レンダリング時にはレンダリング済みの HTML が、Next.js アプリケーション内の遷移時には JSON としてデータが返ってきて Next.js が自動で処理してくれます。
  ```tsx
  function Page({ data }) {
    // データをレンダリングします...
  }

  // リクエストごとに呼び出されます。
  export async function getServerSideProps() {
    // 外部APIからデータを取得します。
    const res = await fetch(`https://.../data`)
    const data = await res.json()

    // データをprops経由でページに渡します。
    return { props: { data } }
  }

  export default Page
  ```
  [https://nextjs-ja-translation-docs.vercel.app/docs/basic-features/data-fetching#簡単な例-1](https://nextjs-ja-translation-docs.vercel.app/docs/basic-features/data-fetching#%E7%B0%A1%E5%8D%98%E3%81%AA%E4%BE%8B-1) より引用
  - SSG は`getStaticProps` および `getStaticPaths` という関数を用いて主にビルド時にデータ取得などを行います。
  ```tsx
  function Post({ post }) {
    // 記事をレンダリングします...
  }

  // この関数はビルド時に呼び出されます。
  export async function getStaticPaths() {
    // 外部APIエンドポイントを呼び出して記事を取得します。
    const res = await fetch('https://.../posts')
    const posts = await res.json()

    // 記事に基づいてプリレンダリングしたいパスを取得します
    const paths = posts.map((post) => ({
      params: { id: post.id },
    }))

    // ビルド時にこれらのパスだけをプリレンダリングします。
    // { fallback: false } は他のルートが404になることを意味します。
    return { paths, fallback: false }
  }

  // ビルド時にも呼び出されます。
  export async function getStaticProps({ params }) {
    // paramsは記事の`id`を含みます。
    // ルートが/posts/1のような時、params.id は1です。
    const res = await fetch(`https://.../posts/${params.id}`)
    const post = await res.json()

    // 記事データをprops経由でページに渡します。
    return { props: { post } }
  }

  export default Post
  ```
  - 今回は割愛しますが、SSG したいけど記事更新ごとに毎回ビルドじゃ間に合わないよ〜みたいな状況では Incremental Static Regeneration(ISR)が便利です。詳しくは下記の記事などがわかりやすいです。
    [Next.js における SSG（静的サイト生成）と ISR について（自分の）限界まで丁寧に説明する - Qiita](https://qiita.com/thesugar/items/47ec3d243d00ddd0b4ed)

## Apollo Client

- Next.js で利用する場合、`getServerSideProps` 内でクエリを実行したり、Hooks を用いてクエリを実行したりします。今回は Hooks について解説していきます。
- 今回は GraphQL の構文についての解説は時間の都合上割愛します。
  - 日本語のわかりやすい記事などもあるので、実際にクエリを書いていく際は見てみてください。
  [GraphQL のクエリを基礎から整理してみた - Qiita](https://qiita.com/shunp/items/d85fc47b33e1b3a88167)
- **Query**
  - REST でいう GET に近いものです。データの取得を行います。
  - `useQuery`という Hooks を使います。
    - アクセスした人の GitHub のリポジトリを表示しようとした場合下記のような実装になります。
      ```tsx
      const GET_VIEWER = gql`
          query {
            viewer {
              id
              name
              repositories(last: 5, privacy: PUBLIC) {
                nodes {
                  id
                  name
                  url
                }
              }
            }
          }
        `

        const { loading, error, data } = useQuery(GET_VIEWER)
        if(error) return <p>Error: {error.message}</p>

        return (
          <div>
              {loading ? (
                <p>読込中.....</p>
              ) : (
                <>
                  <p>
      							{data?.viewer.name}のpublicリポジトリ
      						</p>
                  <div>
                    {data?.viewer.repositories.nodes?.map((node) => {
                      return (
                        <a key={node?.id} href={node?.url}>
                          <h2>
                            {data.viewer.login} / {node?.name};
                          </h2>
                        </a>
                      )
                    })}
                  </div>
                </>
              )}
          </div>
        )
      }
      ```
  - しかし、上記のような実装ではレスポンスに型が付きません。
  - それを補うために、フロントエンドの開発の現場では**GraphQL Code Generator** というツールを使って型定義を自動生成するのが一般的です。
    [GraphQL Code Generator](https://www.graphql-code-generator.com/)
  - GraphQL Code Generator は GraphQL のスキーマ定義と自分が書いたクエリをもとに、各オブジェクトの型やクエリを実行する Hooks などを生成してくれます。
  - 上記のクエリを下記のようにファイルに切り出して、GraphQL Code Generator のコマンドを実行すると`useGetViewerQuery` という Hooks が生成され data に型が付きます。
    ```graphql
    # getViewer.graphql
    query getViewer {
      viewer {
        id
        login
        name
        repositories(last: 5, privacy: PUBLIC) {
          nodes {
            id
            name
            url
          }
        }
      }
    }
    ```

- **mutation**
  - REST でいう POST, PATCH, DELETE に相当します。データの登録、更新、削除を行います。
  - query と同じく`useMutation`という Hooks で実装できますが、型の問題であまり直接使う機会はないので割愛して、GraphQL Code Generator を用いて生成した Hooks について解説します。
  - まず以下のように mutation の graphql ファイルを作成します。
    ```graphql
    mutation createRepository($input: CreateRepositoryInput!) {
      createRepository(input: $input) {
        repository {
          id
          name
          url
        }
      }
    }
    ```
  - GraphQL Code Generator のコマンドを叩いて型定義を更新します。
  - 以下は input に入力した名前でリポジトリを作成するコードの例です。
    ```tsx
    import { useState } from 'react'
    import {
      useCreateRepositoryMutation,
      RepositoryVisibility,
      GetViewerDocument,
    } from '../lib/generated/graphql'

    const CreateRepoPage = () => {
      const [repositoryName, setRepositoryName] = useState('')
      const [createRepository] = useCreateRepositoryMutation()

      return (
        <div>
          <input
            type="text"
            value={repositoryName}
            onChange={(event) => {
              setRepositoryName(event.target.value)
            }}
          />
          <button
            onClick={async () => {
              try {
                await createRepository({
                  variables: {
                    input: {
                      name: repositoryName,
                      visibility: RepositoryVisibility.Public,
                    },
                  },
                  // キャッシュ更新のために再実行したいクエリを指定
                  refetchQueries: [GetViewerDocument],
                })
              } catch (error) {
                console.log(error)
              }
            }}
          >
            リポジトリ作成
          </button>
        </div>
      )
    }
    ```

# ハンズオン編

- まずは README に従って環境を立ち上げて見ましょう。

- 今回のハンズオンでは GitHub の`search`クエリを用いて任意のリポジトリを検索し、`addStar` mutation でスターをつけます。
  - 一連の流れは PR にしていますので変更内容がわからなくなった場合はコミットログを見てみてください。
    - https://github.com/zuckey117/next-apollo-hands-on/pull/1
- まずは下記のようにリポジトリの検索クエリを作成します。
  ```graphql
  # lib/graphql/searchRepositories.graphql
  query searchRepositories($keyword: String!) {
    search(type: REPOSITORY, query: $keyword, first: 10) {
      nodes {
        ... on Repository {
          id
          name
          url
        }
      }
    }
  }
  ```
  - クエリを作成する際は下記を使うとリファレンスを見ながら動作を試せるので便利です。
    [Explorer - GitHub Docs](https://docs.github.com/en/graphql/overview/explorer)
- `yarn generate` で型定義と Hooks の更新を行います。
- 次に下記の用にページの実装を行います。
  ```tsx
  // pages/repositories.tsx
  import { useState } from 'react'
  import { useSearchRepositoriesQuery, Repository } from '../lib/generated/graphql'

  const Repositories = () => {
    const [keyword, setKeyword] = useState('')

    const { loading, error, data } = useSearchRepositoriesQuery({ variables: { keyword } })
    if (error) {
      return <p>{error.message}</p>
    }
    return (
      <main>
        <h1>リポジトリ検索</h1>
        <label>
          キーワード
          <input
            type="text"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
            }}
          />
        </label>

        {loading ? (
          <h2>読込中.....</h2>
        ) : (
          <>
            <h2>検索結果</h2>
            <div>
              {data?.search.nodes?.map((node) => {
                // GraphQLのUnion型の型がうまくTSの型に変換されなかったので苦肉のas....ごめんなさい...
                const repository = node as Repository
                return (
                  <a key={repository.id} href={repository.url}>
                    <p>{repository.url}</p>
                  </a>
                )
              })}
            </div>
          </>
        )}
      </main>
    )
  }

  export default Repositories
  ```
- 次にスターの実装を行っていきます。
- まずは`viewerHasStarred` というフィールドを先程のクエリに追加します。
  ```graphql
  # lib/graphql/searchRepositories.graphql
  # 省略
  			... on Repository {
          id
          name
          url
  				viewerHasStarred
        }
  # 省略
  ```
- 次にスターを追加する mutation を作成します。
  ```graphql
  # lib/graphql/addStar.graphql
  mutation addStar($input: AddStarInput!) {
    addStar(input: $input) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
  ```
- repositories.tsx の検索結果を返してる return を下記のように書き換えます。(※ `<> </>` で囲ったのは JSX では 1 つの root タグを返す必要があるためです。)

  ```tsx
  //pages/repositories.tsx
  // 省略
  return (
    <a key={repository.id} href={repository.url}>
      <p>
        <button>{repository.viewerHasStarred ? '★' : '☆'}</button>
        {repository.url}
      </p>
    </a>
  )
  // 省略
  ```

- `../lib/generated/graphql` からの import に`useAddStarMutation` , `SearchRepositoriesDocument` を追加します。

  ```tsx
  // pages/repositories.tsx
  // 省略

  import {
    useSearchRepositoriesQuery,
    Repository,
    useAddStarMutation,
    SearchRepositoriesDocument,
  } from '../lib/generated/graphql'

  // 省略
  ```

- Repositories の関数内に`const [addStar] = useAddStarMutation()` と追加します。
  ```tsx
  // pages/repositories.tsx
  // 省略
  const Repositories = () => {
    const [keyword, setKeyword] = useState('')
    const { loading, error, data } = useSearchRepositoriesQuery({ variables: { keyword } })
    const [addStar] = useAddStarMutation()
  // 省略
  ```
- button タグを下記のように書き換えます。
  ```tsx
  // pages/repositories.tsx
  // 省略
  ;<button
    onClick={(event) => {
      event.preventDefault()
      try {
        addStar({
          variables: {
            input: { starrableId: repository.id },
          },
          refetchQueries: [SearchRepositoriesDocument],
        })
      } catch (error) {
        console.log(error)
      }
    }}
  >
    {repository.viewerHasStarred ? '★' : '☆'}
  </button>
  {
    repository.url
  }
  // 省略
  ```
- これでボタンをクリックしたリポジトリにスターを付けることができます。
- ハンズオンは以上です。サクサク進んで時間が余った人は`removeStar` mutation を用いたスターの削除も実装してみましょう！

## 事前準備

- node.js のインストールをお願いします。
  - 複数のリポジトリの開発を行う場合、要求される node のバージョンが異なることが多いため、nodenv を用いたインストールを強く推奨します。
    [nodenv の環境構築 - Qiita](https://qiita.com/282Haniwa/items/a764cf7ef03939e4cbb1)
    - rbenv など複数の〇〇 env を使ってる場合は anyenv 経由でのインストールがおすすめです。
  - node14 以降が手元に入っている場合今回はスキップでも OK です。
  - node.js なんか普段使わんし知らんわ！という方はインストーラーを使っても大丈夫です。
    [ダウンロード | Node.js](https://nodejs.org/ja/download/)
- node を入れたら`npm install -g yarn` で yarn をインストールしてください。
- 不明点があればサポートするので@zuckey までメンションしてください。
- https://github.com/zuckey117/next-apollo-hands-on をクローンしておいてください。準備は以上です。

# おすすめ資料・便利ツール

## フロントエンド全般

- Can I use...
  - HTML, CSS, JS などの各種機能のブラウザ実装状況が一括で確認できます。
  [Can I use... Support tables for HTML5, CSS3, etc](https://caniuse.com/)

- JSer.info
  - JS 関連の各種最新情報を日本語で追える便利ブログです。
  [JSer.info](https://jser.info/)

## JavaScript

### Promise, async/await

- [JavaScript Promise の本](https://azu.github.io/promises-book/)
- [JavaScript での非同期処理の基本 - 🐾 Nekonote](https://scrapbox.io/dojineko/JavaScript_%E3%81%A7%E3%81%AE%E9%9D%9E%E5%90%8C%E6%9C%9F%E5%87%A6%E7%90%86%E3%81%AE%E5%9F%BA%E6%9C%AC)

## TypeScript

- TypeScript Deep Dive
  - 日本語訳
    [TypeScript Deep Dive 日本語版について](https://typescript-jp.gitbook.io/deep-dive/)
  - 英語原本
    [README](https://basarat.gitbook.io/typescript/)
- uhyo さんの型の解説記事
  [TypeScript の型入門 - Qiita](https://qiita.com/uhyo/items/e2fdef2d3236b9bfe74a)

## React

- React Docs BETA - Learn React
  [Quick Start](https://beta.reactjs.org/learn)
  - 英語ドキュメントですが、関数コンポーネント前提で書かれていて今どきの React の書き方のみを効率的に学ぶことができます。

## Next.js

- 公式のドキュメントがわかりやすいです。
  [Getting Started | Next.js](https://nextjs.org/docs/getting-started)
  - 非公式ですが日本語訳もあります
  [はじめに | Next.js](https://nextjs-ja-translation-docs.vercel.app/docs/getting-started)
