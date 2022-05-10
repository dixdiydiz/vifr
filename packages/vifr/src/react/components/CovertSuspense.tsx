import {
  useContext,
  useId,
  Suspense,
  useRef,
  useEffect,
  useMemo,
  memo,
  useCallback,
  cloneElement
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

// function Cover(): JSX.Element {
//   const ctx = useContext(ServerSideContext)
//   if (ctx !== null) {
//
//   }
// }

export function CovertSuspense({
  children,
  fallback
}: CovertSuspenseProps): JSX.Element {
  const serverChildren = useMemo(() => {
    return cloneElement(children)
  }, [])
  const fallbackMemo = useMemo(() => fallback, [])
  const Bar = useCallback(() => {
    const cloneChild = cloneElement(children)
    const ctx = useContext(ServerSideContext)
    if (ctx !== null) {
      console.log('服务端渲染')
    } else {
      console.log('客户端渲染')
    }
    console.log('一起渲染')
    return <>{children}</>
  }, [])
  const Foo = useMemo(() => {
    return memo(
      () => {
        return (
          <>
            <Suspense fallback={fallbackMemo}>
              <Bar />
            </Suspense>
          </>
        )
      },
      () => {
        return false
      }
    )
  }, [])
  return (
    <>
      {/*<Suspense fallback={fallbackMemo}>{children}</Suspense>*/}
      <Foo />
    </>
  )
}
