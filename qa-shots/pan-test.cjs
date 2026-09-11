const { chromium } = require('playwright');
const path = require('path');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(90000);
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.getByText(/Open map|Ir directo|mapa/i).first().click();
  await page.waitForTimeout(5000);

  // wait for leaflet markers
  await page.waitForSelector('.leaflet-marker-icon, .ubi-pin', { timeout: 20000 });
  const before = await page.locator('.leaflet-marker-icon').first().boundingBox();
  await page.screenshot({ path: path.join(out, 'pins-before-pan.png') });

  // pan the map by dragging
  const box = page.viewportSize();
  await page.mouse.move(box.width / 2, box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.width / 2 - 120, box.height / 2, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(800);

  const after = await page.locator('.leaflet-marker-icon').first().boundingBox();
  await page.screenshot({ path: path.join(out, 'pins-after-pan.png') });

  const dx = Math.abs((after?.x ?? 0) - (before?.x ?? 0));
  const dy = Math.abs((after?.y ?? 0) - (before?.y ?? 0));
  console.log(JSON.stringify({ before, after, moved: dx + dy > 20, dx, dy }, null, 2));
  await browser.close();
})().catch((e) => { console.error(String(e)); process.exit(1); });
