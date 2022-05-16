import {
  useContext,
  useId,
  Suspense,
  useState,
  useRef,
  useEffect,
  useMemo,
  memo
} from 'react'
import type { ReactElement, SuspenseProps, CSSProperties } from 'react'
import { useIsomorphicLayoutEffect } from '../hooks'
import { ServerSideContext } from '../entry'

export interface CovertSuspenseProps {
  children: ReactElement
  fallback?: SuspenseProps['fallback']
  style?: CSSProperties
  [prop: string]: any
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
