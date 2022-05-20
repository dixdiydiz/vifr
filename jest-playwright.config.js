// https://github.com/playwright-community/jest-playwright/#configuration
// https://github.com/playwright-community/jest-process-manager#options
module.exports = async () => {
  return {
    browsers: ['chromium'],
    serverOptions: {
      command: `pnpm run dev`,
      port: 3000,
      launchTimeout: 10000,
      debug: true
    },
    launchOptions: {
      headless: true
    }
  }
}
