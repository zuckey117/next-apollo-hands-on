import { useState } from 'react'
import {
  useSearchRepositoriesQuery,
  Repository,
  useAddStarMutation,
  SearchRepositoriesDocument,
} from '../lib/generated/graphql'

const Repositories = () => {
  const [keyword, setKeyword] = useState('react')

  const { loading, error, data } = useSearchRepositoriesQuery({ variables: { keyword } , ssr: true})
  const [addStar] = useAddStarMutation()
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
                <>
                  <a key={repository.id} href={repository.url}>
                    <p>
                      <button
                        onClick={(event) => {
                          event.preventDefault()
                          try {
                            addStar({
                              variables: {
                                input: { starrableId: repository.id },
                              },
                              // refetchQueries: [SearchRepositoriesDocument],
                            })
                          } catch (error) {
                            console.log(error)
                          }
                        }}
                      >
                        {repository.viewerHasStarred ? '★' : '☆'}
                      </button>
                      {repository.url}
                    </p>
                  </a>
                </>
              )
            })}
          </div>
        </>
      )}
    </main>
  )
}

export default Repositories
