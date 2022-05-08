import { useContext, useId, Suspense, useRef, useEffect } from 'react'
import type { ReactNode, SuspenseProps } from 'react'
import { ServerSideContext } from '../entry'

export interface CovertSuspenseProps {
  children: ReactNode
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
  return (
    <>
      <Suspense fallback={fallback}>{children}</Suspense>
    </>
  )
}
