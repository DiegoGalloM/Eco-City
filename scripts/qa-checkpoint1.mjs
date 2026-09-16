import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const baseUrl = process.env.ECO_CITY_URL || 'http://127.0.0.1:5173'
const outputDir = path.resolve('test-results/checkpoint-1')
const viewports = [
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
]

fs.mkdirSync(outputDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const results = []

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const errors = []
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => errors.push(`page: ${String(error)}`))

  await page.goto(baseUrl, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(outputDir, `landing-${viewport.name}.png`), fullPage: true })

  const landing = await page.evaluate(() => {
    const start = document.querySelector('#start-btn')?.getBoundingClientRect()
    const help = document.querySelector('.text-button')?.getBoundingClientRect()
    return {
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      verticalOverflow: document.documentElement.scrollHeight - window.innerHeight,
      startSize: start ? { width: start.width, height: start.height } : null,
      helpSize: help ? { width: help.width, height: help.height } : null,
      state: JSON.parse(window.render_game_to_text()),
    }
  })

  await page.getByRole('button', { name: '¿Cómo se juega?' }).click()
  const modalFits = await page.evaluate(() => {
    const modal = document.querySelector('.modal-card')?.getBoundingClientRect()
    return modal ? modal.top >= 0 && modal.bottom <= window.innerHeight && modal.left >= 0 && modal.right <= window.innerWidth : false
  })
  await page.getByRole('button', { name: 'Cerrar' }).click()

  await page.getByRole('button', { name: 'Abrir ajustes' }).click()
  await page.getByRole('button', { name: 'Sonido activado' }).click()
  const soundToggled = await page.evaluate(() => JSON.parse(window.render_game_to_text()).settings.sound === false)
  await page.getByRole('button', { name: 'Guardar' }).click()

  await page.locator('#start-btn').focus()
  await page.keyboard.press('Enter')
  await page.getByRole('button', { name: /Comunidad\./ }).click()
  await page.evaluate(() => window.advanceTime(120))
  await page.screenshot({ path: path.join(outputDir, `map-${viewport.name}.png`), fullPage: true })

  const map = await page.evaluate(() => {
    const panel = document.querySelector('.zone-panel')?.getBoundingClientRect()
    const labels = [...document.querySelectorAll('.zone__label')].map((node) => {
      const rect = node.getBoundingClientRect()
      const overlap = panel ? Math.max(0, Math.min(rect.bottom, panel.bottom) - Math.max(rect.top, panel.top)) : 0
      return { text: node.textContent, top: rect.top, bottom: rect.bottom, visible: rect.top >= 0 && rect.bottom <= window.innerHeight, panelOverlap: overlap }
    })
    return {
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      verticalOverflow: document.documentElement.scrollHeight - window.innerHeight,
      labels,
      state: JSON.parse(window.render_game_to_text()),
    }
  })

  const enteredZones = []
  for (const zone of ['Comunidad', 'Escuela', 'Casa', 'Parque']) {
    if (zone !== 'Comunidad') await page.getByRole('button', { name: new RegExp(`${zone}\\.`) }).click()
    const enterButton = page.getByRole('button', { name: `Entrar a ${zone}` })
    await enterButton.focus()
    await page.keyboard.press('Enter')
    const placeState = await page.evaluate(() => JSON.parse(window.render_game_to_text()))
    if (placeState.mode === 'place' && placeState.activePlace?.name === zone) enteredZones.push(zone)
    if (zone === 'Escuela') await page.screenshot({ path: path.join(outputDir, `place-${viewport.name}.png`), fullPage: true })
    await page.getByRole('button', { name: 'Volver al mapa' }).first().click()
  }

  await page.getByRole('button', { name: 'Volver a la portada' }).click()
  const returnedToLanding = await page.locator('[data-screen="landing"]').isVisible()

  results.push({ viewport, landing, modalFits, soundToggled, map, enteredZones, returnedToLanding, errors })
  await context.close()
}

await browser.close()
fs.writeFileSync(path.join(outputDir, 'qa-summary.json'), JSON.stringify(results, null, 2))

const failures = results.flatMap((result) => {
  const issues = []
  if (result.landing.horizontalOverflow > 1 || result.map.horizontalOverflow > 1) issues.push('horizontal overflow')
  if (!result.modalFits) issues.push('help modal clipped')
  if (!result.soundToggled) issues.push('settings toggle state mismatch')
  if (!result.returnedToLanding) issues.push('back navigation failed')
  if (result.enteredZones.length !== 4) issues.push(`place entry failed: ${result.enteredZones.join(', ')}`)
  if (result.map.state.selectedZone !== 'community') issues.push('zone selection state mismatch')
  if (result.errors.length) issues.push(...result.errors)
  if (result.map.labels.some((label) => !label.visible)) issues.push('zone label outside viewport')
  if (result.map.labels.some((label) => label.panelOverlap > 2)) issues.push('zone label overlaps information panel')
  return issues.map((issue) => `${result.viewport.name}: ${issue}`)
})

if (failures.length) {
  console.error(failures.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Checkpoint 1 QA passed at ${viewports.map(({ name }) => name).join(', ')}`)
}
