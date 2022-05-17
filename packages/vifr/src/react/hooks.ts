import { useContext, useEffect, useId, useLayoutEffect, useRef } from 'react'
import { ServerSideContext } from './entry'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

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
