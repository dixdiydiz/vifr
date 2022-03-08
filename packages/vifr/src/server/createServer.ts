import type { ViteDevServer,  Connect} from 'vite'
import type {InlineConfig} from '../config'
import path from "path";
import {
  createServer as ViteCreateServer,
  // mergeConfig as ViteMergeConfig,
} from 'vite'
import {resolveConfig} from '../config'
import {createTransformHtml} from "./html";

export {ViteDevServer, InlineConfig }

export interface VifrDevServer {
  middlewares: Connect.Server
}

let viteServer: ViteDevServer | null = null

export async function createVifrServer (inlineConfig: InlineConfig = {}): Promise<VifrDevServer> {
  const mode = 'development'
  const { overrideConfig } = await resolveConfig(inlineConfig, 'serve', mode)
  const {root = process.cwd()} = inlineConfig
  viteServer = await ViteCreateServer(overrideConfig)
  await createTransformHtml(root, viteServer)

  return {
    middlewares: viteServer.middlewares,
  }
}

export async function createLoadSsrEntryModule (root: string = process.cwd()): Promise<Record<string, any>> {
  return await viteServer!.ssrLoadModule(path.resolve(root, 'src/entry-server.jsx'))
}

export function ssrFixStacktrace ( e: Error): void {
  return viteServer?.ssrFixStacktrace(e)
}
