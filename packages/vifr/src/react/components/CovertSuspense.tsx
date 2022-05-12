import {
  useContext,
  useId,
  Suspense,
  useState,
  useRef,
  useEffect,
  useMemo,
  memo,
  useLayoutEffect
} from 'react'
import type { ReactElement, SuspenseProps } from 'react'
import { ServerSideContext } from '../entry'

export interface CovertSuspenseProps {
  children: ReactElement
  fallback?: SuspenseProps['fallback']
}

export function useCovertData(fn: (...args: unknown[]) => unknown) {
  const ctx = useContext(ServerSideContext)
  const id = useId()
  const fieldId = `__VIFR_COVERT_ID_${id.replace(/:/g, '$')}__`
  if (ctx !== null) {
    return ctx.throwCovertData(fieldId, fn)
  }
  // todo: Object.freeze 限制用户操作__VIFR_COVERT_DATA__
  const vifrCovertData = window?.__VIFR_COVERT_DATA__ || {}
  const coverDataRef = useRef(vifrCovertData[fieldId])
  useEffect(() => {
    Reflect.deleteProperty(vifrCovertData, fieldId)
  }, [])
  return coverDataRef.current
}

export function CovertSuspense({
  children,
  fallback
}: CovertSuspenseProps): JSX.Element {
  const updateRef = useRef(false)
  const [update, setUpdate] = useState(false)
  console.log('CovertSuspense 渲染', update, updateRef.current)
  const propsAreEqual = () => {
    console.log('判断', update, updateRef.current)
    if (updateRef.current) {
      console.log('判断1', update, updateRef.current)
      return false
    }
    console.log('判断2', update, updateRef.current)
    return true
  }
  const Bar = useMemo(() => {
    return memo(({ children }: Pick<CovertSuspenseProps, 'children'>) => {
      const ctx = useContext(ServerSideContext)
      useLayoutEffect(() => {
        if (ctx === null) {
          updateRef.current = true
          setUpdate(true)
        }
      }, [])
      if (ctx !== null) {
        console.log('服务端渲染')
      } else {
        console.log('客户端渲染', children)
      }
      return <>{children}</>
    }, propsAreEqual)
  }, [])
  const Foo = useMemo(() => {
    return memo(({ children }: Pick<CovertSuspenseProps, 'children'>) => {
      return (
        <>
          <Suspense fallback={fallback}>
            <Bar>{children}</Bar>
          </Suspense>
        </>
      )
    }, propsAreEqual)
  }, [])
  return (
    <>
      <Foo>{children}</Foo>
    </>
  )
}
