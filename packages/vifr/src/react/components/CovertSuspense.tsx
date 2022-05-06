import * as React from 'react'

export interface CovertSuspenseProps {
  children: React.ReactNode
  fallback?: React.SuspenseProps['fallback']
}

export function usecovertData(fn: () => Promise<any>) {}

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
