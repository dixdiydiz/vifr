import type { ViteDevServer} from 'vite'
import {createServer as ViteCreateServer} from 'vite'
import {isObject} from "./utils";
import type {InlineConfig} from './config'


type VifrDevServer = ViteDevServer

export {VifrDevServer, InlineConfig }

export async function createServer (inlineConfig: InlineConfig = {}): Promise<VifrDevServer> {
  const {server = {}} = inlineConfig
  inlineConfig = {
    ...inlineConfig,
    server:Object.assign({},
      server,
      {
        middlewareMode: 'ssr',
        watch: Object.assign({},
          {
            // During tests we edit the files too fast and sometimes chokidar
            // misses change events, so enforce polling for consistency
            usePolling: true,
            interval: 100,
          },
          isObject(server?.watch) && server.watch
          )
      }
    )
  }
  return ViteCreateServer(inlineConfig)
}