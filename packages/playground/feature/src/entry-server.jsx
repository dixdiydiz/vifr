import { renderToPipeableStream } from 'react-dom/server'
import { VifrServer } from 'vifr/react'
import ErrorBoundary from './ErrorBoundary'
import Html from './Html'

export function render(url, res) {
  const { pipe, abort } = renderToPipeableStream(
    <VifrServer location={url}>
      <ErrorBoundary>
        <Html />
      </ErrorBoundary>
    </VifrServer>,
    {
      bootstrapScriptContent: 'window.BOOT ? BOOT() : (window.LOADED = true)',
      // bootstrapModules: ['/src/entry-client.jsx'], onShellReady onAllReady
      onShellReady() {
        res.statusCode = 200
        res.setHeader('Content-type', 'text/html')
        pipe(res)
      },
      onError(x) {
        res.statusCode = 500
        res.send(
          '<!doctype html><p>Loading...</p><script type="module">console.log(`error`)</script>'
        )
        console.error(x)
      }
    }
  )
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  // setTimeout(abort, 10000)
}
