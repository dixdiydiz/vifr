import React, { createContext, useMemo } from 'react'
import { StaticRouter } from 'react-router-dom/server'
import { BrowserRouter } from 'react-router-dom'

interface VifrEntryContextType {
  routesModules: { [routeId: string]: any }
}

// const { routes: { postfix } = { postfix: '' } } = resolvedConfig
// @ts-ignore
const postfix = `/src/pages/*.(j|t)s?(x)`
// @ts-ignore
const routesModules = import.meta.glob(postfix)
console.log('routesModules', routesModules)

const VifrEntryContext = createContext<VifrEntryContextType | undefined>(
  undefined
)
VifrEntryContext.displayName = 'VifrEntryContext'

function VifrEntry({
  isStatic,
  location,
  children
}: {
  isStatic: boolean
  location: string
  children: React.ReactNode
}): JSX.Element {
  const Router = isStatic ? StaticRouter : BrowserRouter
  const entryCtx = useMemo(() => {
    return {
      routesModules
    }
  }, [])
  return (
    <>
      <VifrEntryContext.Provider value={entryCtx}>
        <Router location={location}>{children}</Router>
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
  location,
  children
}: {
  location: string
  children: React.ReactNode
}): JSX.Element {
  return (
    <>
      <VifrEntry isStatic={false} location={location}>
        {children}
      </VifrEntry>
    </>
  )
}
