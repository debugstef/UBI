const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots/tier-a-r2');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(60000);
  const notes = [];

  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);
  const enter = page.getByText(/Ir directo|Open map|mapa/i).first();
  if (await enter.count()) { await enter.click(); await page.waitForTimeout(4500); }

  await page.screenshot({ path: path.join(out, '01-map.png') });
  notes.push('api_key_watermark=' + ((await page.content()).includes('API KEY REQUIRED')));

  // Scrubber region
  await page.screenshot({ path: path.join(out, '02-scrubber.png'), clip: { x: 330, y: 360, width: 90, height: 300 } });

  // Quiet: Amigos
  const amigos = page.getByText('Amigos', { exact: true }).first();
  if (await amigos.count()) {
    await amigos.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(out, '03-quiet.png') });
    const modal = await page.getByText('Pucha, nada por tu zona', { exact: false }).count();
    const statusQuiet = await page.getByText(/Noche quieta/i).count();
    const ampliar = await page.getByText('Ampliar radar').count();
    notes.push('quiet_body_in_modalish=' + modal + ' status_noche=' + statusQuiet + ' ampliar=' + ampliar);
  }

  // Reset Cerca
  const cerca = page.getByText('Cerca', { exact: true }).first();
  if (await cerca.count()) { await cerca.click(); await page.waitForTimeout(800); }

  // Alternas Plan B sheet
  const alt = page.getByText('Alternas', { exact: true }).first();
  if (await alt.count()) {
    await alt.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(out, '04-planb-sheet.png') });
    const planStatus = await page.getByText(/Plan B/i).count();
    const enVivoOnPlanB = await page.getByText(/en vivo/i).count();
    const opciones = await page.getByText(/opciones|menos calor|patas/i).count();
    notes.push('planb_hits=' + planStatus + ' en_vivo_while_alternas=' + enVivoOnPlanB + ' opciones_copy=' + opciones);
  } else {
    notes.push('Alternas chip missing');
  }

  fs.writeFileSync(path.join(out, 'notes.txt'), notes.join('\n'));
  console.log(notes.join(' | '));
  console.log('TIER_A_R2_OK');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
