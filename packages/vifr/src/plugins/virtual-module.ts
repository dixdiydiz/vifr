import {transformIndexHtmlScript} from '../server/transformIndexHtml'

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
        const
        return `export const msg = "from virtual module"`
      }
      return null
    }
  }
}