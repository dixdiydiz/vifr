import type { Plugin } from 'vite'
import { resolvedConfig } from '../config'

export function virtualResolvedConfigPlugin(): Plugin {
  const virtualModuleId = '@vifr-virtual-resolved-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vifr:virtual-resolved-config',
    resolveId(id: string) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        console.log(resolvedConfig)
        return `export default ${resolvedConfig}`
      }
      return null
    }
  }
}

export default function (): Plugin {
  return virtualResolvedConfigPlugin()
}
