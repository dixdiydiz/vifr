import type {
  InlineConfig as ViteInlineConfig,
  ServerOptions as ViteServerOptions,
  UserConfig as ViteUserConfig,
  ResolvedConfig as ViteResolvedConfig,
  PluginOption,
} from 'vite'
import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
// import debug from 'debug'
import {createLogger, resolveConfig as ViteResolveConfig} from 'vite'
import reactPlugin from '@vitejs/plugin-react'

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
  config: ViteResolvedConfig
  configFile: string
}

export async function resolveConfig (
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'):Promise<ResolveConfig> {
  const configFile = lookupConfigFile()
  const config = await ViteResolveConfig({configFile}, command)
  return {
    config,
    configFile
  }
}


export function lookupConfigFile (): string {
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
  createLogger('error', {prefix: '[vifr]'}).error(colors.red(errMsg), {error: err})
  throw err
}

export function mergeConfig (
  defaults: Record<string, any>,
  overrides: Record<string, any>,
) {
  const isProduction = process.env.NODE_ENV === 'production'

}

export function mergePlugins (mode: string = 'development'): PluginOption[] {
  const plugins = [
    ...reactPlugin()
  ]
  return  plugins
}