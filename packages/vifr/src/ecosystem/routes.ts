interface Route {
  path?: string
  index?: boolean
  element: string
  children?: Route[]
}

interface Options {
  handler: (f: string) => any
  postfix: string | null | undefined
}

function normalizeRoutePath(
  path: string,
  postfix: string | null | undefined
): string {
  const postfixGroup = postfix ? postfix.split('.') : []
  let pathGroup = path.split('.')
  pathGroup = pathGroup.slice(0, pathGroup.length - postfixGroup.length - 1)
  return pathGroup
    .reduce((res, curr) => {
      if (/^404$/.test(curr)) {
        return '*'
      }
      if (/^\$$/.test(curr)) {
        return `${res}/*`
      }
      if (/^\$/.test(curr)) {
        return res ? `${res}/:${curr.substring(1)}` :  `:${curr.substring(1)}`
      }
      return res ? `${res}/${curr}` : `${curr}`
    }, '')
}

function createRoute(
  files: string[],
  fullFolder: string,
  folder: string,
  options: Required<Options>
): Route[] {
  const { handler, postfix } = options
  const isRoot = fullFolder === folder
  const routes: Route[] = []
  const deepRoutes = Object.create(null)
  let selfRoute: Route | null = null
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
    const routePath = normalizeRoutePath(standbyFile, postfix)
    if (isRoot && routePath === 'root') {
      selfRoute = {
        path: '/',
        element: handler(file),
      }
      continue
    }
    if (routePath === folder || routePath === `${folder}/*`) {
      if (folder.startsWith('__')) {
        selfRoute = {
          element: handler(file),
        }
      } else {
        selfRoute = {
          path: routePath,
          element: handler(file),
        }
      }
      continue
    }
    if (/^index$/.test(routePath)) {
      routes.push({
        index: true,
        element: handler(file),
      })
      continue
    }
    routes.push({
      path: routePath,
      element: handler(file),
    })
  }
  for (const [dir, files] of Object.entries(deepRoutes)) {
    routes.push(
      ...createRoute(
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
      },
    ] as Route[]
  } else {
    const parentPath = !isRoot ? /^\$/.test(folder) ? `:${folder.substring(1)}` : folder : ''
    if (parentPath) {
      return routes.map(ele => ({
        ...ele,
        path: `${parentPath}/${ele.path}`
      }))
    } else {
      return routes
    }
  }
}

export function createRoutes (files: string[], root: string, options?: Options): Route[] {
  const defaultOptions = {
    handler: (f: string) => f,
    postfix: '',
  }
  return createRoute(files, root, root, Object.assign({}, defaultOptions, options))
}