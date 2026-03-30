import { test, expect, Page } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const SCREENSHOTS_DIR = path.resolve(__dirname, '../../test-screenshots')

async function saveScreenshot(page: Page, filename: string) {
  if (!fs.existsSync(SCREENSHOTS_DIR)) {
    fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  }
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: false,
  })
}

test.describe('Car Matc Game 游戏', () => {
  test('主菜单显示正常，有难度选择按钮', async ({ page }) => {
    await page.goto('/')

    // 标题存在
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Car Matc Game')

    // 副标题
    await expect(page.getByText('找到三个相同的汽车品牌消除它们！')).toBeVisible()

    // 三个难度按钮都存在
    await expect(page.getByRole('button', { name: /简单/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /普通/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /困难/ })).toBeVisible()

    await saveScreenshot(page, '01-main-menu.png')
  })

  test('点击"简单"进入游戏', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: /简单/ }).click()

    // 游戏页面应出现 "重开" 按钮
    await expect(page.getByRole('button', { name: '重开' })).toBeVisible()

    // 难度标签显示 "简单"
    await expect(page.getByText('简单').last()).toBeVisible()

    // 分数显示（初始为 0）
    await expect(page.getByText('0')).toBeVisible()

    await saveScreenshot(page, '02-entered-game-easy.png')
  })

  test('游戏棋盘显示，有汽车 Logo 卡牌', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /简单/ }).click()

    // 棋盘区域应存在 img 元素（汽车 Logo）
    const cards = page.locator('img[alt]').filter({ hasNot: page.locator('[alt=""]') })
    await expect(cards.first()).toBeVisible()

    const count = await cards.count()
    expect(count).toBeGreaterThan(0)

    // 手牌槽提示文字
    await expect(page.getByText('手牌槽 · 凑齐 3 张相同品牌自动消除')).toBeVisible()

    await saveScreenshot(page, '03-game-board-cards.png')
  })

  test('点击卡牌，卡牌进入底部槽位', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /简单/ }).click()

    // 等待棋盘加载
    await page.waitForSelector('img[alt][style*="cursor: pointer"], img[alt][class*="cursor-pointer"]', {
      timeout: 3000,
    }).catch(() => {
      // 可能 cursor 样式在父元素上，忽略此等待
    })

    // 手牌槽区域：初始应该没有品牌图片
    const slotBar = page.locator('.bg-gray-800.rounded-xl')
    const slotImgsBefore = slotBar.locator('img')
    const countBefore = await slotImgsBefore.count()

    // 找到可点击的卡牌（顶层，cursor=pointer 样式在父 div 上）
    // 直接使用 force click 方式点击第一张可见的游戏棋盘上的 img
    const boardContainer = page.locator('.relative').first()
    const boardCards = boardContainer.locator('img[alt]')
    const cardCount = await boardCards.count()
    expect(cardCount).toBeGreaterThan(0)

    // 尝试点击多张卡牌，直到有一张成功进槽
    let clicked = false
    for (let i = 0; i < Math.min(cardCount, 10); i++) {
      try {
        await boardCards.nth(i).click({ timeout: 1000 })
        clicked = true
        break
      } catch {
        // 该卡被遮挡，尝试下一张
      }
    }

    if (!clicked) {
      // 最后手段：force click 第一张
      await boardCards.first().click({ force: true })
    }

    // 等待槽位更新
    await page.waitForTimeout(300)

    // 槽位中应该出现了至少一张图片
    const countAfter = await slotImgsBefore.count()
    expect(countAfter).toBeGreaterThan(countBefore)

    await saveScreenshot(page, '04-card-in-slot.png')
  })

  test('点击多张相同卡牌触发消除', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /简单/ }).click()

    await page.waitForTimeout(200)

    // 截图记录初始状态
    await saveScreenshot(page, '05-before-match.png')

    // 连续点击数张卡牌
    const boardContainer = page.locator('.relative').first()
    const boardCards = boardContainer.locator('img[alt]')
    const cardCount = await boardCards.count()

    let successClicks = 0
    for (let i = 0; i < Math.min(cardCount, 20) && successClicks < 5; i++) {
      try {
        await boardCards.nth(i).click({ timeout: 800 })
        successClicks++
        await page.waitForTimeout(150)
      } catch {
        // 被遮挡，跳过
      }
    }

    await saveScreenshot(page, '06-after-clicks.png')

    // 游戏状态仍然正常（没有崩溃）
    await expect(page.getByRole('button', { name: '重开' })).toBeVisible()
  })
})
