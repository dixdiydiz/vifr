import type { Plugin } from 'vite'
import type { VifrResolvedConfig } from '../config'

export function virtualResolvedConfigPlugin(): Plugin {
  let config: VifrResolvedConfig
  const virtualModuleId = '@vifr-virtual-resolved-config'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  return {
    name: 'vifr:virtual-resolved-config',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig as VifrResolvedConfig
    },
    resolveId(id: string) {
      return id === virtualModuleId ? resolvedVirtualModuleId : null
    },
    async load(id: string) {
      if (id === resolvedVirtualModuleId) {
        return `export default config = ${JSON.stringify(config)}`
      }
      return null
    }
  }
}

export default function (): Plugin {
  return virtualResolvedConfigPlugin()
}
