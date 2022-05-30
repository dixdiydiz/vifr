import { spawn } from 'child_process'

let err
let proc

export async function setupDevServer(root) {
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
      const url = await new Promise((resolve, reject) => {
        proc = spawn('npm run dev', {
          cwd: root,
          shell: true,
          timeout: 10000
        })
        proc.on('error', (err) => {
          console.error(err)
          reject(err)
        })
        proc.stdout.on('data', (data) => {
          const dataStr = data.toString()
          if (dataStr.includes('http')) {
            resolve(dataStr)
          }
        })
        proc.on('close', (code) => {
          console.log(`child process exited with code ${code}`)
        })
      })
      console.log('current test cwd start dev:', url)
    }
  } catch (e) {
    err = e
  }
}

export async function teardownDevServer() {
  if (proc) {
    proc.kill()
  }
  if (err) {
    throw err
  }
}
