import type { ViteDevServer,  Connect} from 'vite'
import type {InlineConfig} from '../config'
import path from "path";
// import fsPromise from 'fs/promises'
import {
  createServer as ViteCreateServer,
  // mergeConfig as ViteMergeConfig,
} from 'vite'
import {resolveConfig} from '../config'

export {ViteDevServer, InlineConfig }

export interface VifrDevServer {
  middlewares: Connect.Server
  transformDevHtml: (url: string) => Promise<string>
  loadSsrEntryModule: () => Promise<Record<string, any>>
  ssrFixStacktrace: (e: Error) => void
}

let viteServer: ViteDevServer | null = null

export async function createServer (inlineConfig: InlineConfig = {}): Promise<VifrDevServer> {
  const mode = 'development'
  const { overrideConfig } = await resolveConfig(inlineConfig, 'serve', mode)
  const {root = process.cwd()} = inlineConfig
  viteServer = await ViteCreateServer(overrideConfig)
  console.log(viteServer)

  return {
    middlewares: viteServer.middlewares,
    transformDevHtml: createTransformDevHtml(root),
    loadSsrEntryModule: createLoadSsrEntryModule(root),
    ssrFixStacktrace: viteServer.ssrFixStacktrace
  }
}

function createTransformDevHtml (root: string): (url: string) => Promise<string> {
  return async (url: string): Promise<string> => {
    // const content = await fsPromise.readFile(path.resolve(root, 'index.html'), {encoding: 'utf-8'})
    const template = await viteServer!.transformIndexHtml(url, '')
    console.log(template)
    return template
  }
}

function createLoadSsrEntryModule (root: string): () => Promise<Record<string, any>> {
  return async (): Promise<Record<string, any>> => {
    return await viteServer!.ssrLoadModule(path.resolve(root, 'src/entry-server.jsx'))
  }
}
