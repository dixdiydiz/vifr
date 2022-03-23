import type { Plugin } from 'vite'
import { transformAsync } from '@babel/core'
import { loadPlugin } from '../utils'
import { headCache } from '../server/transformIndexHtml'

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
        return res?.code ?? ''
      }
      return null
    }
  }
}

export default function (): Plugin[] {
  return [virtualHeadPlugin()]
}
