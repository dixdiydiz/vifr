// https://github.com/playwright-community/jest-playwright/#configuration
module.exports = async () => {
  return {
    browsers: ['chromium'],
    launchOptions: {
      headless: true
    },
    use: {
      baseURL: 'http://localhost:3000/'
    }
  }
}
