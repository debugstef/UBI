const { chromium } = require('playwright');
const path = require('path');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(60000);
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: path.join(out, 'deslop-splash.png') });
  await page.getByText(/Open map|Ir directo|mapa/i).first().click();
  await page.waitForTimeout(3500);
  await page.screenshot({ path: path.join(out, 'deslop-map.png') });
  await browser.close();
  console.log('DESLOP_SHOTS_OK');
})().catch((e) => { console.error(e); process.exit(1); });
