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
