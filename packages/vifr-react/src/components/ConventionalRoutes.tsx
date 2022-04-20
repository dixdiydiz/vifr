// @ts-ignore
import resolvedVifrConfig from '@vifr-virtual-resolved-config'
import type { RouteObject } from 'react-router-dom'
import * as React from 'react'
import { useRoutes } from 'react-router-dom'
import { ROUTES_ROOT } from '../constant'

interface PagesType {
  [index: string]: () => Promise<{
    default: React.ComponentType<React.ReactNode>
  }>
}

// @ts-ignore
const pages: PagesType = import.meta.glob(`__VIFR_ROUTES_PATTERN__`)
const {
  routes: { suffix, caseSensitive }
} = resolvedVifrConfig

function withConventionalRoutes(
  dynamicImport: () => Promise<{ default: React.ComponentType<any> }>
): React.ReactNode {
  const DynamicComponent = React.lazy(dynamicImport)
  return <DynamicComponent />
}

export interface ConventionalRoutesProps {
  fallback?: React.SuspenseProps['fallback']
}
const routes = createRoutes(pages, ROUTES_ROOT, {
  suffix,
  caseSensitive
})

const RouteElement = React.memo(() => {
  const element = useRoutes(routes)
  return element
})

export const Routes = ({ fallback = null }: ConventionalRoutesProps): any => {
  return (
    <React.Suspense fallback={fallback}>
      <RouteElement />
    </React.Suspense>
  )
}
Routes.displayName = 'VifrConventionalRoutes'

interface Options {
  suffix?: string
  caseSensitive?: boolean
}

function createRoutes(
  pages: PagesType,
  root: string,
  options?: Options
): RouteObject[] {
  const files = Object.keys(pages)
  const defaultOptions = {
    suffix: '',
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
  const { suffix, caseSensitive } = options
  const lowerCaseFolder = folder.toLowerCase()
  const isRoot = fullFolder === folder
  const routes: RouteObject[] = []
  const deepRoutes = Object.create(null)
  let selfRoute: RouteObject | null = null
  for (const file of files) {
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
      suffix
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
  suffix: string
): {
  routePath: string
  lowerCaseRoutePath: string
} {
  const postfixGroup = suffix ? suffix.split('.') : []
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
