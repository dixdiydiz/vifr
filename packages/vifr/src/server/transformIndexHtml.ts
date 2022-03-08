import type {Plugin, ViteDevServer, IndexHtmlTransformResult} from 'vite'
import type {Options} from '@vitejs/plugin-react'
import reactPlugin from '@vitejs/plugin-react'


// copy from vite
export const CLIENT_PUBLIC_PATH = `/@vite/client`

const preambleCode = reactPlugin.preambleCode

export async function createReactPlugin (options: Options = {}) {
  const filterPlugins = reactPlugin(options).filter(Boolean).map(plugin => {
    if (Reflect.has(plugin as object, 'transformIndexHtml')) {
      const transformResult = (plugin as Plugin).transformIndexHtml!()
    }
  })
}
export async function createTransformHtml (root: string, server: ViteDevServer): Promise<string> {
  transformHtml = await server.transformIndexHtml('', originalHtml)
  return transformHtml
}

export function injectHtmlToApp ():Plugin {
  return {
    name: 'vifr:inject-html-to-app',
    transform (code, id) {
      if (/Html.jsx$/.test(id)) {
        console.log(code)
      }
      let injectCode = code
      const codeMatcher = documentRE.exec(code)
      const transformMatcher = documentRE.exec(transformHtml)
      if (!codeMatcher || !transformMatcher) {
        return
      }
      for (let i =1; i < codeMatcher.length; i++) {
        const target = codeMatcher[i]
        const transform = transformMatcher[i]
        injectCode.replace(target, transform.replace(target, htmlReplaceSign[i]))
      }
      return {
        code: injectCode,
        map: null
      }
    }
  }
}

// because there was no index.html, so should extract transformIndexHtml hook.
const CLIENT_PUBLIC_PATH = `/@vite/client`

