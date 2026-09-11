const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('qa-shots', 'social');
fs.mkdirSync(out, { recursive: true });

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const base = 'http://localhost:8081';
  const shots = [];
  async function shot(name, url) {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const file = path.join(out, name);
    await page.screenshot({ path: file, fullPage: false });
    shots.push(file);
    console.log('saved', file);
  }
  await shot('01-root.png', base + '/');
  await shot('02-feed.png', base + '/feed');
  await shot('03-map.png', base + '/map');
  await shot('04-create.png', base + '/create');
  await shot('05-reels.png', base + '/reels');
  await shot('06-profile.png', base + '/profile');
  // try onboarding
  await shot('07-onboarding.png', base + '/onboarding');
  fs.writeFileSync(path.join(out, 'CAPTURED.txt'), shots.join('\n') + '\n' + new Date().toISOString());
  await browser.close();
  console.log('done', shots.length);
})().catch((e) => { console.error(e); process.exit(1); });
