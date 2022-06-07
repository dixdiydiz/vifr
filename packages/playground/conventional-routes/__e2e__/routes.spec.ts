import * as path from 'path'
import { test, expect } from '@playwright/test'
import {
  setupDevServer,
  teardownDevServer
} from '../../../../script/playwrightSetup'

const rootPath = path.resolve(__dirname, '../')

test.describe('routes', () => {
  test.beforeAll(async () => {
    await setupDevServer(rootPath)
  })
  test.afterAll(async () => {
    await teardownDevServer()
  })

  test('root route', async ({ page }) => {
    await page.goto('./')
    await expect(page.locator('.pages-root')).toHaveText('pages/root')
    await expect(page.locator('.pages-index')).toHaveText('pages/index')
  })

  test('root not found', async ({ page }) => {
    await page.goto('./notfound')
    await expect(page.locator('.pages-404')).toHaveText('pages/404')
  })

  test('/end-dollar has 404', async ({ page }) => {
    await page.goto('./end-dollar')
    await expect(page.locator('.pages-end-dollar-end-dollar')).toHaveText(
      'pages/end-dollar.$'
    )
    await expect(page.locator('.pages-end-dollar-404')).toHaveText(
      'pages/end-dollar/404'
    )
  })

  test('/teams', async ({ page }) => {
    await page.goto('./teams')
    await expect(page.locator('.pages-teams-teams')).toHaveText(
      'pages/teams/teams'
    )
    await expect(page.locator('.pages-teams-index')).toHaveText(
      'pages/teams/index'
    )
  })

  test('/teams/new and not have index element', async ({ page }) => {
    await page.goto('./teams/new')
    await expect(page.locator('.pages-teams-new')).toHaveText('pages/teams/new')
    await expect(page.locator('.pages-teams-index')).toHaveCount(0)
  })

  test('/teams/$teamId', async ({ page }) => {
    const teamId = 'dynamicId'
    await page.goto(`./teams/${teamId}`)
    await expect(page.locator('.teamId')).toHaveText(teamId)
    await expect(page.locator('.pages-teams-index')).toHaveCount(0)
  })

  test('/teams/members', async ({ page }) => {
    await page.goto('./teams/members')
    await expect(page.locator('.pages-teams-members-members')).toHaveText(
      'pages/teams/members/members'
    )
    await expect(page.locator('.pages-teams-members-404')).toHaveCount(0)
  })

  test('/teams/members/name', async ({ page }) => {
    await page.goto('./teams/members/name')
    await expect(page.locator('.pages-teams-members-name')).toHaveText(
      'pages/teams/members/name'
    )
  })
})
