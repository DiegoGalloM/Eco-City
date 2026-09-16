import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const output = path.resolve('test-results/full-game')
fs.mkdirSync(output, { recursive: true })
const browser = await chromium.launch({ headless: true })
const base = process.env.ECO_CITY_URL || 'http://127.0.0.1:5173'
const viewports = [
  { width: 360, height: 800 }, { width: 390, height: 844 }, { width: 768, height: 1024 },
  { width: 1366, height: 768 }, { width: 1440, height: 900 }, { width: 320, height: 740 }, { width: 1920, height: 1080 },
]
const results = []
let failure = null
const state = page => page.evaluate(() => JSON.parse(window.render_game_to_text()))
const center = async locator => { const b = await locator.boundingBox(); assert(b); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }
async function shot(page, name) {
  await page.waitForTimeout(280)
  const v = page.viewportSize()
  await page.screenshot({ path: path.join(output, `${v.width}x${v.height}-${name}.png`), fullPage: true })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  for (const button of await page.locator('.map-header > button').all()) {
    const box = await button.boundingBox()
    assert(box && box.x >= 0 && box.x + box.width <= v.width, `${name}: header control clipped`)
  }
  assert(overflow <= 1, `${name}: horizontal overflow ${overflow}`)
}
async function screen(page, name) { await page.waitForSelector(`[data-screen="${name}"]`); assert.equal((await state(page)).mode, name) }
async function enter(page, name) {
  await page.getByRole('button', { name: new RegExp(`^${name}\\.`) }).click()
  await page.locator('.zone-panel__enter').click()
  await screen(page, 'mission')
}
async function startSorting(page) {
  await page.locator('#start-btn').click()
  await enter(page, 'Escuela')
  await page.getByRole('button', { name: '¿Qué podemos hacer?' }).click()
  await page.locator('[data-choice="refill"]').click()
  await page.getByRole('button', { name: /A separar residuos/ }).click()
  await screen(page, 'minigame')
}
async function finishRecycling(page, duration) {
  await screen(page, 'minigame')
  assert.equal((await state(page)).recycling.fallDuration, duration)
  const before = (await state(page)).recycling.activeItem.fallProgress
  await page.evaluate(() => window.advanceTime(1000))
  const delta = (await state(page)).recycling.activeItem.fallProgress - before
  assert(Math.abs(delta - 1000 / duration) < .04, 'Falling speed matches the zone')
  for (const bin of ['organic', 'plastic', 'paper', 'metal', 'organic', 'paper', 'plastic', 'metal']) {
    await page.locator('.falling-item').focus()
    await page.keyboard.press('Enter')
    await page.locator(`[data-bin="${bin}"]`).focus()
    await page.keyboard.press('Enter')
  }
  assert.equal((await state(page)).recycling.sorted.length, 8)
  await page.getByRole('button', { name: /Volver a mi ciudad/ }).click()
}
async function mouseDrag(page, destination) {
  const start = await center(page.locator('.falling-item'))
  const end = typeof destination === 'string' ? await center(page.locator(`[data-bin="${destination}"]`)) : destination
  await page.mouse.move(start.x, start.y); await page.mouse.down()
  await page.mouse.move(end.x, end.y, { steps: 18 }); await page.mouse.up()
}
async function touchDrag(page, cdp, destination) {
  const start = await center(page.locator('.falling-item')), end = await center(page.locator(`[data-bin="${destination}"]`))
  const touch = (type, point) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: point ? [{ x: point.x, y: point.y, radiusX: 5, radiusY: 5, force: 1, id: 1 }] : [] })
  await touch('touchStart', start)
  for (let i = 1; i <= 12; i++) await touch('touchMove', { x: start.x + (end.x - start.x) * i / 12, y: start.y + (end.y - start.y) * i / 12 })
  await touch('touchEnd')
}

