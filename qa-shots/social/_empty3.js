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
  const file = path.join(out, '16-feed-empty-cta.png');
  await page.screenshot({ path: file, fullPage: false });
  console.log('saved', file, fs.statSync(file).size);
  const text = await page.locator('body').innerText();
  console.log('has empty?', text.includes('Sin publicaciones') || text.includes('Publicar'));
  console.log('snippet', text.slice(0, 400).replace(/\n/g, ' | '));
  await browser.close();
})().catch((e)=>{console.error(e); process.exit(1);});
