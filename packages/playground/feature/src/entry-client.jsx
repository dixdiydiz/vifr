import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom'
import { VifrBrowser } from 'vifr/react'
import { App } from './App'

window.BOOT = function () {
  hydrateRoot(
    document,
    <StrictMode>
      <VifrBrowser>
        <App />
      </VifrBrowser>
    </StrictMode>
  )
}
if (window.LOADED) window.BOOT()
