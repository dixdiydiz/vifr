import type {Server} from 'connect'
import type { ViteDevServer} from 'vite'
import type {InlineConfig} from '../config'
import {createServer as ViteCreateServer} from 'vite'
import {isObject} from "../utils";
import {lookupConfigFile} from '../config'


type VifrDevServer = ViteDevServer

export {VifrDevServer, InlineConfig }

export async function createConnectMiddleware (app:Server, inlineConfig: InlineConfig = {}): Promise<Server> {
  const configFile = lookupConfigFile()
  const {server = {}} = inlineConfig
  inlineConfig = {
    configFile,
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
  const {middlewares} = await ViteCreateServer(inlineConfig)
  app.use(middlewares)
}

function