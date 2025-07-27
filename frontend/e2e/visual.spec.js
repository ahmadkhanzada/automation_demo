import { test, expect } from '@playwright/test';

test.describe('Visual Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage and reset backend store
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    // Reset the backend store and wait for completion
    const resetResponse = await page.request.post('http://localhost:3001/reset');
    expect(resetResponse.status()).toBe(200);
  });

  test('login page initial state', async ({ page }) => {
    await page.goto('/login');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of the initial login page
    await expect(page).toHaveScreenshot('login-page-initial.png');
  });

  test('items page after creating an item', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('password-input').fill('Password123');
    await page.getByTestId('login-button').click();
    
    // Wait for navigation to items page
    await expect(page).toHaveURL('/items');
    await expect(page.getByTestId('items-list')).toBeVisible();
    
    // Create a deterministic test item
    await page.getByTestId('create-title-input').fill('Visual Test Item');
    await page.getByTestId('create-description-input').fill('This is a test item for visual regression testing');
    await page.getByTestId('create-button').click();
    
    // Wait for the item to appear
    await expect(page.getByTestId('item-1')).toBeVisible();
    
    // Wait for any animations or loading states to complete
    await page.waitForTimeout(500);
    
    // Take screenshot of the items page with the created item
    await expect(page).toHaveScreenshot('items-page-with-item.png');
  });

  test('items page empty state', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('password-input').fill('Password123');
    await page.getByTestId('login-button').click();
    
    // Wait for navigation to items page
    await expect(page).toHaveURL('/items');
    await expect(page.getByTestId('items-list')).toBeVisible();
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of the empty items page
    await expect(page).toHaveScreenshot('items-page-empty.png');
  });
});
