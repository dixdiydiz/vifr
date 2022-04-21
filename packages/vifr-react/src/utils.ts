const toString = (arg: unknown): string => (
  (arg = Object.prototype.toString.call(arg)),
  (<string>arg).substring(8, (<string>arg).length - 1)
)

export const isFunction = (arg: unknown): boolean =>
  !!arg &&
  (toString(arg) === '[object Function]' ||
    'function' === typeof arg ||
    arg instanceof Function)
