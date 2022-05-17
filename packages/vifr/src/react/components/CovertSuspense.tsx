import { useContext, Suspense, useState, useRef, useMemo, memo } from 'react'
import type { ReactElement, SuspenseProps, CSSProperties } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks'
import { ServerSideContext } from '../entry'

export interface CovertSuspenseProps {
  children: ReactElement
  fallback?: SuspenseProps['fallback']
  style?: CSSProperties
  [prop: string]: any
}

export function CovertSuspense({
  children,
  fallback,
  ...restProps
}: CovertSuspenseProps): JSX.Element {
  const updateRef = useRef(false)
  const [_, setUpdate] = useState(false)
  const propsAreEqual = () => {
    if (updateRef.current) {
      return false
    }
    return true
  }
  const ChildrenWrap = useMemo(() => {
    return memo(
      ({
        children,
        ...rest
      }: Pick<CovertSuspenseProps, 'children' | 'style'>) => {
        const ctx = useContext(ServerSideContext)
        useIsomorphicLayoutEffect(() => {
          if (ctx === null) {
            updateRef.current = true
            setUpdate(true)
          }
        }, [])
        return (
          <>
            <div
              {...rest}
              style={Object.assign(
                {},
                rest.style,
                !updateRef.current && { display: 'none' }
              )}
            >
              {children}
            </div>
          </>
        )
      },
      propsAreEqual
    )
  }, [])
  const SuspenseWrap = useMemo(() => {
    return memo(
      ({ children, ...rest }: Pick<CovertSuspenseProps, 'children'>) => {
        return (
          <>
            <Suspense fallback={fallback}>
              <ChildrenWrap {...rest}>{children}</ChildrenWrap>
            </Suspense>
          </>
        )
      },
      propsAreEqual
    )
  }, [])
  return (
    <>
      <SuspenseWrap {...restProps}>{children}</SuspenseWrap>
    </>
  )
}
