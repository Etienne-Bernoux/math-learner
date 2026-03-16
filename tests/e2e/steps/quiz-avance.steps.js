import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { When, Then } = createBdd();

When('je clique sur {string}', async ({ page }, texte) => {
  await page.locator(`button:has-text("${texte}")`).first().click();
  await page.waitForTimeout(300);
});

Then('je vois {string}', async ({ page }, texte) => {
  await expect(page.locator(`text=${texte}`).first()).toBeVisible();
});
