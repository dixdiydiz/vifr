import type { ViteDevServer} from 'vite'
import type {InlineConfig} from './config'


type VifrDevServer = ViteDevServer

export {VifrDevServer, InlineConfig }

export * from './agent-vite/createServer'