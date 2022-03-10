import type {Plugin, HtmlTagDescriptor, IndexHtmlTransformHook} from 'vite'
import type {Options} from '@vitejs/plugin-react'
import reactPlugin from '@vitejs/plugin-react'
import {CLIENT_PUBLIC_PATH} from '../constants'
import {isFunction, isString} from "../utils"


export let reactRefreshHead = ''


function viteClientScript () {
  return `<script type="module" src={${CLIENT_PUBLIC_PATH}} />`
}
let transformIndexHtmlHooks: IndexHtmlTransformHook[] = [viteClientScript]


/**
 * every request should call once
 */
export async function transformIndexHtmlScript (): Promise<string> {
  let res = ''
  for (let hook of transformIndexHtmlHooks) {
    // @ts-ignore no params
    const hookRes =  await hook()
    // @ts-ignore
    res += isString(hookRes) ? hookRes : serializeTag(hookRes)
  }
  return res
}

export async function createReactPlugin (options: Options = {}): Promise<(Plugin|void)[]> {
  const filterPlugins = (reactPlugin(options).filter(Boolean) as Plugin[]).map( async plugin => {
    if (Reflect.has(plugin, 'transformIndexHtml')) {
      const hook = plugin.transformIndexHtml
      if (isFunction(hook)) {
        transformIndexHtmlHooks.push(hook)
      }
      Reflect.deleteProperty(plugin, 'transformIndexHtml')
    }
  })
  return await Promise.all(filterPlugins)
}

function serializeTag(
  { tag, attrs, children }: HtmlTagDescriptor,
  indent: string = ''
): string {
  return `<${tag}${serializeAttrs(attrs)}>${serializeTags(
    children,
    incrementIndent(indent)
  )}</${tag}>`
}

function incrementIndent(indent: string = '') {
  return `${indent}${indent[0] === '\t' ? '\t' : '  '}`
}

function serializeTags(
  tags: HtmlTagDescriptor['children'],
  indent: string = ''
): string {
  if (typeof tags === 'string') {
    return tags
  } else if (tags && tags.length) {
    return tags.map((tag) => `${indent}${serializeTag(tag, indent)}\n`).join('')
  }
  return ''
}

function serializeAttrs(attrs: HtmlTagDescriptor['attrs']): string {
  let res = ''
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean') {
      res += attrs[key] ? ` ${key}` : ``
    } else {
      res += ` ${key}=${JSON.stringify(attrs[key])}`
    }
  }
  return res
}

