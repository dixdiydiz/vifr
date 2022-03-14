import { hydrateRoot } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'

window.BOOT = function () {
  hydrateRoot(
    document,
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
if (window.LOADED) window.BOOT()
