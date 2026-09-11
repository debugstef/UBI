const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const out = path.join('qa-shots', 'social');
const fixture = path.join(out, '_picker-fixture.png');
const base = 'http://localhost:8081';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  async function shot(name) {
    await page.waitForTimeout(1200);
    const file = path.join(out, name);
    await page.screenshot({ path: file, fullPage: false });
    console.log('saved', file, fs.statSync(file).size);
  }

  // Discover async storage keys
  await page.goto(base + '/feed', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2500);
  const keys = await page.evaluate(() => Object.keys(localStorage));
  console.log('localStorage keys', keys.filter(k => /ubi|social|Async|persist/i.test(k) || k.includes('ubi')));
  console.log('all keys sample', keys.slice(0, 30));

  // Force empty posts while keeping valid users
  const wrote = await page.evaluate(() => {
    const KEY = 'ubi.social.v1';
    let raw = localStorage.getItem(KEY);
    // async-storage web sometimes prefixes
    const alt = Object.keys(localStorage).find((k) => k.includes('ubi.social'));
    const useKey = raw ? KEY : (alt || KEY);
    raw = localStorage.getItem(useKey);
    let blob;
    try { blob = raw ? JSON.parse(raw) : null; } catch { blob = null; }
    if (!blob || !Array.isArray(blob.users)) {
      // minimal valid current user
      blob = {
        version: 1,
        users: [{
          id: 'u-me',
          name: 'Marco',
          handle: '@marco',
          avatarInitial: 'M',
          avatarColor: '#4F6BFF',
          bio: '',
          district: 'Barranco',
          following: false,
          isCurrentUser: true,
          activity: { connections: 0, posts: 0, stories: 0, reactions: 0 },
        }],
        posts: [],
        stories: [],
        reels: [],
        savedAt: new Date().toISOString(),
      };
    } else {
      blob.posts = [];
      blob.version = 1;
      blob.savedAt = new Date().toISOString();
    }
    localStorage.setItem(useKey, JSON.stringify(blob));
    localStorage.setItem(KEY, JSON.stringify(blob));
    return { useKey, posts: blob.posts.length, users: blob.users.length };
  });
  console.log('wrote empty', wrote);
  await page.reload({ waitUntil: 'networkidle' }).catch(()=>{});
  await page.waitForTimeout(3000);
  await shot('16-feed-empty-cta.png');

  // Picker ? Image proof on create
  await page.goto(base + '/create', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2000);
  // ensure Publicaci?n / Post mode
  const pub = page.getByText('Publicaci?n', { exact: true });
  if (await pub.count()) await pub.first().click().catch(()=>{});
  await page.waitForTimeout(500);

  page.once('filechooser', async (chooser) => {
    await chooser.setFiles(fixture);
  });
  // Also listen input file
  const foto = page.getByText('Foto', { exact: true });
  const anadir = page.getByText(/A?adir foto|Anadir foto|Foto/);
  if (await foto.count()) {
    await foto.first().click();
  } else if (await anadir.count()) {
    await anadir.first().click();
  } else {
    // try accessibility
    await page.getByLabel(/foto|Foto/i).first().click().catch(()=>{});
  }
  await page.waitForTimeout(3500);
  await shot('17-picker-image-proof.png');

  // Soft: Siguiendo - follow then shot suggestions area
  await page.goto(base + '/feed', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(2000);
  // restore mocks? skip - may be empty
  await shot('18-feed-state-after-empty-persist.png');

  fs.writeFileSync(path.join(out, 'QA-FAILS-CAPTURED.txt'), new Date().toISOString() + '\n' + JSON.stringify(wrote));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
