import { FC } from 'react'
import Link from 'next/link'

const Index: FC = () => {
  const ssgPostCodes = ['1066118', '1066143', '1066190']
  return (
    <>
      <h2>ハンズオン作成ページリンク</h2>
      <h3>React Hooks</h3>
      <p>
        <Link href="/next-hands-on/use-effect">
          <a>→useEffect</a>
        </Link>
      </p>
      <h3>Next.js</h3>
      <p>
        <Link href="/next-hands-on/ssr">
          <a>→SSR</a>
        </Link>
      </p>
      <h4>↓SSG</h4>
      {ssgPostCodes.map((v) => {
        return (
          <p key={v}>
            <Link href={`/next-hands-on/ssg/${v}`}>
              <a>〒{v}</a>
            </Link>
          </p>
        )
      })}
      <p>
            <Link href={`/next-hands-on/ssg/1066100`}>
              <a>〒1066100(Not Found)</a>
            </Link>
          </p>
    </>
  )
}

export default Index
