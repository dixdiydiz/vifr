import { renderToPipeableStream } from 'react-dom/server'
import { VifrServer } from 'vifr/react'
import ErrorBoundary from './ErrorBoundary'
import Html from './Html'
import { DataProvider } from './pages/selectivehydration/fakeData'

function createServerData() {
  let done = false
  let promise = null
  return {
    read() {
      if (done) {
        done = false
        return
      }
      if (promise) {
        throw promise
      }
      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true
          promise = null
          resolve()
        }, 5000)
      })
      throw promise
    }
  }
}

const data = createServerData()

export default function render(url, res) {
  const { pipe, abort } = renderToPipeableStream(
    <VifrServer location={url}>
      <ErrorBoundary>
        <DataProvider data={data}>
          <Html />
        </DataProvider>
      </ErrorBoundary>
    </VifrServer>,
    {
      bootstrapScriptContent:
        'window.BOOT ? BOOT() : (window.LOADED = true);console.log(1)',
      bootstrapModules: ['/src/entry-client.jsx'],
      // onShellReady onAllReady
      onShellReady() {
        res.statusCode = 200
        res.setHeader('Content-type', 'text/html')
        pipe(res)
      },
      onAllReady() {
        res.write(`
          <script>window.__VIFR_USEDATA__ = {':R1q:': () => {console.log('eeee')}}</script>`)
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
