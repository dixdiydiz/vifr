import type {InlineConfig as ViteInlineConfig, ServerOptions as ViteServerOptions} from 'vite'
import fs from 'fs'
import path from 'path'
import colors from 'picocolors'
import {createLogger} from 'vite'

export interface InlineConfig extends ViteInlineConfig {
  /**
   * Server specific options, e.g. host, port, https...
   * @vifr Exclude middlewareMode, force assign 'ssr'
   */
  server?: Exclude<ViteServerOptions, 'middlewareMode'>
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
       errMsg = `config file must use vifr.config.${postfix} instead of ${file}`
    }
  }
  const err = new Error(errMsg)
  createLogger('error').error(colors.red(errMsg), {error: err})
  throw err
}