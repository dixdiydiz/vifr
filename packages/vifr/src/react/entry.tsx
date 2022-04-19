import * as React from 'react'
import { StaticRouter } from 'react-router-dom/server'
import { BrowserRouter } from 'react-router-dom'

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
// import type { ReactNode } from 'react'
// import http from 'http'
// import { renderToPipeableStream } from 'react-dom/server'
// import { VifrServer } from 'vifr/react'
//
// interface RenderToPipeableStreamOptions {
//   identifierPrefix?: string
//   namespaceURI?: string
//   nonce?: string
//   bootstrapScriptContent?: string
//   bootstrapScripts?: Array<string>
//   bootstrapModules?: Array<string>
//   progressiveChunkSize?: number
//   onShellReady?: () => void
//   onShellError?: () => void
//   onAllReady?: () => void
//   onError?: (error: any) => void
// }
//
// interface ServerRenderOptions extends RenderToPipeableStreamOptions {
//   /**
//    * route url
//    */
//   url: string
//   /**
//    * writerable stream,pass directly to renderToPipeableStream
//    */
//   response: http.ServerResponse
// }
//
// export function serverRender(
//   reactNode: ReactNode,
//   options: ServerRenderOptions
// ) {
//   const {
//     url,
//     response,
//     bootstrapScripts,
//     bootstrapModules,
//     onShellReady,
//     onAllReady,
//     onError,
//     ...rest
//   } = options
//   const { pipe, abort } = renderToPipeableStream(reactNode, {})
// }
