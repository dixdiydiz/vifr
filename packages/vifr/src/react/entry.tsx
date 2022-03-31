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
