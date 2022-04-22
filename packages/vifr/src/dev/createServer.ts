import type { ViteDevServer, Connect } from 'vite'
import type { InlineConfig } from '../config'
import path from 'path'
import http from 'http'
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
  const { overrideConfig } = await resolveConfig(inlineConfig, 'serve')
  viteServer = await ViteCreateServer(overrideConfig)
  return {
    middlewares: viteServer.middlewares
  }
}

export async function ssrTransformIndexHtml(url: string, template: string) {
  return await viteServer!.transformIndexHtml(url, template)
}

export async function renderServerEntry(
  url: string,
  res: http.ServerResponse
): Promise<http.ServerResponse> {
  await transformIndexHtml(url)
  const { default: render } = await viteServer!.ssrLoadModule(
    path.resolve(process.cwd(), 'src/entry-server.jsx')
  )
  invariant(render, 'entry-server should export a default function.')
  render(url, res)
  return res
}

export function ssrFixStacktrace(e: Error): void {
  return viteServer!.ssrFixStacktrace(e)
}
