import type {Plugin, ViteDevServer, HtmlTagDescriptor} from 'vite'
import type {Options} from '@vitejs/plugin-react'
import reactPlugin from '@vitejs/plugin-react'
import {isString} from "../utils";


const unaryTags = new Set(['link', 'meta', 'base'])

export let reactRefreshHead = ''


/**
 * every request should call once
 */
export async function transformIndexHtml (root: string, server: ViteDevServer): Promise<string> {
  const transformHtml = await server.transformIndexHtml('', '')
  return transformHtml
}

export async function createReactPlugin (options: Options = {}): Promise<(Plugin|void)[]> {
  const filterPlugins = reactPlugin(options).filter(Boolean).map( async plugin => {
    if (Reflect.has(plugin as object, 'transformIndexHtml')) {
      const hook = (plugin as Plugin)?.transformIndexHtml
      const res =  await (hook as Function)()
      reactRefreshHead = isString(res) ? res : serializeTag(res)
      Reflect.deleteProperty(plugin as object, 'transformIndexHtml')
    }
  })
  return await Promise.all(filterPlugins)
}

function serializeTag(
  { tag, attrs, children }: HtmlTagDescriptor,
  indent: string = ''
): string {
  if (unaryTags.has(tag)) {
    return `<${tag}${serializeAttrs(attrs)}>`
  } else {
    return `<${tag}${serializeAttrs(attrs)}>${serializeTags(
      children,
      incrementIndent(indent)
    )}</${tag}>`
  }
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

