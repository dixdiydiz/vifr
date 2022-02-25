// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')
const {devMiddlewareTools} = require('@vifr/server')

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop'

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const app = express()

  let vifrDevTools

  if (!isProd) {
    vifrDevTools = await devMiddlewareTools(app, {logLevel: isTest ? 'error' : 'info'})
  } else {
    app.use(require('compression')())
    app.use(
      require('serve-static')(resolve('dist/client'), {
        index: false
      })
    )
  }

  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl

      let  html
      if (!isProd) {
        html = vifrDevTools.replaceSsrOutletHtml(url)
      } else {
       const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
        const  render = require('./dist/server/entry-server.js').render
        const appHtml = render(url)
        html = template.replace(`<!--ssr-outlet-->`, appHtml)
      }

      //
      // if (context.url) {
      //   // Somewhere a `<Redirect>` was rendered
      //   return res.redirect(301, context.url)
      // }

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app, vite }
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(3000, () => {
      console.log('http://localhost:3000')
    })
  )
}

// for test use
exports.createServer = createServer
