import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom'
import { VifrBrowser } from 'vifr/react'
import Html from './Html'

window.BOOT = function () {
  hydrateRoot(
    document,
    <StrictMode>
      <VifrBrowser>
        <Html />
      </VifrBrowser>
    </StrictMode>
  )
}
if (window.LOADED) window.BOOT()
