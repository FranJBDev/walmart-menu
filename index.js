const puppeteer = require('puppeteer-extra');
const fs = require('fs');

// Add stealth plugin and use defaults
const pluginStealth = require('puppeteer-extra-plugin-stealth');
const { executablePath } = require('puppeteer');

// Use stealth
puppeteer.use(pluginStealth());

// Launch pupputeer-stealth

puppeteer
  .launch({ headless: false, executablePath: executablePath() })
  .then(async (browser) => {
    // Create a new page
    const page = await browser.newPage();

    // Setting page view
    await page.setViewport({ width: 1280, height: 720 });

    // Go to the website
    await page.goto('https://super.walmart.com.mx/all-departments');

    // Wait for security check
    await page.waitForTimeout(5000);

    const info = {};

    const depsContainer = await page.$$(
      '[class="flex justify-between shadow-1 br2 pa4 h-100"]'
    ); //

    for (let j = 0; j < depsContainer.length; j++) {
      const depElem = await depsContainer[j].$(
        '[class="f3 no-underline black b"]'
      );
      const department = await depElem.evaluate((e) => e.innerText);
      const linkDep = await depElem.evaluate((e) => e.href);
      info[j] = { department: department, url: linkDep, categories: [] };

      const categoryElem = await depsContainer[j].$$(
        '[class="f6 no-underline mid-gray db pv2 underline-hover"]'
      );
      for (let i = 0; i < categoryElem.length; i++) {
        const categorie = await categoryElem[i].evaluate((e) => e.innerText);
        const linkCat = await categoryElem[i].evaluate((e) => e.href);
        info[j].categories.push({
          name: categorie,
          url: linkCat,
          subcategories: [],
        });
      }
    }

    fs.writeFileSync('./data/walmart.json', JSON.stringify(info));

    await page.screenshot({ path: 'image.png', fullPage: true });

    await browser.close();
  });
