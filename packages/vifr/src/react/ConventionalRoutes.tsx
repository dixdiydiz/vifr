// @ts-ignore
import resolvedVifrConfig from '@vifr-virtual-resolved-config'
// @ts-ignore
import type { RouteObject } from 'react-router-dom'
import * as React from 'react'
// @ts-ignore
import { useRoutes } from 'react-router-dom'
import { ROUTES_ROOT } from '../constant'

interface PagesType {
  [index: string]: () => Promise<{
    default: React.ComponentType<React.ReactNode>
  }>
}

// @ts-ignore
const pages: PagesType = import.meta.glob(`__VIFR_ROUTES_PATTERN`)
const {
  routes: { postfix, caseSensitive }
} = resolvedVifrConfig

interface ConventionalRoutesContextType {
  fallback: React.SuspenseProps['fallback']
}

const ConventionalRoutesContext =
  React.createContext<ConventionalRoutesContextType>(null!)
ConventionalRoutesContext.displayName = 'ConventionalRoutesContext'
// function useConventionalRoutes() {
//   return React.useContext(ConventionalRoutesContext)
// }
function withConventionalRoutes(
  dynamicImport: () => Promise<{ default: React.ComponentType<any> }>
): React.ReactNode {
  const DynamicComponent = React.lazy(dynamicImport)
  return <DynamicComponent />
}
// function PageRoute({ children }: { children: React.ReactNode }): JSX.Element {
//   const { fallback } = useConventionalRoutes()
//   return (
//     <>
//       <React.Suspense fallback={fallback}>{children}</React.Suspense>
//     </>
//   )
// }

// interface ConventionalRoutesProps {
//   fallback?: ConventionalRoutesContextType['fallback']
// }
const routes = createRoutes(pages, ROUTES_ROOT, {
  postfix,
  caseSensitive
})
export const ConventionalRoutes = ({ fallback = null }): any => {
  return useRoutes(routes)
  // return (
  //   <ConventionalRoutesContext.Provider value={{ fallback }}>
  //     {useRoutes(routes)}
  //   </ConventionalRoutesContext.Provider>
  // )
}

interface Options {
  postfix?: string
  caseSensitive?: boolean
}

function createRoutes(
  pages: PagesType,
  root: string,
  options?: Options
): RouteObject[] {
  const files = Object.keys(pages)
  const defaultOptions = {
    postfix: '',
    caseSensitive: false
  }
  return createRoute(
    pages,
    files,
    root,
    root,
    Object.assign({}, defaultOptions, options)
  )
}

function createRoute(
  pages: PagesType,
  files: string[],
  fullFolder: string,
  folder: string,
  options: Required<Options>
): RouteObject[] {
  const { postfix, caseSensitive } = options
  const lowerCaseFolder = folder.toLowerCase()
  const isRoot = fullFolder === folder
  const routes: RouteObject[] = []
  const deepRoutes = Object.create(null)
  let selfRoute: RouteObject | null = null
  for (let file of files) {
    const isValidPath = file.includes(fullFolder)
    if (!isValidPath) {
      continue
    }
    const standbyFile = file.substring(fullFolder.length + 1)
    if (/\//.test(standbyFile)) {
      const deepDir = standbyFile.split('/')[0]
      if (deepDir in deepRoutes) {
        deepRoutes[deepDir].push(file)
      } else {
        deepRoutes[deepDir] = [file]
      }
      continue
    }
    const { routePath, lowerCaseRoutePath } = normalizeRoutePath(
      standbyFile,
      postfix
    )
    const Component = withConventionalRoutes(pages[file])
    if (isRoot && lowerCaseRoutePath === 'root') {
      selfRoute = {
        path: '/',
        caseSensitive,
        element: Component
      }
      continue
    }
    if (
      [lowerCaseFolder, `${lowerCaseFolder}/*`].includes(lowerCaseRoutePath)
    ) {
      selfRoute = {
        path: routePath,
        caseSensitive,
        element: Component
      }
      continue
    }
    if (/^index$/.test(lowerCaseRoutePath)) {
      routes.push({
        index: true,
        element: Component
      })
      continue
    }
    routes.push({
      path: routePath,
      caseSensitive,
      element: Component
    })
  }
  for (const [dir, files] of Object.entries(deepRoutes)) {
    routes.push(
      ...createRoute(
        pages,
        files as string[],
        `${fullFolder}/${dir}`,
        dir,
        options
      )
    )
  }
  if (selfRoute) {
    return [
      {
        ...selfRoute,
        children: [...routes]
      }
    ] as RouteObject[]
  } else {
    const parentPath = !isRoot
      ? /^\$/.test(folder)
        ? `:${folder.substring(1)}`
        : folder
      : ''
    if (parentPath) {
      return routes.map((ele) => ({
        ...ele,
        path: `${parentPath}/${ele.path}`,
        caseSensitive
      }))
    } else {
      return routes
    }
  }
}

function normalizeRoutePath(
  path: string,
  postfix: string
): {
  routePath: string
  lowerCaseRoutePath: string
} {
  const postfixGroup = postfix ? postfix.split('.') : []
  let pathGroup = path.split('.')
  pathGroup = pathGroup.slice(0, pathGroup.length - postfixGroup.length - 1)
  const routePath = pathGroup.reduce((res, curr) => {
    if (/^404$/.test(curr)) {
      return '*'
    }
    if (/^\$$/.test(curr)) {
      return `${res}/*`
    }
    if (/^\$/.test(curr)) {
      return res ? `${res}/:${curr.substring(1)}` : `:${curr.substring(1)}`
    }
    return res ? `${res}/${curr}` : `${curr}`
  }, '')
  return {
    routePath,
    lowerCaseRoutePath: routePath.toLowerCase()
  }
}
