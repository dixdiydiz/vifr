import { StrictMode } from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { VifrServer } from 'vifr/react'
import Html from './Html'

export function render(url, res) {
  let didError = false
  const { pipe, abort } = renderToPipeableStream(
    <StrictMode>
      <VifrServer location={url}>
        <Html />
      </VifrServer>
    </StrictMode>,
    {
      bootstrapScriptContent: 'window.BOOT ? BOOT() : (window.LOADED = true)',
      // bootstrapModules: ['/src/entry-client.jsx'],
      onCompleteShell() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200
        res.setHeader('Content-type', 'text/html')
        pipe(res)
      },
      onError(x) {
        didError = true
        console.error(x)
      }
    }
  )
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  // setTimeout(abort, 10000)
}
