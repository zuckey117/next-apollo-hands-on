# Next.jsハンズオン

# はじめに

- Next.jsで開発されているフロントエンドの軽微な修正は雰囲気でできるけど細かいところはよくわからないくらいのレベル感の方を対象にしています。
- JavaScript が読み書きできることを前提に本文を書いています。
    - JavaScript 全然知らないよという人は下記などで一通り勉強するのをおすすめします。
    - 書籍の内容を著者の[azu](https://twitter.com/azu_re)さん、[lacolaco](https://twitter.com/laco2net)さんがインターネットに全編公開してくださっている神資料です。
    [JavaScript Primer - 迷わないための入門書 #jsprimer](https://jsprimer.net/)
- 既存のコードを読んだり、手を加えていくのに加えて、新規ページの実装に必要になりそうな知識も紹介していますが、細かい部分は適宜公式ドキュメントなどを参照することをおすすめします。
- TypeScript全然わからない...という人は[Next.js, Apollo Client概要](/NEXT-APOLLO-SUMMARY.md)の資料も見てみて下さい。

# 講義編

## Next.js って何？

[Next.js by Vercel - The React Framework](https://nextjs.org/)

- Vercel が開発を行っている React.js のフレームワークです。
    - サーバーサイドレンダリングや静的サイトジェネレーターやルーティング周りなど、React の機能をベースにより開発体験を向上させてくれます。
    - TypeScript との親和性も高く、型安全に開発を行うことができます。

## React

### コンポーネント

[コンポーネントと props - React](https://ja.reactjs.org/docs/components-and-props.html)

- React アプリケーションではコンポーネントと呼ばれるパーツを組み合わせてページを表示します。
- 関数コンポーネントとクラスコンポーネントの2種類あり、現在は関数コンポーネントが主流です。
- props と呼ばれる親コンポーネントからの任意の入力を受け取り、画面上に表示すべきものを記述する React 要素を返します。
- 詳しくは上記の公式ドキュメントを見てください。

### Hooks

- 関数コンポーネントにおいて、状態をもたせたりなど、クラスコンポーネントと同様の機能をもたせるためのものです。
- useXXXX という命名規則になっています。
- 自前のhooksを定義することもできます。
    - 複雑なロジックがある場合などにhooks内にロジックを閉じ込めることができてテストなどの観点からも便利です。
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
        - useEffect内でのstateの更新は**無限ループにならないよう注意が必要**です。
        
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
          // のためにremoveEventListenerを実行する関数をreturn
          return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
          }
        })
        
        ```
        
- **useMemo**
    - `useMemo(重い処理のある関数, 監視対象(省略可))` という形で記述します。
        
        ```tsx
        const sortedData = useMemo(()=>{
          if(sort === 'desc') {
            return data.reverse()
          }else {
            return data.sort()
          }
        }, [data, sort])
        ```
        
    - とはいえフロントエンドで重たい処理をすることはあまり多くないので`useMemo`は`React.Memo`と併用してコンポーネントの再レンダリングの抑制に使うことが多いです。下記のQiita記事などがわかりやすいので良かったら見てみてください。
        - [結局useMemoはいつ使えばいいの？　僕の決定版](https://qiita.com/uhyo/items/5258e04aba380531455a)
- **useCallback**
    - useMemoの亜種で関数をメモ化します。
        - `useCallback(fn, deps)` は `useMemo(() => fn, deps)` と等価です。
    - useMemo同様にパフォーマンス改善のために使うことが多いです。
    - カスタムhookを定義する際はuseCallbackを使うことが多いです。

- 他の hooks などを知りたい人はこちらの記事の解説がわかりやすいです。
    - [React hooksを基礎から理解する](https://qiita.com/seira/items/f063e262b1d57d7e78b4)

## Next.js

React のフレームワークなので基本的には React が分かればおおよそは書けますが、Next.js 特有な部分について解説していきます。

### ルーティング

[Routing: Dynamic Routes | Next.js](https://nextjs-ja-translation-docs.vercel.app/docs/routing/dynamic-routes)

- ディレクトリ構成ベースで自動的にルーティングされます。
    - 例えば`pages/users.tsx` というファイルを作成すると`/users` で表示できます。
- `[変数名]` で動的なルーティングも実現できます。
    - 例えば`pages/users/[userId]/articles/[articleId].tsx` というファイルを作成し`/users/1/articles/3` のようにアクセスすることで情報を出し分けて表示できます。
    - 下記のように`next/router` を用いて値を取得できます。
    
    ```tsx
    import { useRouter } from 'next/router'
    
    const User = () => {
      const router = useRouter()
      const { userId, articleId } = router.query
    
      return <p>UserId: {id}, articleId: {articleId}</p>
    }
    
    ```
    

### Server Side Rendering(SSR), Static Site Generation(SSG), and more…

- **CSR(Client Side Rendering)**
    - ブラウザでJavaScriptが実行されて画面が描画されます。クライアントの性能に大きく影響を受けます。
    - SEOに関してはクローラーがちゃんと読んでくれないと言われていました。(現在は基本的に問題ないです)
        - SNSなどのOGP表示は未だに問題があるはず..…
- **SSR(Server Side Rendering)**
    - サーバサイドでAPIなどのコールを行いレンダリング済みのHTMLをブラウザに返します。
    - Next.jsでは`getServerSideProps` を用いて実装します。
        
        ```tsx
        function Page({ data }) {
          // データをレンダリングします...
        }
        
        // リクエストごとに呼び出されます。
        export const getServerSideProps = async () => {

          // 外部APIからデータを取得します。
          const res = await fetch(`https://.../data`)
          const data = await res.json()
        
          // データをprops経由でページに渡します。
          return { props: { data } }
        }
        
        export default Page
        
        ```
        
    - `getServerSideProps` はサーバーサイドでのみ実行されます。URL に直接アクセスした際の初回レンダリング時にはレンダリング済みの HTML が、Next.js アプリケーション内の遷移時には JSON としてデータが返ってきて Next.js が自動で処理してくれます。
    - サーバーにそれなりに負荷がかかるのでCDNを経由することも多いです。
- **SSG(Static Site Generation)**
    - ビルド時にHTMLを構築しておく手法です。
    - SSG は`getStaticProps` および `getStaticPaths` という関数を用いてビルド時にデータ取得などを行います。
        
        ```tsx
        function Post({ post }) {
          // 記事をレンダリングします...
        }
        
        // この関数はビルド時に呼び出されます。
        export const getStaticPaths = async () => {
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
        export const getStaticProps = async ({ params }) => {
          // paramsは記事の`id`を含みます。
          // ルートが/posts/1のような時、params.id は1です。
          const res = await fetch(`https://.../posts/${params.id}`)
          const post = await res.json()
        
          // 記事データをprops経由でページに渡します。
          return { props: { post } }
        }
        
        export default Post
        
        ```
        
- **ISR(Incremental Static Regeneration)**
    - SSGと同様にビルド時にHTMLの構築も行いますが、指定した時間経過後は再度データフェッチなどを行います。
    - 指定時間経過後最初のアクセスは**ビルド済みの古いHTML**がクライアントに返されつつ、サーバサイドでデータフェッチしてHTMLを再構築します。
        
        ```tsx
        export async function getStaticProps() {
          const res = await fetch('https://.../posts');
          const posts = await res.json();
          return {
            props: {
              posts
            },
            // 指定した秒数経過後はサーバーサイドでfetchが実行されます
            revalidate: 100 
          };
        }
        ```
        

# ハンズオン編

- まずは README に従って環境を立ち上げて見ましょう。
- 今回のハンズオンではhooksや各種レンダリング手法の動作を実際に手を動かしながら学びます。
    - 一連の流れは PR にしていますので変更内容がわからなくなった場合はコミットログを見てみてください。
        - [https://github.com/zuckey117/next-apollo-hands-on/pull/1](https://github.com/zuckey117/next-apollo-hands-on/pull/1)

### hooks編

- まずは下記のようにtsxファイルを作成します。
    
    ```tsx
    // pages/next-hands-on/use-effect.tsx
    
    import { FC, useEffect } from 'react'
    
    const UseEffect: FC = () => {
      console.log('this log is run on both client and server side. ')
      useEffect(() => {
        console.log('this log is run only client.')
      })
      return <div>useEffect hands on</div>
    }
    
    export default UseEffect
    ```
    
    - `useEffect` 内の`console.log` はブラウザのみで実行されているのがわかります。
    
- 次に依存配列のあるuseEffectの挙動を見ていきます。下記のようにファイルを書き換えてみてください。
    
    ```tsx
    // pages/next-hands-on/use-effect.tsx
    
    import { FC, useEffect, useState } from 'react'
    
    const UseEffect: FC = () => {
      const [postCode, setPostCode] = useState('')
      console.log('this log is run on both client and server side. ')
      useEffect(() => {
        console.log('this log is run only client.')
      })
      useEffect(() => {
        console.log('post code is changed.')
        if (postCode.length === 7)
          fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postCode}`)
            .then((response) => {
              return response.json()
            })
            .then((data) => {
              alert(data.results[0].address1 + data.results[0].address2 + data.results[0].address3)
            })
      }, [postCode])
      return (
        <>
          <div>useEffect hands on</div>
          <label>
            郵便番号
            <input type="text" value={postCode} onChange={(e) => setPostCode(e.currentTarget.value)} />
          </label>
        </>
      )
    }
    
    export default UseEffect
    ```
    
- 次にuseEffectの無限ループについて見ていきます。下記のようにファイルを作成してください。

```tsx
pages/next-hands-on/use-effect-infinite-loop.tsx

import { FC, useEffect, useState } from 'react'

const UseEffect: FC = () => {
  const [value, setValue] = useState<{ key1: string | null; key2: string | null } | null>(null)
  useEffect(() => {
    window.localStorage.setItem('key1', 'value1')
    window.localStorage.setItem('key2', 'value2')
  }, [])
  
  const getLocalStorageValue = (key: string) => {
    return window.localStorage.getItem(key)
  }

  useEffect(() => {
    console.log('useEffect is called')
    setValue({ key1: getLocalStorageValue('key1'), key2: getLocalStorageValue('key2') })
  }, [getLocalStorageValue])
  return (
    <>
      <div>useEffect inifinite loop</div>
      <p>key1: {value?.key1}</p>
      <p>key2: {value?.key2}</p>
    </>
  )
}

export default UseEffect
```

- ブラウザのコンソールを開くと `useEffect`が何度も呼ばれていることがわかります。
- これを回避するために`getLocalStorageValue` を`useCallback`でラップしてみてください。

### レンダリング編

- まずはSSRの挙動を見ていきましょう。下記のようにファイルを作成してください。
    
    ```tsx
    pages/next-hands-on/ssr.tsx
    
    import { FC } from 'react'
    import { GetServerSideProps } from 'next'
    
    type Props = {
      postCode: string
      address: string
    }
    const Ssr: FC<Props> = ({ postCode, address }) => {
      return (
        <>
          <p>郵便番号: {postCode}</p>
          <p>住所: {address}</p>
        </>
      )
    }
    
    export const getServerSideProps: GetServerSideProps<Props> = async () => {
      console.log('getServerSideProps is called only server side.')
      const postCode = '1066190'
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postCode}`)
      const data = await res.json()
    
      return {
        props: {
          postCode,
          address: data.results[0].address1 + data.results[0].address2 + data.results[0].address3,
        },
      }
    }
    
    export default Ssr
    ```
    
    - 右クリックして、ページのソースを表示をクリックすると郵便番号と住所が出力されたHTMLがブラウザに返されていることがわかります。
- 次にSSGの挙動を見ていきましょう。 下記のようにファイルを作成してください。
    
    ```tsx
    //pages/next-hands-on/ssg/[postCode].tsx
    
    import { FC } from 'react'
    import { GetStaticProps } from 'next'
    
    type Params = {
      postCode: string
    }
    type Props = {
      postCode: string
      address: string
    }
    const Ssg: FC<Props> = ({ postCode, address }) => {
      return (
        <>
          <p>郵便番号: {postCode}</p>
          <p>住所: {address}</p>
        </>
      )
    }
    export const getStaticPaths = async () => {
      const ssgPostCodes = ['1066190', '1066118', '1066143']
      const paths = ssgPostCodes.map((postCode) => ({
        params: { postCode: postCode },
      }))
    
      // ビルド時にこれらのパスだけをプリレンダリングします。
      // { fallback: false } は他のルートが404になることを意味します。
      return { paths, fallback: false }
    }
    
    export const getStaticProps: GetStaticProps<Props,Params > = async ({ params }) => {
      const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${params?.postCode}`)
      const data = await res.json()
    
      return {
        props: {
          postCode: params?.postCode ?? '',
          address: data.results[0].address1 + data.results[0].address2 + data.results[0].address3,
        },
      }
    }
    
    export default Ssg
    ```
    
    - `yarn build` でビルドを行うと下記のようにビルドのログが出力されます。
        
        ```bash
        ├ ● /next-hands-on/ssg/[postCode] (1321 ms)  362 B           119 kB
        ├   ├ /next-hands-on/ssg/1066118 (442 ms)
        ├   ├ /next-hands-on/ssg/1066143 (440 ms)
        ├   └ /next-hands-on/ssg/1066190 (439 ms)
        ```
        
    - .next/server/pages/next-hands-on/ssg/ を見るとHTMLが生成されていることがわかります。
    - `yarn start` で実際に動かしてみて上記の郵便番号のページが表示できて、その他のページが404になることを確認しましょう。

以上でハンズオンは終わりです！

これであなたもフロントエンドエンジニアの仲間入りです！！！