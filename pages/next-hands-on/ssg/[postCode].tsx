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
  const ssgPostCodes = ['1066118', '1066143', '1066190']
  const paths = ssgPostCodes.map((postCode) => ({
    params: { postCode: postCode },
  }))

  // ビルド時にこれらのパスだけをプリレンダリングします。
  // { fallback: false } は他のルートが404になることを意味します。
  return { paths, fallback: false }
}

export const getStaticProps: GetStaticProps<Props, Params> = async ({ params }) => {
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
