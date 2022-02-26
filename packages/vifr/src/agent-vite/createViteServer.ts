import type {Server} from 'connect'
import type { ViteDevServer} from 'vite'
import type {InlineConfig} from '../config'
import path from "path";
import fsPromise from 'fs/promises'
import {
  createServer as ViteCreateServer,
} from 'vite'
import {isObject} from "../utils";
import {resolveConfig, mergePlugins} from '../config'


type VifrDevServer = ViteDevServer

export {VifrDevServer, InlineConfig }

export interface DevMiddlewareHelper {
  replaceSsrOutletHtml: (url: string) => Promise<string>
}

export async function devMiddlewareTools (app:Server, inlineConfig: InlineConfig = {}): Promise<DevMiddlewareHelper> {
  const mode = 'development'
  // todo: 获取配置后，vite 设置 configfile = false
  const {config, configFile} = await resolveConfig(inlineConfig, 'serve', mode)
  console.log(config)
  const {root = process.cwd(),server = {}} = inlineConfig
  inlineConfig = {
    configFile,
    plugins: mergePlugins(mode),
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
  const viteServer = await ViteCreateServer(inlineConfig)
  app.use(viteServer.middlewares)

  const replaceSsrOutletHtml = createReplaceSsrOutletHtml(viteServer, root)

  return {replaceSsrOutletHtml}
}

function createReplaceSsrOutletHtml (viteServer: ViteDevServer, root: string): (url: string) => Promise<string> {
  return async (url: string): Promise<string> => {
    try {
      const content = await fsPromise.readFile(path.resolve(root, 'index.html'), {encoding: 'utf-8'})
      const template = await viteServer.transformIndexHtml(url, content)
      const {render} = await viteServer.ssrLoadModule(path.resolve(root, 'src/entry-server.jsx'))
      // @ts-ignore todo: why react 17 is not Record<string, any>
      const appHtml = render(url)
      const html = template.replace(`<!--ssr-outlet-->`, appHtml)
      return html
    } catch (e) {
      viteServer.ssrFixStacktrace(e)
      throw e
    }
  }
}
