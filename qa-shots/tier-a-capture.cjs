const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('C:/Users/miche/ubi-v.1.1/qa-shots/tier-a');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 420, height: 900 } });
  page.setDefaultTimeout(60000);
  const notes = [];

  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(out, '01-splash.png') });

  // Enter map
  const enter = page.getByText(/Ir directo|Open map|mapa/i).first();
  if (await enter.count()) {
    await enter.click();
  } else {
    // maybe already routed
    notes.push('no splash CTA found — may already be on map');
  }
  await page.waitForTimeout(4000);
  await page.screenshot({ path: path.join(out, '02-map-default.png') });

  // Sheet + scrubber region
  await page.screenshot({ path: path.join(out, '03-sheet-region.png'), clip: { x: 0, y: 480, width: 420, height: 340 } });
  await page.screenshot({ path: path.join(out, '04-scrubber-region.png'), clip: { x: 330, y: 380, width: 90, height: 280 } });

  // LIVE honesty: look for LIVE badge text
  const liveCount = await page.getByText('LIVE', { exact: true }).count();
  notes.push('LIVE_badge_count=' + liveCount);

  // Status line
  const statusLive = await page.getByText(/en vivo|noche quieta/i).count();
  notes.push('status_line_hits=' + statusLive);

  // Quiet night via Amigos filter
  const amigos = page.getByText('Amigos', { exact: true }).first();
  if (await amigos.count()) {
    await amigos.click();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(out, '05-amigos-filter.png') });
    const quiet = await page.getByText(/Noche quieta|nada por tu zona|agranda/i).count();
    notes.push('quiet_empty_hits=' + quiet);
  } else {
    notes.push('Amigos chip missing');
  }

  // Reset to Cerca
  const cerca = page.getByText('Cerca', { exact: true }).first();
  if (await cerca.count()) await cerca.click();
  await page.waitForTimeout(800);

  // Plan B from sheet
  const planB = page.getByText('Plan B', { exact: true }).first();
  if (await planB.count()) {
    await planB.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(out, '06-plan-b.png') });
    const planCopy = await page.getByText(/Plan B|fallback|patas|menos calor|cerca/i).count();
    notes.push('plan_b_copy_hits=' + planCopy);
  } else {
    notes.push('Plan B button missing on sheet');
  }

  fs.writeFileSync(path.join(out, 'notes.txt'), notes.join('\n'));
  console.log(notes.join(' | '));
  console.log('TIER_A_QA_OK');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
