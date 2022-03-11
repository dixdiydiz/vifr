import {transformAsync} from '@babel/core'
import {headCache} from '../server/transformIndexHtml'

export  function virtualHeadPlugin() {
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
          plugins: [[await loadPlugin('@babel/plugin-transform-react-jsx'), {
            "runtime": "automatic"
          }]]
        })
      return res?.code ?? ''
      }
      return null
    }
  }
}

function loadPlugin(path: string): Promise<any> {
  return import(path).then((module) => module.default || module)
}