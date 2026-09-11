const { chromium } = require('playwright');
const path = require('path');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(60000);
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(out, '01-splash.png') });

  const mapBtn = page.getByText('Ir directo al mapa');
  await mapBtn.click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: path.join(out, '02-map-full.png'), fullPage: true });

  // crop-ish closeups via clip regions
  await page.screenshot({ path: path.join(out, '03-map-pins.png'), clip: { x: 0, y: 180, width: 420, height: 420 } });
  await page.screenshot({ path: path.join(out, '04-sheet.png'), clip: { x: 0, y: 520, width: 420, height: 300 } });
  await page.screenshot({ path: path.join(out, '05-scrubber.png'), clip: { x: 340, y: 420, width: 80, height: 220 } });

  await browser.close();
  console.log('SHOTS_OK');
})().catch((e) => { console.error(e); process.exit(1); });