try {
  for (const viewport of viewports.filter(viewport => !process.env.ECO_QA_WIDTH || viewport.width === Number(process.env.ECO_QA_WIDTH))) {
    const context = await browser.newContext({ viewport, hasTouch: true })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto(base)
    await shot(page, 'landing')
    await page.getByRole('button', { name: /Cómo se juega/ }).click()
    assert(await page.getByRole('dialog').isVisible())
    await page.keyboard.press('Shift+Tab')
    assert.equal(await page.evaluate(() => document.activeElement?.textContent), '¡Vamos!')
    await page.keyboard.press('Escape')
    await page.locator('#start-btn').focus(); await page.keyboard.press('Enter')
    await shot(page, 'map-before')
    await enter(page, 'Casa')
    assert.equal(await page.getByRole('button', { name: '¿Qué podemos hacer?' }).count(), 0)
    await page.getByRole('button', { name: 'Volver al mapa', exact: true }).first().click()
    await enter(page, 'Escuela'); await shot(page, 'school-mission')
    await page.getByRole('button', { name: '¿Qué podemos hacer?' }).click(); await shot(page, 'school-decision')
    await page.locator('[data-choice="disposable"]').click()
    assert.equal((await state(page)).resources.planet, 12)
    assert.equal((await state(page)).zones.find(zone => zone.id === 'home').status, 'locked')
    await page.getByRole('button', { name: 'Probar otra idea' }).click()
    await page.locator('[data-choice="refill"]').click()
    assert.deepEqual((await state(page)).resources, { planet: 30, community: 30, resources: 30 })
    await shot(page, 'school-result')
    await page.getByRole('button', { name: /A separar residuos/ }).click()
    await shot(page, 'recycling')

    // Automatic return at the bottom, no lost items or soft lock.
    await page.evaluate(() => window.advanceTime(20000))
    await page.waitForTimeout(60)
    assert.match((await state(page)).recycling.message, /Otra oportunidad/)
    assert.equal((await state(page)).recycling.sorted.length, 0)
    // Drop outside and wrong bin both keep the item recoverable.
    await mouseDrag(page, { x: 5, y: 100 })
    assert.equal((await state(page)).recycling.sorted.length, 0)
    await mouseDrag(page, 'metal')
    assert.equal((await state(page)).recycling.mistakes, 1)
    assert.equal((await state(page)).recycling.sorted.length, 0)
    await mouseDrag(page, 'organic')
    assert.equal((await state(page)).recycling.sorted.length, 1)

    // Real touch stream -> browser Pointer Events, same implementation as mouse.
    const cdp = await context.newCDPSession(page)
    await touchDrag(page, cdp, 'plastic')
    assert.equal((await state(page)).recycling.sorted.length, 2)
    // Tap fallback.
    let point = await center(page.locator('.falling-item'))
    await page.touchscreen.tap(point.x, point.y)
    await page.locator('[data-bin="paper"]').tap()
    assert.equal((await state(page)).recycling.sorted.length, 3)
    // Keyboard fallback; pause selected object while deciding.
    await page.locator('.falling-item').focus(); await page.keyboard.press('Enter')
    const frozen = (await state(page)).recycling.activeItem.fallProgress
    await page.evaluate(() => window.advanceTime(5000))
    assert.equal((await state(page)).recycling.activeItem.fallProgress, frozen)
    await page.locator('[data-bin="metal"]').focus(); await page.keyboard.press('Enter')
    assert.equal((await state(page)).recycling.sorted.length, 4)
    // Explicit pause and settings both freeze falling.
    await page.getByRole('button', { name: /Pausa/ }).click()
    const paused = (await state(page)).recycling.activeItem.fallProgress
    await page.evaluate(() => window.advanceTime(10000))
    assert.equal((await state(page)).recycling.activeItem.fallProgress, paused)
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await page.getByRole('button', { name: 'Abrir ajustes' }).click()
    const modalFall = (await state(page)).recycling.activeItem.fallProgress
    await page.evaluate(() => window.advanceTime(10000))
    assert.equal((await state(page)).recycling.activeItem.fallProgress, modalFall)
    await page.getByRole('button', { name: 'Sonido', exact: true }).click()
    await page.getByRole('button', { name: 'Listo' }).click()

    // Reload mid-session restores completed decisions and sorted objects.
    await page.reload(); await page.locator('#start-btn').click()
    assert.equal((await state(page)).recycling.sorted.length, 4)
    assert.equal((await state(page)).settings.sound, false)
    await page.locator('.recycle-shortcut').click()
    for (const bin of ['organic', 'paper', 'plastic', 'metal']) {
      await page.locator('.falling-item').focus(); await page.keyboard.press('Enter')
      await page.locator(`[data-bin="${bin}"]`).focus(); await page.keyboard.press('Enter')
    }
    assert.equal((await state(page)).recycling.sorted.length, 8)
    await shot(page, 'recycling-complete')
    await page.getByRole('button', { name: /Volver a mi ciudad/ }).click()
    for (const [zone, choice, duration] of [['Casa', 'repair', 14000], ['Parque', 'restore', 10000], ['Comunidad', 'walk', 7000]]) {
      await enter(page, zone)
      await shot(page, `${choice}-mission`)
      await page.getByRole('button', { name: '¿Qué podemos hacer?' }).click()
      await page.locator(`[data-choice="${choice}"]`).click()
      await shot(page, `${choice}-result`)
      await page.locator('.story-actions .primary-button').click()
      await shot(page, `${choice}-recycling`)
      await finishRecycling(page, duration)
    }
    await screen(page, 'achievements'); await shot(page, 'achievements')
    assert.equal(await page.locator('.badge-card--locked').count(), 0)
    await page.getByRole('button', { name: /Ver mi ciudad sostenible/ }).click()
    await screen(page, 'final'); await shot(page, 'final')
    assert.equal((await state(page)).score, 100)
    assert.equal((await state(page)).finished, true)
    await page.getByRole('button', { name: 'Explorar mi ciudad' }).click(); await shot(page, 'map-complete')
    assert.equal(await page.locator('.zone--completed').count(), 4)
    await page.reload(); await page.locator('#start-btn').click()
    assert.equal((await state(page)).score, 100)
    await page.getByRole('button', { name: /Ver mi ciudad sostenible/ }).click()
    await page.getByRole('button', { name: 'Volver a jugar' }).click()
    await page.getByRole('button', { name: 'Seguir con mi ciudad' }).click()
    assert.equal((await state(page)).score, 100)
    await page.getByRole('button', { name: 'Volver a jugar' }).click()
    await page.getByRole('button', { name: 'Sí, volver a empezar' }).click()
    await screen(page, 'landing')
    assert.equal((await state(page)).completedMissions.length, 0)
    assert.equal((await state(page)).recycling.sorted.length, 0)
    assert.deepEqual(errors, [])
    results.push({ viewport, passed: true, consoleErrors: errors, checks: 'Full journey, all choices replace scores, mouse/touch/tap/keyboard, wrong/outside drop, retry, pause, reload, badges, score, restart, overflow' })
    console.log(`PASS ${viewport.width}x${viewport.height}: full journey and all input modes`)
    await context.close()
  }
  // Cancellation, resized boards, edge hits, duplicate input and tab backgrounding.
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
    const page = await context.newPage()
    await page.goto(base); await startSorting(page)
    const cdp = await context.newCDPSession(page)
    const initial = await center(page.locator('.falling-item'))
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...initial, id: 1 }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: initial.x + 100, y: initial.y + 100, id: 1 }] })
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
    assert.equal((await state(page)).recycling.sorted.length, 0)
    await page.locator('.falling-item').focus(); await page.keyboard.press('Escape')
    assert.equal((await state(page)).recycling.activeItem.selected, false)
    await page.setViewportSize({ width: 768, height: 1024 })
    const edge = await page.locator('[data-bin="organic"]').boundingBox()
    await mouseDrag(page, { x: edge.x + 3, y: edge.y + 3 })
    assert.equal((await state(page)).recycling.sorted.length, 1)
    await page.locator('.falling-item').focus(); await page.keyboard.press('Enter')
    await page.locator('[data-bin="plastic"]').dblclick()
    assert.equal((await state(page)).recycling.sorted.length, 2)
    assert.equal(new Set((await state(page)).recycling.sorted).size, 2)
    await page.evaluate(() => window.dispatchEvent(new Event('blur')))
    await page.waitForTimeout(40)
    assert.equal((await state(page)).recycling.paused, true)
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await page.locator('.falling-item').focus(); await page.keyboard.press('Enter')
    await page.locator('[data-bin="paper"]').focus(); await page.keyboard.press('Enter')
    assert.equal((await state(page)).recycling.sorted.length, 3)
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute('data-item')), 'can')
    await context.close(); console.log('PASS pointer cancellation, resize, edge drops, duplicate input, blur, focus continuity')
  }
  // Legacy saves migrate without losing decisions or school recycling.
  {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(() => {
      if (!localStorage.getItem('eco-ciudad-v1')) localStorage.setItem('eco-ciudad-v1', JSON.stringify({
        version: 1, answers: { school: 'campaign', home: 'reuse', park: 'clean', community: 'bus' },
        sorted: ['banana', 'bottle', 'banana', 'fake'], mistakes: 2, sound: false, reduceMotion: true,
      }))
    })
    await page.goto(base); await page.locator('#start-btn').click()
    let snapshot = await state(page)
    assert.deepEqual(snapshot.recyclingByZone.school, ['banana', 'bottle'])
    assert.equal(snapshot.answeredMissions.length, 4)
    assert.equal(snapshot.finished, false)
    assert(snapshot.score < 100)
    await page.reload(); await page.locator('#start-btn').click()
    snapshot = await state(page)
    assert.deepEqual(snapshot.recyclingByZone.school, ['banana', 'bottle'])
    assert.equal(snapshot.answeredMissions.length, 4)
    await page.getByRole('button', { name: /^Casa\./ }).click()
    await page.locator('.zone-panel__enter').click()
    await screen(page, 'minigame')
    await page.locator('.falling-item').click()
    await page.locator('[data-bin="organic"]').click()
    await page.reload(); await page.locator('#start-btn').click()
    assert.deepEqual((await state(page)).recyclingByZone.home, ['banana'])
    assert.deepEqual((await state(page)).recyclingByZone.school, ['banana', 'bottle'])
    for (const zone of ['Escuela', 'Casa', 'Parque', 'Comunidad']) {
      await page.getByRole('button', { name: new RegExp(`^${zone}[.]`) }).click()
      await page.locator('.zone-panel__enter').click()
      await screen(page, 'minigame')
      while ((await state(page)).recycling.activeItem) {
        const item = (await state(page)).recycling.activeItem
        await page.locator('.falling-item').focus(); await page.keyboard.press('Enter')
        await page.locator(`[data-bin="${item.bin}"]`).focus(); await page.keyboard.press('Enter')
      }
      await page.getByRole('button', { name: /Volver a mi ciudad/ }).click()
    }
    await screen(page, 'achievements')
    await page.getByRole('button', { name: /Ver mi ciudad sostenible/ }).click()
    assert.equal((await state(page)).finished, true)
    assert.equal((await state(page)).score, 80)
    await context.close()
    console.log('PASS legacy migration, zone isolation, partial-zone reload and decision-dependent score')
  }
  // Invalid saves recover; denied storage remains playable; reduced-motion does not fall.
  for (const scenario of ['corrupt', 'invalid', 'denied', 'reduced']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: scenario === 'reduced' ? 'reduce' : 'no-preference' })
    const page = await context.newPage()
    if (scenario === 'corrupt') await page.addInitScript(() => localStorage.setItem('eco-ciudad-v1', '{broken'))
    if (scenario === 'invalid') await page.addInitScript(() => localStorage.setItem('eco-ciudad-v1', JSON.stringify({ version: 1, answers: { school: 'bad', home: 'repair' }, sorted: ['fake'], mistakes: -100 })))
    if (scenario === 'denied') await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('Blocked') } })
    await page.goto(base); await startSorting(page)
    if (scenario === 'reduced') {
      await page.evaluate(() => window.advanceTime(30000))
      assert.equal((await state(page)).recycling.activeItem.fallProgress, 0)
      await shot(page, 'reduced-motion')
    }
    if (scenario === 'denied') assert(await page.locator('.storage-notice').isVisible())
    await context.close(); console.log(`PASS ${scenario}`)
  }
} catch (error) {
  failure = error.stack || String(error)
  throw error
} finally {
  await browser.close()
  fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify({ passed: failure === null, failure, viewports: results }, null, 2))
}
