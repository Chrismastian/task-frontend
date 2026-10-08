// Capture README screenshots: login page + populated dashboard (+ new-task form).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = 'https://task-frontend-ruddy-five.vercel.app';
const EMAIL = 'portfolio@taskflow.app';
const PASS = 'password123';
const OUT = 'docs/screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 1000 } });

// 1) Login page
await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/login.png` });
console.log('saved login.png');

// 2) Log in (dashboard is the protected route at "/")
await page.fill('input[type="email"]', EMAIL);
await page.fill('input[type="password"]', PASS);
await page.click('button[type="submit"]');
await page.waitForSelector('text=My tasks', { timeout: 30000 });
await page.waitForTimeout(3000);
await page.screenshot({ path: `${OUT}/dashboard.png` });
console.log('saved dashboard.png');

// 3) Open the new-task form to show the create flow
await page.click('text=+ New task');
await page.waitForTimeout(1200);
await page.screenshot({ path: `${OUT}/new-task.png` });
console.log('saved new-task.png');

await browser.close();
