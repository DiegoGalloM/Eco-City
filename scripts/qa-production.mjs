import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import http from 'node:http'
import { chromium } from 'playwright'

const root = path.resolve('dist')
const output = 'test-results/production'
await fs.mkdir(output, { recursive: true })
const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost')
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname))
  if (!file.startsWith(root + path.sep)) { response.writeHead(403).end(); return }
  try {
    const content = await fs.readFile(file)
    response.setHeader('Content-Type', ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp' })[path.extname(file)] || 'application/octet-stream')
    response.end(content)
  } catch { response.writeHead(404).end() }
})
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
const url = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch()
const results = []
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', e => errors.push(e.message))
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
    await page.goto(url)
    await page.waitForLoadState('networkidle')
    const performance = await page.evaluate(async () => {
      const deltas = []
      await new Promise(resolve => {
        let previous
        const step = now => { if (previous) deltas.push(now - previous); previous = now; if (deltas.length < 60) requestAnimationFrame(step); else resolve() }
        requestAnimationFrame(step)
      })
      const nav = window.performance.getEntriesByType('navigation')[0]
      return { firstContentfulPaintMs: window.performance.getEntriesByName('first-contentful-paint')[0]?.startTime, domContentLoadedMs: nav.domContentLoadedEventEnd, transferBytes: window.performance.getEntriesByType('resource').reduce((sum, r) => sum + r.transferSize, nav.transferSize), animationFrameMedianMs: deltas.sort((a,b) => a-b)[30] }
    })
    await page.locator('#start-btn').click()
    await page.screenshot({ path: `${output}/${width}-map.png`, fullPage: true })
    for (const zone of ['Escuela', 'Casa', 'Parque', 'Comunidad']) {
      await page.getByRole('button', { name: new RegExp(`^${zone}[.]`) }).click()
      await page.locator('.zone-panel__enter').click()
      await page.screenshot({ path: `${output}/${width}-${zone}.png`, fullPage: true, animations: 'disabled' })
      for (const art of await page.locator('.story-scene .item-art').all()) {
        const box = await art.boundingBox()
        assert(box && box.width < 100, 'Scene object must retain its own SVG viewport')
      }
      await page.getByRole('button', { name: 'Volver al mapa', exact: true }).first().click()
    }
    assert.deepEqual(errors, [])
    results.push({ width, ...performance, consoleErrors: errors })
    await context.close()
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await context.newPage()
  const exceptions = []
  page.on('pageerror', e => exceptions.push(e.message))
  await page.route('**/art/*.webp', route => route.fulfill({ status: 200, contentType: 'image/webp', body: 'invalid image' }))
  await page.goto(url); await page.waitForTimeout(500)
  await page.screenshot({ path: `${output}/image-fallback.png`, fullPage: true })
  await page.locator('#start-btn').click()
  await page.waitForTimeout(300)
  assert.equal(await page.locator('.map-stage--painted').count(), 0)
  assert.equal(await page.locator('.zone').count(), 4)
  assert.deepEqual(exceptions, [])
  await context.close()
  await fs.writeFile(`${output}/summary.json`, JSON.stringify({ passed: true, environment: 'Local production build, Chromium, no network or CPU throttling; not a Lighthouse score or physical-device benchmark.', results, imageFallback: true }, null, 2))
  console.log(JSON.stringify(results, null, 2))
  console.log('PASS production load, console and image fallbacks')
} finally {
  await browser.close()
  await new Promise(resolve => server.close(resolve))
}
