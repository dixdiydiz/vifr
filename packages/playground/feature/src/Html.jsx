import {Head} from 'vifr/react'
// import head from '@vifr-virtual-head'

export default function Html({ children, title }) {
  return (
    <>
      <html lang="en">
      <head>
        <Head />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
        <title>{title}</title>
      </head>
      <body>
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<b>Enable JavaScript to run this app.</b>`
        }}
      />
      {children}
      <div>2134</div>
      </body>
      </html>
    </>

  );
}
