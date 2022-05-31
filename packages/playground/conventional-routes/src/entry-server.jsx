import { serverRender } from 'vifr/react'
import Html from './Html'

export default function (url, response) {
  serverRender(<Html />, {
    url,
    response
  })
}
