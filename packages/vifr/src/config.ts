import type {
  InlineConfig as ViteInlineConfig,
  ServerOptions as ViteServerOptions,
  UserConfig as ViteUserConfig,
  ResolvedConfig as ViteResolvedConfig
} from 'vite'
import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
// import debug from 'debug'
import { createLogger, resolveConfig as ViteResolveConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import { virtualHeadPlugin } from './plugins/virtual-module'
import { isObject } from './utils'

export interface InlineConfig extends ViteInlineConfig {
  /**
   * Server specific options, e.g. host, port, https...
   * @vifr Exclude middlewareMode, force assign 'ssr'
   */
  server?: Exclude<ViteServerOptions, 'middlewareMode'>
}

export interface UserConfig extends ViteUserConfig {}

// define vifr logger
// const logger = createLogger(config.logLevel, {
//   allowClearScreen: config.clearScreen,
//   customLogger: config.customLogger
// })

// const configDebug = debug('vifr:config')

export interface ResolveConfig {
  viteResolvedConfig: ViteResolvedConfig
  overrideConfig: ViteInlineConfig
  configFile: string
}

export async function resolveConfig(
  inlineConfig: InlineConfig = {},
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolveConfig> {
  let { configFile = null } = inlineConfig
  configFile = lookupConfigFile(configFile)
  const viteResolvedConfig = await ViteResolveConfig({ configFile }, command)
  const overrideConfig = mergeConfig(inlineConfig, configFile)
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
  const legalPostfix = ['.ts', '.js', '.mjs', '.cjs']
  for (let postfix of legalPostfix) {
    const file = `vifr.config${postfix}`
    if (fs.existsSync(path.resolve(file))) {
      return file
    }
  }
  let errMsg = 'no config file found.'
  // check for vite config file
  for (let postfix of legalPostfix) {
    const file = `vite.config${postfix}`
    if (fs.existsSync(path.resolve(file))) {
      errMsg = `vifr: config file must use vifr.config.${postfix} instead of ${file}`
    }
  }
  const err = new Error(errMsg)
  createLogger('error', { prefix: '[vifr]' }).error(colors.red(errMsg), {
    error: err
  })
  throw err
}

function mergeConfig(
  inlineConfig: InlineConfig = {},
  configFile: string
): ViteInlineConfig {
  const { plugins: inlinePlugins = [], server = {} } = inlineConfig
  const overrideConfig = Object.assign(
    {},
    {
      configFile,
      plugins: [...inlinePlugins, reactPlugin(), virtualHeadPlugin()]
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
