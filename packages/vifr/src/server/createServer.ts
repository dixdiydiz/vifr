import type { ViteDevServer, Connect } from 'vite'
import type { InlineConfig } from '../config'
import path from 'path'
import { createServer as ViteCreateServer } from 'vite'
import { resolveConfig } from '../config'
import { transformIndexHtml } from './transformIndexHtml'
import { invariant } from '../utils'

export { ViteDevServer, InlineConfig }

export interface VifrDevServer {
  middlewares: Connect.Server
}

let viteServer: ViteDevServer | null = null

export async function createVifrServer(
  inlineConfig: InlineConfig = {}
): Promise<VifrDevServer> {
  const mode = 'development'
  const { overrideConfig } = await resolveConfig(inlineConfig, 'serve', mode)
  viteServer = await ViteCreateServer(overrideConfig)
  return {
    middlewares: viteServer.middlewares
  }
}

export async function ssrTransformIndexHtml(url: string, template: string) {
  return await viteServer!.transformIndexHtml(url, template)
}

export async function loadServerEntryModule(
  url: string,
  root: string = process.cwd()
): Promise<Record<string, any>> {
  await transformIndexHtml(url)
  const { default: render } = await viteServer!.ssrLoadModule(
    path.resolve(root, 'src/entry-server.jsx')
  )
  invariant(render, 'entry-server should export a default function.')
  return render
}

export function ssrFixStacktrace(e: Error): void {
  return viteServer!.ssrFixStacktrace(e)
}
