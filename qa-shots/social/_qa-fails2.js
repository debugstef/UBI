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
    await page.waitForTimeout(2000);
    const file = path.join(out, name);
    await page.screenshot({ path: file, fullPage: false });
    console.log('saved', name, fs.statSync(file).size);
  }

  await page.goto(base + '/feed', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(3000);
  await page.evaluate(() => sessionStorage.setItem('ubi.qa.emptyPosts', '1'));
  await page.reload({ waitUntil: 'networkidle' }).catch(()=>{});
  await page.waitForTimeout(3500);
  await shot('16-feed-empty-cta.png');

  await page.evaluate(() => sessionStorage.removeItem('ubi.qa.emptyPosts'));

  // picker on create
  await page.goto(base + '/create', { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  await page.waitForTimeout(3000);
  const pub = page.getByText('Publicaci?n', { exact: true });
  if (await pub.count()) await pub.first().click().catch(()=>{});
  await page.waitForTimeout(800);

  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 8000 }).catch(() => null),
    (async () => {
      const foto = page.getByRole('button', { name: /foto|Foto|A?adir/i });
      if (await foto.count()) await foto.first().click();
      else await page.getByText(/Foto|A?adir foto/).first().click().catch(()=>{});
    })(),
  ]);
  if (chooser) {
    await chooser.setFiles(fixture);
    console.log('file set');
  } else {
    console.log('no filechooser - try input');
    const input = page.locator('input[type=file]');
    if (await input.count()) await input.first().setInputFiles(fixture);
  }
  await page.waitForTimeout(4000);
  await shot('17-picker-image-proof.png');

  await browser.close();
})().catch((e)=>{console.error(e); process.exit(1);});
