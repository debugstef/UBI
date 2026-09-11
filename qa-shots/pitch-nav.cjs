const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots/pitch');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(45000);
  await page.goto('http://localhost:8081', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  await page.getByRole('button', { name: /Abrir mapa/i }).click();
  await page.waitForTimeout(5000);
  await page.screenshot({ path: path.join(out, '10-map.png') });
  // click tab by role
  for (const label of ['Feed','Crear','Chats','Perfil']) {
    const tab = page.getByRole('tab', { name: new RegExp(label, 'i') });
    if (await tab.count()) {
      await tab.first().click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(out, `10-${label.toLowerCase()}.png`) });
      console.log('TAB_'+label);
    } else {
      // fallback: bottom click areas
      console.log('NO_TAB_'+label);
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
