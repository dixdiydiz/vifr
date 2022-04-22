import { StrictMode } from 'react'
import { clientRender } from 'vifr/react'
import ErrorBoundary from './ErrorBoundary'
import { isFunction } from 'vifr'
import Html from './Html'

clientRender(
  <StrictMode>
    <ErrorBoundary>
      <Html />
    </ErrorBoundary>
  </StrictMode>
)
