import { Head } from 'vifr/react'
// import App from './App'
import { ConventionalRoutes } from 'vifr/react'

export default function Html() {
  return (
    <>
      <html lang="en">
        <head>
          <Head />
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="shortcut icon" href="favicon.ico" />
          <title>Vifr App</title>
        </head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<b>Enable JavaScript to run this app.</b>`
            }}
          />
          <ConventionalRoutes />
        </body>
      </html>
    </>
  )
}
