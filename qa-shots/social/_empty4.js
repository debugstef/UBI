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
  // scroll to publications empty
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find((e) => (e.textContent || '').includes('Sin publicaciones'));
    if (el) el.scrollIntoView({ block: 'center' });
    else window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);
  const file = path.join(out, '16-feed-empty-cta.png');
  await page.screenshot({ path: file, fullPage: false });
  const has = await page.getByText('Sin publicaciones', { exact: false }).count();
  const cta = await page.getByText('Ver mapa', { exact: true }).count();
  console.log('sin publicaciones count', has, 'ver mapa', cta, 'size', fs.statSync(file).size);
  // also full page
  await page.screenshot({ path: path.join(out, '16b-feed-empty-full.png'), fullPage: true });
  await browser.close();
})().catch((e)=>{console.error(e); process.exit(1);});
