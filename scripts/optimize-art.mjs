// Encode generated artwork for the web, retaining transparency and provenance.
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from 'playwright'

const jobs = [
  { source: process.argv[2], name: 'explorers.webp', width: 900, alpha: true },
  { source: process.argv[3], name: 'city-map.webp', width: 1120, alpha: false },
  ...(process.argv[4] ? [{ source: process.argv[4], name: 'locations.webp', width: 1600, alpha: false }] : []),
]
const directory = path.resolve('public/art')
fs.mkdirSync(directory, { recursive: true })
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  for (const job of jobs) {
    const input = fs.readFileSync(job.source).toString('base64')
    const result = await page.evaluate(async ({ input, width }) => {
      const img = new Image()
      img.src = `data:image/png;base64,${input}`
      await img.decode()
      const canvas = document.createElement('canvas')
      canvas.width = Math.min(width, img.naturalWidth)
      canvas.height = Math.round(img.naturalHeight * canvas.width / img.naturalWidth)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let transparent = 0
      for (let index = 3; index < data.length; index += 4) if (data[index] === 0) transparent++
      return { data: canvas.toDataURL('image/webp', .85).split(',')[1], width: canvas.width, height: canvas.height, transparent }
    }, { input, width: job.width })
    if (job.alpha && result.transparent === 0) throw new Error('Character cutout has no transparency')
    const bytes = Buffer.from(result.data, 'base64')
    fs.writeFileSync(path.join(directory, job.name), bytes)
    console.log(`${job.name}: ${result.width}x${result.height}, ${(bytes.length / 1024).toFixed(1)} KB, ${result.transparent} transparent pixels`)
  }
} finally { await browser.close() }
