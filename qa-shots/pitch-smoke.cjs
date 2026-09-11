const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots/pitch');
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(45000);
  const notes = [];
  try {
    await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2500);
    await page.screenshot({ path: path.join(out, '01-splash.png') });
    notes.push('splash_ok');
    const start = page.getByText(/Empezar|Abrir mapa|Ir directo|mapa/i).first();
    if (await start.count()) { await start.click(); await page.waitForTimeout(3000); }
    await page.screenshot({ path: path.join(out, '02-after-splash.png') });
    // skip onboarding if present
    const skip = page.getByText(/Saltar|Skip|Abrir mapa|Mapa/i).first();
    if (await skip.count()) { await skip.click(); await page.waitForTimeout(2500); }
    await page.screenshot({ path: path.join(out, '03-map.png') });
    // tabs
    for (const [name, file] of [['Feed','04-feed.png'],['Crear','05-create.png'],['Chats','06-chats.png'],['Perfil','07-profile.png']]) {
      const t = page.getByText(name, { exact: true }).first();
      if (await t.count()) { await t.click(); await page.waitForTimeout(1500); await page.screenshot({ path: path.join(out, file) }); notes.push(name+'_ok'); }
      else notes.push(name+'_missing');
    }
  } catch (e) { notes.push('ERR:'+e.message); }
  fs.writeFileSync(path.join(out, 'notes.txt'), notes.join('\n'));
  console.log(notes.join(' | '));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
