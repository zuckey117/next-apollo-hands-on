import { FC, useEffect } from 'react'

const UseEffect: FC = () => {
  console.log('this log is run on both client and server side. ')
  useEffect(() => {
    console.log('this log is run only client.')
  })
  return <div>useEffect hands on</div>
}

export default UseEffect
