import * as path from 'path'
import { test, expect } from '@playwright/test'
import {
  setupDevServer,
  teardownDevServer
} from '../../../../script/playwrightSetup'

const rootPath = path.resolve(__dirname, '../')

test.describe('joker', () => {
  test.beforeAll(async () => {
    await setupDevServer(rootPath)
  })
  test.afterAll(async () => {
    await teardownDevServer()
  })

  test('root page', async ({ page }) => {
    await page.goto('./')
    expect(await page.textContent('#app-h3')).toMatch('App Component')
  })
})
