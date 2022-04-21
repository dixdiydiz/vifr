import type { ServerResponse } from 'http'
import * as React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { BrowserRouter } from 'react-router-dom'
import { isFunction } from './utils'
import { CLIENT_ENTRY } from './constant'

/**
 * copy from https://github.com/facebook/react/blob/9ae80d6a2bf8f48f20e3d62b9672f21c1ff77bd8/packages/react-dom/src/server/ReactDOMFizzServerNode.js#L35
 */
interface RenderToPipeableStreamOptions {
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

interface ServerRenderOptions extends RenderToPipeableStreamOptions {
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

export function serverRender(
  reactNode: React.ReactNode,
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
  const { pipe, abort } = renderToPipeableStream(
    reactNode,
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

interface VifrEntryContextType {
  [key: string]: any
}

const VifrEntryContext = React.createContext<VifrEntryContextType>(null!)
VifrEntryContext.displayName = 'VifrEntryContext'

function VifrEntry({
  isStatic,
  location,
  children
}: {
  isStatic: boolean
  location?: string
  children: React.ReactNode
}): JSX.Element {
  const entryCtx = React.useMemo(() => {
    return {}
  }, [])
  return (
    <>
      <VifrEntryContext.Provider value={entryCtx}>
        {isStatic ? (
          <StaticRouter location={location!}>{children}</StaticRouter>
        ) : (
          <BrowserRouter>{children}</BrowserRouter>
        )}
      </VifrEntryContext.Provider>
    </>
  )
}

export function VifrServer({
  location,
  children
}: {
  location: string
  children: React.ReactNode
}): JSX.Element {
  return (
    <>
      <VifrEntry isStatic location={location}>
        {children}
      </VifrEntry>
    </>
  )
}

export function VifrBrowser({
  children
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <>
      <VifrEntry isStatic={false}>{children}</VifrEntry>
    </>
  )
}
