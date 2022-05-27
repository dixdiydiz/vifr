// https://github.com/playwright-community/jest-process-manager
import { setup, getServers, teardown } from 'jest-process-manager'

let err

export async function setupDevServer(root, port = 3000) {
  err = null
  const isTestBuild = !!Number(process.env.TEST_BUILD_MODE)
  try {
    if (isTestBuild) {
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
      console.log('到这里', root)
      await setup({
        basePath: root,
        command: `pnpm run dev`,
        port,
        launchTimeout: 30000,
        usedPortAction: 'kill'
      })
      const servers = getServers()
      console.log('servers:', servers)
      console.log('到这里')
    }
  } catch (e) {
    console.log('cuowu', e)
    err = e
  }
}

export async function teardownDevServer() {
  await teardown()
  if (err) {
    throw err
  }
}
