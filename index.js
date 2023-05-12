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

    // page.click(
    //   '[class="flex items-center no-underline ph3 white desktop-header-trigger lh-title b pointer ba b--transparent bg-transparent sans-serif"]'
    // );

    await page.waitForTimeout(3000);

    const info = {};
    const departments = [];

    const depsContainer = await page.$$(
      '[class="flex justify-between shadow-1 br2 pa4 h-100"]'
    ); //

    for (let j = 0; j < depsContainer.length; j++) {
      const depElem = await depsContainer[j].$(
        '[class="f3 no-underline black b"]'
      );
      department = await depElem.evaluate((e) => e.innerText);
      //   console.log('Departamento', department);
      const categoryElem = await depsContainer[j].$$(
        '[class="f6 no-underline mid-gray db pv2 underline-hover"]'
      );
      for (let i = 0; i < categoryElem.length; i++) {
        const categorie = await categoryElem[i].evaluate((e) => e.innerText);
        console.log('Departamento', department, 'Categoria: ', categorie);
      }
    }

    await page.screenshot({ path: 'image.png', fullPage: true });

    await browser.close();
  });
