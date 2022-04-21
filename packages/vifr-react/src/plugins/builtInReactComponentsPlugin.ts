import type { Plugin } from 'vite'
import MagicString from 'magic-string'
import { transformAsync } from '@babel/core'
import { ROUTES_ROOT } from '../constant'

let resolvedVifrConfig: Record<string, any>

function resolvedVifrConfigPlugin(): Plugin {
  const virtualModuleId = '@vifr-virtual-resolved-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vifr:virtual-resolved-config',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      let {
        //@ts-ignore
        routes: { suffix, caseSensitive } = {
          suffix: '',
          caseSensitive: false
        }
      } = resolvedConfig
      suffix =
        typeof suffix === 'string'
          ? suffix
              .split('.')
              .reduce((res, segment) => (segment ? `${res}.${segment}` : res))
          : ''
      caseSensitive = Boolean(caseSensitive)
      resolvedVifrConfig = {
        routes: { suffix, caseSensitive }
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

function virtualHeadPlugin(headCache: Record<string, any>): Plugin {
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
          routes: { suffix }
        } = resolvedVifrConfig
        const routesPattern = suffix
          ? `"${ROUTES_ROOT}/**/*.${suffix}.(j|t)s?(x)"`
          : `"${ROUTES_ROOT}/**/*.(j|t)s?(x)"`
        s.replace('`__VIFR_ROUTES_PATTERN__`', routesPattern)
        return {
          code: s.toString(),
          map: s.generateMap({ hires: true }) ?? null
        }
      }
      return null
    }
  }
}

function loadPlugin(path: string): Promise<any> {
  return import(path).then((module) => module.default || module)
}

export function pluginCollection({
  headCache
}: {
  headCache: Record<string, any>
}): Plugin[] {
  return [
    resolvedVifrConfigPlugin(),
    virtualHeadPlugin(headCache),
    transformRoutesImportMetaUrlPlugin()
  ]
}
