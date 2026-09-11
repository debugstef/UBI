const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('qa-shots', 'social');
fs.mkdirSync(out, { recursive: true });
const base = 'http://localhost:8081';
(async () => {
  const browser = await chromium.launch({ headless: true });
  for (const [w, h, tag] of [[320, 640, '320'], [430, 932, '430']]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    for (const [name, url] of [['feed', '/feed'], ['map', '/map'], ['reels', '/reels'], ['profile', '/profile']]) {
      await page.goto(base + url, { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
      await page.waitForTimeout(2000);
      const file = path.join(out, `optical-${tag}-${name}.png`);
      await page.screenshot({ path: file, fullPage: false });
      console.log('saved', file);
    }
    await page.close();
  }
  await browser.close();
})().catch((e)=>{console.error(e); process.exit(1);});
