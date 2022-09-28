import type { NextPage } from 'next'
import { useState } from 'react'
import styles from '../../styles/Home.module.css'
import {
  useGetViewerQuery,
  useCreateRepositoryMutation,
  RepositoryVisibility,
  GetViewerDocument,
} from '../../lib/generated/graphql'

const Home: NextPage = () => {
  const [repositoryName, setRepositoryName] = useState('')

  const { loading, error, data } = useGetViewerQuery()
  const [createRepository] = useCreateRepositoryMutation()
  if (error) {
    return <p>{error.message}</p>
  }
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to Next.js!</h1>
        {loading ? (
          <p>読込中.....</p>
        ) : (
          <>
            <p className={styles.description}>Hello {data?.viewer.name}!</p>
            <p className={styles.description}>あなたのpublicリポジトリ</p>
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
            <div className={styles.grid}>
              {data?.viewer.repositories.nodes?.map((node) => {
                return (
                  <a key={node?.id} href={node?.url} className={styles.card}>
                    <h2>
                      {data.viewer.login} / {node?.name} &rarr;
                    </h2>
                  </a>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Home
