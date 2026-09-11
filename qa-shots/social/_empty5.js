const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('qa-shots', 'social');
const base = 'http://localhost:8081';
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base + '/feed?qaEmpty=1', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(4000);
  const loc = page.getByText(/Sin publicaciones/i);
  console.log('count', await loc.count());
  if (await loc.count()) {
    await loc.first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  } else {
    // force scroll the RN scrollview
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(300);
    }
  }
  await page.screenshot({ path: path.join(out, '16-feed-empty-cta.png'), fullPage: false });
  // crop-focused: also screenshot the empty card if found
  if (await loc.count()) {
    await loc.first().screenshot({ path: path.join(out, '16c-empty-card-only.png') }).catch(()=>{});
  }
  const ver = page.getByText('Ver mapa', { exact: true });
  if (await ver.count()) await ver.first().screenshot({ path: path.join(out, '16d-empty-cta-btn.png') }).catch(()=>{});
  console.log('done sizes', fs.statSync(path.join(out,'16-feed-empty-cta.png')).size);
  await browser.close();
})().catch((e)=>{console.error(e); process.exit(1);});
