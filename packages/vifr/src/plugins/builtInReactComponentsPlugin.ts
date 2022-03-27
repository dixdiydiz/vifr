import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { transformAsync } from '@babel/core'
import { isString, loadPlugin } from '../utils'
import { ROUTES_ROOT } from '../constant'
import { headCache } from '../server/transformIndexHtml'
import type { VifrResolvedConfig } from '../config'

let resolvedVifrConfig: Required<Pick<VifrResolvedConfig, 'routes'>>

export function resolvedVifrConfigPlugin(): Plugin {
  const virtualModuleId = '@vifr-virtual-resolved-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vifr:virtual-resolved-config',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      let {
        routes: { postfix, caseSensitive } = {
          postfix: '',
          caseSensitive: false
        }
      } = resolvedConfig as VifrResolvedConfig
      postfix = isString(postfix)
        ? postfix
            .split('.')
            .reduce((res, segment) => (segment ? `${res}.${segment}` : res), '')
        : ''
      caseSensitive = Boolean(caseSensitive)
      resolvedVifrConfig = {
        routes: { postfix, caseSensitive }
      }
    },
    resolveId(id: string) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(resolvedVifrConfig)}`
      }
      return null
    }
  }
}

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
  return {
    name: 'vifr:transform-vifr-react-components',
    enforce: 'pre',
    async transform(code, id) {
      if (id.includes('vifr/dist/react/vifr-react.js')) {
        const s = new MagicString(code)
        const {
          routes: { postfix }
        } = resolvedVifrConfig
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
  return [
    resolvedVifrConfigPlugin(),
    virtualHeadPlugin(),
    transformRoutesImportMetaUrlPlugin()
  ]
}
