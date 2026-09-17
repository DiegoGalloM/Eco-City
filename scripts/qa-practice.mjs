import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const base = process.env.ECO_CITY_URL || 'http://127.0.0.1:5173'
const output = path.resolve('test-results/practice')
const viewports = [
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
]
fs.mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []
const state = page => page.evaluate(() => JSON.parse(window.render_game_to_text()))

async function center(locator) {
  const box = await locator.boundingBox()
  assert(box, 'interactive element has a visible box')
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
}

async function chooseCorrect(page, method = 'keyboard') {
  const before = (await state(page)).practice
  assert.equal(before.phase, 'playing')
  const bin = before.activeItem.bin
  const object = page.locator('[data-practice-item]')
  const target = page.locator(`[data-practice-bin="${bin}"]`)
  if (method === 'drag') {
    const from = await center(object), to = await center(target)
    await page.mouse.move(from.x, from.y)
    await page.mouse.down()
    await page.mouse.move(to.x, to.y, { steps: 14 })
    await page.mouse.up()
  } else if (method === 'touch') {
    const from = await center(object), to = await center(target)
    await page.touchscreen.tap(from.x, from.y)
    await page.touchscreen.tap(to.x, to.y)
  } else {
    await object.focus()
    await page.keyboard.press('Enter')
    await target.focus()
    await page.keyboard.press('Enter')
  }
  await page.waitForFunction(expected => JSON.parse(window.render_game_to_text()).practice.score === expected, before.score + 1)
}

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport, hasTouch: true })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto(base, { waitUntil: 'networkidle' })
  await page.locator('#start-btn').click()
  await page.screenshot({ path: path.join(output, `${viewport.width}x${viewport.height}-map-entry.png`), fullPage: true })
  await page.getByRole('button', { name: /Práctica de separación/ }).click()
  await page.waitForSelector('[data-screen="practice"]')
  let snapshot = await state(page)
  assert.equal(snapshot.practice.phase, 'intro')
  assert.equal(snapshot.practice.best, 0)
  await page.screenshot({ path: path.join(output, `${viewport.width}x${viewport.height}-intro.png`), fullPage: true })

  await page.getByRole('button', { name: /Comenzar práctica/ }).click()
  snapshot = await state(page)
  assert.equal(snapshot.practice.totalItems, 32)
  const initialDuration = snapshot.practice.fallDuration
  await chooseCorrect(page, viewport.width === 360 ? 'touch' : viewport.width === 1366 ? 'drag' : 'keyboard')
  for (let i = 1; i < 6; i++) await chooseCorrect(page)
  snapshot = await state(page)
  assert.equal(snapshot.practice.score, 6)
  assert.equal(snapshot.practice.level, 2)
  assert(snapshot.practice.fallDuration < initialDuration, 'fall duration decreases after correct classifications')
  const durationAfterSix = snapshot.practice.fallDuration
  await page.screenshot({ path: path.join(output, `${viewport.width}x${viewport.height}-playing.png`) })
  if ((await state(page)).practice.paused) await page.getByRole('button', { name: '▶ Continuar' }).click()

  snapshot = (await state(page))
  const correct = snapshot.practice.activeItem.bin
  const wrong = ['organic', 'paper', 'plastic', 'metal'].find(bin => bin !== correct)
  await page.locator('[data-practice-item]').click({ force: true })
  await page.locator(`[data-practice-bin="${wrong}"]`).click()
  await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).practice.phase === 'over')
  snapshot = await state(page)
  assert.equal(snapshot.practice.score, 6)
  assert.equal(snapshot.practice.best, 6)
  assert.match(snapshot.practice.message, /no va en/)
  await page.waitForFunction(() => JSON.parse(localStorage.getItem('eco-ciudad-v1')).practiceBest === 6)
  await page.screenshot({ path: path.join(output, `${viewport.width}x${viewport.height}-over.png`), fullPage: true })

  await page.getByRole('button', { name: /Intentar de nuevo/ }).click()
  await page.evaluate(() => window.advanceTime(12000))
  await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).practice.phase === 'over')
  snapshot = await state(page)
  assert.equal(snapshot.practice.score, 0)
  assert.equal(snapshot.practice.best, 6)
  assert.match(snapshot.practice.message, /Se escapó/)

  const layout = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - innerWidth, title: document.querySelector('.wood-title')?.textContent, buttons: [...document.querySelectorAll('button')].every(button => button.getBoundingClientRect().width >= 44 && button.getBoundingClientRect().height >= 40) }))
  assert(layout.overflow <= 1, `horizontal overflow at ${viewport.width}px: ${layout.overflow}`)
  assert.match(layout.title, /Práctica de separación/)
  assert(layout.buttons, 'visible controls keep generous target sizes')
  assert.deepEqual(errors, [])
  results.push({ viewport, initialDuration, durationAfterSix, best: snapshot.practice.best, errors })
  await context.close()
}

fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify({ results }, null, 2))
await browser.close()
console.log(`Practice QA passed in ${results.length} viewports.`)
