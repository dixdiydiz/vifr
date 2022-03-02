import type {Plugin} from 'vite'



export class HtmlTransformer {
  str!: string
  constructor(str?: string) {
    if (str) this.str = str
  }


}

export function injectDevHtml ():Plugin {
  return {
    name: 'vifr:inject-dev-html',
    transformIndexHtml (html, {server}) {
      const innerHtml = server.transformIndexHtml('', '')

    }
  }
}