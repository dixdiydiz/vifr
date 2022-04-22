import { serverRender } from 'vifr/react'
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

export default function (url, response) {
  serverRender(
    <ErrorBoundary>
      <DataProvider data={data}>
        <Html />
      </DataProvider>
    </ErrorBoundary>,
    {
      url,
      response
    }
  )
}
