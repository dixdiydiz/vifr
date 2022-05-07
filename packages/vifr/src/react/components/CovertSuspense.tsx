import { useContext, useId, useMemo, Suspense } from 'react'
import type { ReactNode, SuspenseProps } from 'react'
import { ServerSideContext } from '../entry'

export interface CovertSuspenseProps {
  children: ReactNode
  fallback?: SuspenseProps['fallback']
}

export const coverDataMap = new WeakMap()

export function useCovertData(fn: (...args: unknown[]) => unknown) {
  const ctx = useContext(ServerSideContext)
  const id = useId()
  if (ctx !== null) {
    ctx.throwCovertData(id, fn)
  }
  console.log('useCovertData', id)
  const data = useMemo(() => {
    const vifrCovertData = window.__VIFR_COVERT_DATA__
    const result = vifrCovertData[id]
    Reflect.deleteProperty(vifrCovertData, id)
    return result
  }, [])
  return data
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
