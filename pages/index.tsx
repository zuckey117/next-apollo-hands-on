import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { useGetViewerQuery } from '../lib/generated/graphql'

const Home: NextPage = () => {
  const { loading, error, data } = useGetViewerQuery()
  if(error) {
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
            <div className={styles.grid}>
              
              {data?.viewer.repositories.nodes?.map((node) => {
                return (
                  <a key={node?.id} href={node?.url} className={styles.card}>
                    <h2>{data.viewer.login} / {node?.name} &rarr;</h2>
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
