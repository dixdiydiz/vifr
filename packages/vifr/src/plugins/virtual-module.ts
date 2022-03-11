import {headCache} from '../server/transformIndexHtml'

export  function virtualHeadPlugin() {
  const virtualModuleId = '@vifr-virtual-head'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vifr:virtual-head',
    resolveId(id: string) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        const str = headCache.content
        const res =  `export default function () {return (<>${str}</>)}`
      return res
      }
      return null
    }
  }
}

