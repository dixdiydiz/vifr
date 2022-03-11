// import type { Plugin, } from 'vite'
import htmlparser from 'htmlparser2'
import {ssrTransformIndexHtml}from './createServer'
import {isArray} from "../utils";


interface TransformIndexHtmlDescriptor {
  head: string
  body: string
}

interface MarkTag {
  openStartIndex: number
  openEndIndex: number
  closeEndIndex: number
  text: string
  openTagStr: string
  fullStr: string
}

const template = '<html><head></head></html>'
const htmlRE = /<html>[^]*<head>([^]*)<\/head>[^]*<\/html>/i

export const headCache: Record<string, any> = Object.defineProperties({
  content: ''
}, {
  contentMap: {
    set (arr: string[]) {
      const [key, val] = arr
      this.content = this[key] = val
    }
  }
})


export async function transformIndexHtml (url: string): Promise<TransformIndexHtmlDescriptor> {
  let res = {head: '', body: ''}
  const html = await ssrTransformIndexHtml(url, template)
  const matcher = htmlRE.exec(html)
  if (isArray(matcher)) {
    const [_, head] = matcher
    res.head = headCache[head] ?? serializeHead(head)
  }
  return res
}

function serializeHead (html: string): string {
  let isScriptTag: boolean = false
  let stackIndex = -1
  let stack: MarkTag[] = []
  const parser = new htmlparser.Parser({
    onopentag(name) {
      if (name === 'script') {
        isScriptTag = true
        stack[++stackIndex] = markTag(parser.startIndex, parser.endIndex)
      }
    },
    ontext (text) {
      if (isScriptTag) {
        stack[stackIndex].text = text
      }
    },
    onclosetag(name: string) {
      if (name === 'script') {
        const {openStartIndex, openEndIndex} = stack[stackIndex]
        const closeEndIndex = parser.endIndex
        stack[stackIndex].closeEndIndex = closeEndIndex
        stack[stackIndex].openTagStr = html.substring(openStartIndex, openEndIndex)
        stack[stackIndex].fullStr = html.substring(openStartIndex, closeEndIndex+1)
        isScriptTag = false
      }
    }
  })
  parser.write(html)
  parser.end()
  let transformHtml = html
  for (let mark of stack) {
    const {openTagStr, text, fullStr}  = mark
    transformHtml = transformHtml.replace(fullStr, text ? `${openTagStr} dangerouslySetInnerHTML={{__html: '${text.replace(/\n/g, '<br />')}'}} />` : `${openTagStr} />`)
  }

  headCache.contentMap = [html, transformHtml]

  return transformHtml
}

function markTag (openStartIndex: number, openEndIndex: number): MarkTag {
  return {
    openStartIndex,
    openEndIndex,
    closeEndIndex: -1,
    text: '',
    openTagStr: '',
    fullStr: ''
  }
}