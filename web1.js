import { sleep, check } from 'k6'
import { browser } from 'k6/browser'

export const options = {
  scenarios: {
    ui: {
      executor: 'constant-vus',
      vus: 3,
      duration: '10s',
      options: {
        browser: {
          type: 'chromium',
        }
      }
    }
  },
  thresholds: {
    checks: ['rate == 1.0'],
    browser_web_vital_fid: ['p(75) <= 100'],
    browser_web_vital_lcp: ['p(75) <= 2500']
  },
  summaryTrendStats: ['min','med','avg','p(75)','p(95)','p(79)']
}

export default async function() {
  const context = await browser.newContext()
  const page = await context.newPage()

  try{
    await page.goto("https://test.k6.io/my_messages.php")

    await page.locator('input[name="login"]').type("admin")
    await page.locator('input[name="password"]').type("123")
    
    const submitButton = page.locator('input[type="submit"]')

    await Promise.all([
      page.waitForNavigation(),
      submitButton.click(), 
    ])

    const header = await page.locator("h2").textContent();
    check(header, {
      header: (h) => h == "Welcome, admin!",
    })
  }finally{
    await page.close()
  }
}