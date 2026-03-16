import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

Given('j\'ouvre l\'application', async ({ page }) => {
  await page.goto('/');
  await page.waitForSelector('h1');
});

Then('je vois le titre {string}', async ({ page }, titre) => {
  await expect(page.locator('h1').first()).toContainText(titre);
});

Then('je vois le bouton {string}', async ({ page }, texte) => {
  await expect(page.locator(`button:has-text("${texte}")`).first()).toBeVisible();
});
