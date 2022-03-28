// @ts-ignore
import resolvedVifrConfig from '@vifr-virtual-resolved-config'
// @ts-ignore
import type { RouteObject } from 'react-router-dom'
import type React from 'react'
import { lazy } from 'react'
// @ts-ignore
import { useRoutes } from 'react-router-dom'
import { ROUTES_ROOT } from '../constant'

interface Pages {
  [index: string]: () => Promise<{
    default: React.ComponentType<React.ReactNode>
  }>
}

// @ts-ignore
const pages: Pages = import.meta.glob(`__VIFR_ROUTES_PATTERN`)
const files = Object.keys(pages)
const {
  routes: { postfix, caseSensitive }
} = resolvedVifrConfig

function withConventionalRoutes(
  key: string,
  dynamicImport: () => Promise<{ default: React.ComponentType<any> }>
): React.ReactNode {
  const DynamicComponent = lazy(dynamicImport)
  return <DynamicComponent />
}

const routes = createRoutes(pages, files, ROUTES_ROOT, {
  postfix,
  caseSensitive
})

export function ConventionalRoutes(): React.ReactNode {
  return useRoutes(routes)
}

interface Options {
  postfix?: string
  caseSensitive?: boolean
}

function createRoutes(
  pages: Pages,
  files: string[],
  root: string,
  options?: Options
): RouteObject[] {
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
  pages: Pages,
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
    const DynamicComponent = withConventionalRoutes(file, pages[file])
    if (isRoot && lowerCaseRoutePath === 'root') {
      selfRoute = {
        path: '/',
        caseSensitive,
        element: DynamicComponent
      }
      continue
    }
    if (
      [lowerCaseFolder, `${lowerCaseFolder}/*`].includes(lowerCaseRoutePath)
    ) {
      selfRoute = {
        path: routePath,
        caseSensitive,
        element: DynamicComponent
      }
      continue
    }
    if (/^index$/.test(lowerCaseRoutePath)) {
      routes.push({
        index: true,
        element: DynamicComponent
      })
      continue
    }
    routes.push({
      path: routePath,
      caseSensitive,
      element: DynamicComponent
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
