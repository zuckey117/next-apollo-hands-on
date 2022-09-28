import { FC } from 'react'
import Link from 'next/link'
const Index: FC = () => {
  return (
    <>
    <h1>ハンズオン一覧</h1>
    <h2>
        <Link href="next-apollo-hands-on/">
          <a>→Next.js + Apollo Cliet概要ハンズオン</a>
        </Link>
      </h2>
      <h2>
        <Link href="next-hands-on/">
        <a>→Next.jsハンズオン</a>
        </Link>
      </h2>
    </>
  )
}

export default Index
