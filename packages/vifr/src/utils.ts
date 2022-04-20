import { logger } from './logger'

export const isString = (arg: unknown): arg is string => typeof arg === 'string'

export const isArray = (arg: unknown): arg is any[] => Array.isArray(arg)

const toString = (arg: unknown): string => (
  (arg = Object.prototype.toString.call(arg)),
  (<string>arg).substring(8, (<string>arg).length - 1)
)

export const isObject = (arg: unknown): boolean => toString(arg) === 'Object'

export const isFunction = (arg: unknown): boolean => arg instanceof Function
export const isAsyncFunction = (arg: unknown): boolean =>
  toString(arg) == 'AsyncFunction'
export const isGeneratorFunction = (arg: unknown): boolean =>
  toString(arg) == 'GeneratorFunction'

export function invariant<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T
export function invariant(value: any, message?: string) {
  if (value === false || value == null) {
    const error = new Error(message)
    logger.error(message ?? '', { error: error })
    throw error
  }
}
