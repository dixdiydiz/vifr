// @ts-check
const fs = require('fs')
const path = require('path')
const express = require('express')
const {createVifrServer, createLoadSsrEntryModule, ssrFixStacktrace} = require('vifr')

const isTest = process.env.NODE_ENV === 'test' || !!process.env.VITE_TEST_BUILD

process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop'

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const resolve = (p) => path.resolve(__dirname, p)

  const app = express()

  if (!isProd) {
    const {middlewares} = await createVifrServer({logLevel: isTest ? 'error' : 'info'})
    app.use(middlewares)
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

      let html
      if (!isProd) {
        const {render} = await createLoadSsrEntryModule(url)
        console.log('render---', render)
        render(url, res)
      } else {
        const render = require('./dist/server/entry-server.js').render
        html = render(url)
        res.status(200).set({'Content-Type': 'text/html'}).end(html)
      }
    } catch (e) {
      !isProd && ssrFixStacktrace(e)
      console.log(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app }
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
