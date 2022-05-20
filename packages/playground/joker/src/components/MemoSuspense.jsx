import { Suspense, useState, useRef, useMemo, memo } from 'react'
import { useIsomorphicLayoutEffect } from 'vifr/react'

export default function CovertSuspense({ children, fallback, ...restProps }) {
  const updateRef = useRef(false)
  const [_, setUpdate] = useState(false)
  const propsAreEqual = () => {
    if (updateRef.current) {
      return false
    }
    return true
  }
  const ChildrenWrap = useMemo(() => {
    return memo(({ children, ...rest }) => {
      useIsomorphicLayoutEffect(() => {
        updateRef.current = true
        setUpdate(true)
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
    }, propsAreEqual)
  }, [])
  const SuspenseWrap = useMemo(() => {
    return memo(({ children, ...rest }) => {
      return (
        <>
          <Suspense fallback={fallback}>
            <ChildrenWrap {...rest}>{children}</ChildrenWrap>
          </Suspense>
        </>
      )
    }, propsAreEqual)
  }, [])
  return (
    <>
      <SuspenseWrap {...restProps}>{children}</SuspenseWrap>
    </>
  )
}
