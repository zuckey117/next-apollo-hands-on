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
