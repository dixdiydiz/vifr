import type {Plugin, ViteDevServer} from 'vite'


// const htmlStartRE = /([ \t]*)<html[^>]*>/i
// const htmlEndRE = /<\/html>/i
//
// const headStartRE = /([ \t]*)<head[^>]*>/i
// const headEndRE = /([ \t]*)<\/head>/i
//
// const bodyStartRE = /([ \t]*)<body[^>]*>/i
// const bodyEndRE = /([ \t]*)<\/body>/i

// replace html string
const documentRE = /(?:[ \t]*)<html[^>]*>(.*)(?:[ \t]*)<head[^>]*>(.*)(?:[ \t]*)<\/head>.*(?:[ \t]*)<body[^>]*>(.*)(?:[ \t]*)<\/body>(.*)<\/html>/i
enum htmlReplaceSign {
  __VIFR_PRE_HTML = 1,
  __VIFR_HEAD = 2,
  __VIFR_BODY =3,
  __VIFR_POST_HTML = 4
}
export const originalHtml = `<html>${htmlReplaceSign[1]}<head>${htmlReplaceSign[2]}</head><body>${htmlReplaceSign[2]}</body>${htmlReplaceSign[2]}</html>`


let transformHtml: string = ''

export async function createTransformHtml (root: string, server: ViteDevServer): Promise<string> {
  transformHtml = await server.transformIndexHtml('', originalHtml)
  return transformHtml
}

export function injectHtmlToApp ():Plugin {
  return {
    name: 'vifr:inject-html-to-app',
    transform (code, id) {
      let injectCode = code
      const codeMatcher = documentRE.exec(code)
      const transformMatcher = documentRE.exec(transformHtml)
      if (!codeMatcher || !transformMatcher) {
        return null
      }
      for (let i =1; i < codeMatcher.length; i++) {
        const target = codeMatcher[i]
        const transform = transformMatcher[i]
        injectCode.replace(target, transform.replace(target, htmlReplaceSign[i]))
      }
      return {
        code: injectCode,
        map: null
      }
    }
  }
}