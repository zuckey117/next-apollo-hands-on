import { FC, useEffect, useState, useCallback } from 'react'

const UseEffectInfiniteLoop: FC = () => {
  const [value, setValue] = useState<{ key1: string | null; key2: string | null } | null>(null)
  useEffect(() => {
    window.localStorage.setItem('key1', 'value1')
    window.localStorage.setItem('key2', 'value2')
  }, [])
  
  const getLocalStorageValue = useCallback((key: string) => {
    return window.localStorage.getItem(key)
  }, [])

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

export default UseEffectInfiniteLoop
