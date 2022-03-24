import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { transformAsync } from '@babel/core'
import { isString, loadPlugin } from '../utils'
import { ROUTES_ROOT } from '../constant'
import { headCache } from '../server/transformIndexHtml'
import type { VifrResolvedConfig } from '../config'

function virtualHeadPlugin(): Plugin {
  const virtualModuleId = '@vifr-virtual-head'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vifr:virtual-head',
    resolveId(id: string) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const jsx = `export default () => (<>${headCache.content}</>)`
        const res = await transformAsync(jsx, {
          plugins: [
            [
              await loadPlugin('@babel/plugin-transform-react-jsx'),
              {
                runtime: 'automatic'
              }
            ]
          ]
        })
        return res?.code || ''
      }
      return null
    }
  }
}

function transformRoutesImportMetaUrlPlugin(): Plugin {
  let config: VifrResolvedConfig
  return {
    name: 'vifr:transform-vifr-react-components',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig as VifrResolvedConfig
    },
    async transform(code, id) {
      if (id.includes('vifr/dist/react/vifr-react.js')) {
        const s = new MagicString(code)
        let { routes: { postfix } = { postfix: '' } } = config
        postfix = isString(postfix)
          ? postfix
              .split('.')
              .reduce(
                (res, segment) => (segment ? `${res}.${segment}` : res),
                ''
              )
          : ''
        const routesPattern = `"${ROUTES_ROOT}/*${postfix}.(j|t)s?(x)"`
        s.replace('`__VIFR_ROUTES_PATTERN`', routesPattern)
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }) ?? null
        }
      }
      return null
    }
  }
}

export default function (): Plugin[] {
  return [virtualHeadPlugin(), transformRoutesImportMetaUrlPlugin()]
}
