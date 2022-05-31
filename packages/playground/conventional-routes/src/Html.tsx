// @ts-ignore
import { Head, PageRoutes } from 'vifr/react'
import Spinner from './components/Spinner'

export default function Html(): JSX.Element {
  return (
    <>
      <html lang="en">
        <head>
          <Head />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <title>Test Auto Router App</title>
        </head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<b>Enable JavaScript to run this app.</b>`
            }}
          />
          <PageRoutes fallback={<Spinner />} />
        </body>
      </html>
    </>
  )
}
