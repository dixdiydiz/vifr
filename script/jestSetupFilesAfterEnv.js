// https://github.com/playwright-community/jest-process-manager
const {
  setup: setupDevServers,
  getServers,
  teardown: teardownDevServers
} = require('jest-process-manager')

const isBuildTest = !!process.env.BUILD_TEST

let err

beforeAll(async () => {
  console.log(__dirname)
  if (!page) {
    return
  }
  try {
    if (isBuildTest) {
      await setupDevServers({
        command: `pnpm run dev`,
        port: 3000,
        launchTimeout: 30000
      })
      getServers.then((servers) => {
        console.log(servers)
      })
      console.log('到这里')
      // spawnSync('npm run build', {
      //   stdio: 'inherit',
      //   shell: true,
      //   cwd: basePath
      // })
      // distPath = path.resolve(basePath, 'dist')
      // const fn = sirv(distPath)
      // server = http.createServer(fn)
      // let port = 5000
      // const url = await new Promise((resolve, reject) => {
      //   const onError = (e) => {
      //     if (e.code === 'EADDRINUSE') {
      //       server.close()
      //       server.listen(++port)
      //     } else {
      //       reject(e)
      //     }
      //   }
      //   server.on('error', onError)
      //   server.listen(port, () => {
      //     server.removeListener('error', onError)
      //     resolve(`http://localhost:${port}/`)
      //   })
      // })
      // await page.goto(url)
    } else {
    }
  } catch (e) {
    console.log('cuowu')
    err = e
    await page.close()
  }
}, 30000)

afterAll(async () => {
  await page?.close()
  await teardownDevServers()
  if (err) {
    throw err
  }
})
