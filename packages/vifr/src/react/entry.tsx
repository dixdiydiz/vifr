import type { ServerResponse } from 'http'
import { createContext, useMemo } from 'react'
import type { ReactNode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { hydrateRoot } from 'react-dom/client'
import { StaticRouter } from 'react-router-dom/server'
import { BrowserRouter } from 'react-router-dom'
import { isFunction } from './utils'
import { CLIENT_ENTRY } from '../constant'
import { useCallback } from 'react'

declare global {
  interface Window {
    __VIFR_COVERT_DATA__: Record<string, any>
  }
}

/**
 * copy from https://github.com/facebook/react/blob/9ae80d6a2bf8f48f20e3d62b9672f21c1ff77bd8/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L35
 */
export interface RenderToPipeableStreamOptions {
  identifierPrefix?: string
  namespaceURI?: string
  nonce?: string
  bootstrapScriptContent?: string
  bootstrapScripts?: Array<string>
  bootstrapModules?: Array<string>
  progressiveChunkSize?: number
  onShellReady?: () => void
  onShellError?: () => void
  onAllReady?: () => void
  onError?: (error: any) => void
}

export interface ServerRenderOptions extends RenderToPipeableStreamOptions {
  /**
   * route url
   */
  url: string
  /**
   * writerable stream,pass directly to renderToPipeableStream
   */
  response: ServerResponse
  /**
   * millisecond to setTimeout call abort(), default 10000 millisecond
   */
  abortTimeout?: number
}

export const ServerSideContext = createContext<ServerSideContextValue | null>(
  null
)

interface CovertDataScope {
  promise: Promise<unknown> | null
  done: boolean
  covertCallback: Function
  covertCallbackResult: any
}
interface ThrowCovertData {
  (id: string, fn: (...args: unknown[]) => unknown): void
}

interface ServerSideContextValue {
  throwCovertData: ThrowCovertData
}

function throwServerSideData(response: ServerResponse): ThrowCovertData {
  const scopeMap: Record<string, CovertDataScope> = Object.create(null)
  return (id, fn) => {
    if (!scopeMap[id]) {
      scopeMap[id] = {
        promise: null,
        done: false,
        covertCallback: () => void 0,
        covertCallbackResult: null
      }
    }
    const scope = scopeMap[id]
    if (scope.done) {
      const result = scope.covertCallbackResult
      Reflect.deleteProperty(scopeMap, id)
      return result
    }
    if (scope.promise) {
      throw scope.promise
    }
    scope.promise = new Promise((resolve) => {
      ;(async () => {
        scope.covertCallbackResult = await fn()
        scope.done = true
        response.write(
          `<script type="module">window.__VIFR_COVERT_DATA__.${id}=${JSON.stringify(
            scope.covertCallbackResult
          )}</script>`
        )
        resolve(true)
      })()
    })
    throw scope.promise
  }
}

export function serverRender(
  reactNode: ReactNode,
  options: ServerRenderOptions
) {
  const {
    url = '/',
    response,
    abortTimeout = 10000,
    bootstrapModules: customBootstrapModules,
    onShellReady: customOnShellReady,
    onError: customOnError,
    ...rest
  } = options
  const throwCovertData = throwServerSideData(response)
  const { pipe, abort } = renderToPipeableStream(
    <ServerSideContext.Provider value={{ throwCovertData }}>
      <VifrServer location={url}>{reactNode}</VifrServer>
    </ServerSideContext.Provider>,
    Object.assign(
      {},
      {
        bootstrapModules: Array.isArray(customBootstrapModules)
          ? [CLIENT_ENTRY, ...customBootstrapModules]
          : [CLIENT_ENTRY],
        onShellReady() {
          response.statusCode = 200
          response.setHeader('Content-type', 'text/html')
          if (isFunction(customOnShellReady)) {
            customOnShellReady!()
          }
          pipe(response)
        },
        onError(e: any) {
          response.statusCode = 500
          if (isFunction(customOnError)) {
            customOnError!(e)
          }
          response.end(
            '<!doctype html><p>Loading...</p><script type="module">console.log(`error`)</script>'
          )
          console.error(e)
        }
      },
      rest
    )
  )
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(abort, abortTimeout)
}

// todo: options use HydrationOptions
export function clientRender(reactNode: ReactNode, options?: any) {
  hydrateRoot(document, <VifrBrowser>{reactNode}</VifrBrowser>, options)
}

interface VifrEntryContextType {
  [key: string]: any
}

const VifrEntryContext = createContext<VifrEntryContextType>(null!)
VifrEntryContext.displayName = 'VifrEntryContext'

function VifrEntry({ children }: { children: ReactNode }): JSX.Element {
  const entryCtx = useMemo(() => {
    return {}
  }, [])
  return (
    <>
      <VifrEntryContext.Provider value={entryCtx}>
        {children}
      </VifrEntryContext.Provider>
    </>
  )
}

function VifrServer({
  location,
  children
}: {
  location: string
  children: ReactNode
}): JSX.Element {
  return (
    <>
      <VifrEntry>
        <StaticRouter location={location}>{children}</StaticRouter>
      </VifrEntry>
    </>
  )
}

function VifrBrowser({ children }: { children: ReactNode }): JSX.Element {
  const initialGlobalData = useCallback(() => {
    if (window.__VIFR_COVERT_DATA__) return
    window.__VIFR_COVERT_DATA__ = {}
  }, [])
  initialGlobalData()
  return (
    <>
      <VifrEntry>
        <BrowserRouter>{children}</BrowserRouter>
      </VifrEntry>
    </>
  )
}
