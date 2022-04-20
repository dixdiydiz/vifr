import type {
  InlineConfig as ViteInlineConfig,
  ServerOptions as ViteServerOptions,
  ResolvedConfig as ViteResolvedConfig
} from 'vite'
import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
// import debug from 'debug'
import { resolveConfig as ViteResolveConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import { pluginCollection } from '@vifr/react'
import { headCache } from './server/transformIndexHtml'
import { loggerPrefix, createLogger } from './logger'
import { isObject } from './utils'

export interface InlineConfig extends ViteInlineConfig {
  /**
   * Server specific options, e.g. host, port, https...
   * @vifr Exclude middlewareMode, force assign 'ssr'
   */
  server?: Exclude<ViteServerOptions, 'middlewareMode'>
}

export type RoutesConfig = {
  suffix?: string
  caseSensitive?: boolean
}

export interface VifrResolvedConfig extends ViteResolvedConfig {
  routes?: RoutesConfig
}

export interface ResolveConfig {
  viteResolvedConfig: ViteResolvedConfig
  overrideConfig: ViteInlineConfig
  configFile: string
}

export async function resolveConfig(
  inlineConfig: InlineConfig = {},
  command: 'build' | 'serve'
): Promise<ResolveConfig> {
  let { configFile = null } = inlineConfig
  configFile = lookupConfigFile(configFile)
  const viteResolvedConfig = await ViteResolveConfig({ configFile }, command)
  const overrideConfig = mergeConfig(
    viteResolvedConfig,
    inlineConfig,
    configFile
  )
  return {
    viteResolvedConfig,
    overrideConfig,
    configFile
  }
}

export function lookupConfigFile(configFile?: string | null | false): string {
  // todo: 提供提示
  if (configFile) {
    if (fs.existsSync(path.resolve(configFile))) {
      return configFile
    }
  }
  const legalSuffix = ['.ts', '.js', '.mjs', '.cjs']
  for (const suffix of legalSuffix) {
    const file = `vifr.config${suffix}`
    if (fs.existsSync(path.resolve(file))) {
      return file
    }
  }
  let errorMessage = 'no config file found.'
  // check for vite config file
  for (const suffix of legalSuffix) {
    const file = `vite.config${suffix}`
    if (fs.existsSync(path.resolve(file))) {
      errorMessage = `vifr: config file must use vifr.config.${suffix} instead of ${file}`
    }
  }
  const err = new Error(errorMessage)
  console.error(`${colors.red(colors.bold(loggerPrefix))} ${errorMessage}`)
  throw err
}

function mergeConfig(
  resolvedConfig: ViteResolvedConfig,
  inlineConfig: InlineConfig = {},
  configFile: string
): ViteInlineConfig {
  const {
    logLevel: inlineLogLevel,
    clearScreen: inlineClearScreen,
    plugins: inlinePlugins = [],
    server = {}
  } = inlineConfig
  const { logLevel: resolvedLogLevel, clearScreen: resolvedClearScreen } =
    resolvedConfig
  const logLevel = inlineLogLevel ?? resolvedLogLevel ?? 'info'
  const allowClearScreen = inlineClearScreen ?? resolvedClearScreen ?? true
  const logger = createLogger(logLevel, { allowClearScreen })
  const overrideConfig = Object.assign(
    {},
    {
      configFile,
      customLogger: logger,
      plugins: [
        ...inlinePlugins,
        reactPlugin(),
        pluginCollection({ headCache })
      ]
    },
    {
      server: Object.assign({}, isObject(server) && server, {
        middlewareMode: 'ssr' as const,
        watch: Object.assign(
          {
            // During tests we edit the files too fast and sometimes chokidar
            // misses change events, so enforce polling for consistency
            usePolling: true,
            interval: 100
          },
          isObject(server?.watch) && server.watch
        )
      })
    }
  )
  return overrideConfig
}
