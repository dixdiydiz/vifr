import type {InlineConfig as ViteInlineConfig, ServerOptions as ViteServerOptions} from 'vite'

export interface InlineConfig extends ViteInlineConfig {
  /**
   * Server specific options, e.g. host, port, https...
   * @vifr Exclude middlewareMode, force assign 'ssr'
   */
  server?: Exclude<ViteServerOptions, 'middlewareMode'>
}