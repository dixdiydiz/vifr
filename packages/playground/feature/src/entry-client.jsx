import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { VifrBrowser } from 'vifr/react'
import ErrorBoundary from './ErrorBoundary'
import Html from './Html'

window.BOOT = function () {
  console.log('entry-client')
  hydrateRoot(
    document,
    <StrictMode>
      <VifrBrowser>
        <ErrorBoundary>
          <Html />
        </ErrorBoundary>
      </VifrBrowser>
    </StrictMode>
  )
}
// if (window.LOADED) window.BOOT()
window.BOOT()
