import type { Logger, LogLevel, LoggerOptions } from 'vite'
import { createLogger as createViteLogger } from 'vite'

export const loggerPrefix = '[vifr]'

export let logger: Logger
export function createLogger(
  level: LogLevel = 'info',
  options: LoggerOptions = {}
): Logger {
  if (logger) {
    return logger
  }
  Object.assign(options, { prefix: loggerPrefix })
  logger = createViteLogger(level, options)
  return logger
}
