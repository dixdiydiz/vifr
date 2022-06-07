// https://playwright.dev/docs/test-configuration
import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  workers: 1, // all tests should run in order
  use: {
    // Configure browser and context here
    browserName: 'chromium',
    baseURL: 'http://localhost:3000'
  },
  retries: 0,
  timeout: 30000,
  testMatch: ['**/__e2e__/**/?(*.)+(spec|test).[jt]s?(x)']
}
export default config
