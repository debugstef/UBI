const { chromium } = require('playwright');
const path = require('path');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(60000);
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  await page.getByText('Ir directo al mapa').click();
  await page.waitForTimeout(3000);

  // Default selected should be first event - capture
  const sheet1 = await page.locator('text=Glow Night Barranco').count();
  await page.screenshot({ path: path.join(out, 'sync-01-default.png') });

  // Tap pins by approximate positions from layout: 20%/30%, 58%/48%, 34%/64% of map area
  // Map fills most of viewport; pins are absolute % of map container
  const box = await page.locator('body').boundingBox();
  // try clicking at pin regions - web overlay pins
  const taps = [
    { name: 'pink-diamond', x: 420 * 0.20 + 24, y: 900 * 0.30 + 40 },
    { name: 'gold-circle', x: 420 * 0.58 + 24, y: 900 * 0.48 + 20 },
    { name: 'blue-tri', x: 420 * 0.34 + 24, y: 900 * 0.58 },
  ];

  const results = [];
  for (const t of taps) {
    await page.mouse.click(t.x, t.y);
    await page.waitForTimeout(800);
    const titles = ['Glow Night Barranco', 'Previa Miraflores', 'Rooftop San Isidro'];
    let found = null;
    for (const title of titles) {
      if (await page.getByText(title).count()) { found = title; break; }
    }
    const file = path.join(out, `sync-${t.name}.png`);
    await page.screenshot({ path: file });
    results.push({ tap: t.name, sheetTitle: found, x: t.x, y: t.y });
  }

  console.log(JSON.stringify({ sheet1Default: sheet1 > 0, results }, null, 2));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
