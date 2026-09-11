const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('qa-shots', 'social');
fs.mkdirSync(out, { recursive: true });
const base = 'http://localhost:8081';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  async function shot(name) {
    const file = path.join(out, name);
    await page.waitForTimeout(1500);
    await page.screenshot({ path: file, fullPage: false });
    console.log('saved', file);
  }

  // Onboarding social slide = index 1
  await page.goto(base + '/onboarding', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2000);
  await shot('07b-onboarding-map.png');
  // Click Continuar
  const cont = page.getByText('Continuar', { exact: true });
  if (await cont.count()) {
    await cont.first().click();
    await page.waitForTimeout(1500);
  }
  await shot('08-onboarding-social.png');

  // Feed follow interaction
  await page.goto(base + '/feed', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2500);
  await shot('09-feed-before-follow.png');
  const seguir = page.getByText('Seguir', { exact: true });
  if (await seguir.count()) {
    await seguir.first().click();
    await page.waitForTimeout(1000);
  }
  await shot('10-feed-after-follow.png');
  await page.reload({ waitUntil: 'networkidle' }).catch(()=>{});
  await page.waitForTimeout(2500);
  await shot('11-feed-after-reload.png');

  // Profile after follow (score)
  await page.goto(base + '/profile', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2500);
  await shot('12-profile-after-follow.png');

  // Empty CTA: clear social persist keys then feed
  await page.goto(base + '/feed', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.evaluate(() => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach((k) => {
        if (/ubi\.social|social|asyncstorage/i.test(k) || k.includes('ubi.social')) localStorage.removeItem(k);
      });
      // expo async storage web often uses these
      keys.forEach((k) => {
        if (k.toLowerCase().includes('persist') || k.includes('AsyncStorage')) localStorage.removeItem(k);
      });
    } catch (e) {}
  });
  // Force empty by hacking react state is hard; try clear and reload
  await page.reload({ waitUntil: 'networkidle' }).catch(()=>{});
  await page.waitForTimeout(2000);
  // If still not empty, navigate with query hack - skip
  await shot('13-feed-attempt-empty.png');

  // Create + map
  await page.goto(base + '/create', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2000);
  await shot('14-create.png');
  await page.goto(base + '/map', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2500);
  await shot('15-map.png');

  fs.writeFileSync(
    path.join(out, 'INTERACTION-CAPTURED.txt'),
    `interaction smoke ${new Date().toISOString()}\n`
  );
  await browser.close();
  console.log('interaction done');
})().catch((e) => { console.error(e); process.exit(1); });
