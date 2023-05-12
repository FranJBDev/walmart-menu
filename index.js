const puppeteer = require('puppeteer-extra');
const fs = require('fs')

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
    await page.goto('https://super.walmart.com.mx/');

    // Wait for security check
    await page.waitForTimeout(5000);

    page.click(
      '[class="flex items-center no-underline ph3 white desktop-header-trigger lh-title b pointer ba b--transparent bg-transparent sans-serif"]'
    );

    await page.waitForTimeout(3000);

    const info = {}
    const departments = [];
    const departmentsElem = await page.$$(
      '[class*="b--none bg-transparent lh-copy mid-gray ph4 pv2 relative sans-serif tl w-100"]'
    );

    for (let j = 0; j < departmentsElem.length; j++) {
      department = await departmentsElem[j].evaluate((e) => e.innerText);
      info[]
      departments.push(department);
      departmentsElem[j].click();
      await page.waitForTimeout(500);
    }

    console.log(departments);

    await page.screenshot({ path: 'image.png', fullPage: true });

    await browser.close();
  });
