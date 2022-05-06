import * as React from 'react'
import { ServerSideContext } from '../entry'

export interface CovertSuspenseProps {
  children: React.ReactNode
  fallback?: React.SuspenseProps['fallback']
}

export function useCovertData(fn: (...args: unknown[]) => unknown) {
  const ctx = React.useContext(ServerSideContext)
  const id = React.useId()
  if (ctx !== null) {
    ctx.getCovertData(fn, id)
  }
  const data = React.useMemo(() => {
    // @ts-ignore
    const vifrCovertData = window.__VIFR_COVERT_DATA__
    const result = vifrCovertData[id]
    vifrCovertData[id] = null
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
      <React.Suspense fallback={fallback}>{children}</React.Suspense>
    </>
  )
}
