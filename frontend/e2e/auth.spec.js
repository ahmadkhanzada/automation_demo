import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to avoid token leakage between tests
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    // Reset the backend store and wait for completion
    const resetResponse = await page.request.post('http://localhost:3001/reset');
    expect(resetResponse.status()).toBe(200);
  });

  test('should login with valid credentials and navigate to items page', async ({ page }) => {
    await page.goto('/login');

    // Fill in valid credentials
    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('password-input').fill('Password123');

    // Submit the form
    await page.getByTestId('login-button').click();

    // Assert navigation to items page
    await expect(page).toHaveURL('/items');
    await expect(page.getByTestId('items-list')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('password-input').fill('wrongpassword');

    // Submit the form
    await page.getByTestId('login-button').click();

    // Assert error message appears
    await expect(page.getByTestId('error-message')).toBeVisible();
    await expect(page.getByTestId('error-message')).toContainText('Invalid credentials');

    // Assert we remain on login page
    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when accessing items page without token', async ({ page }) => {
    // Navigate directly to items page without being logged in
    await page.goto('/items');

    // Assert redirect to login page
    await expect(page).toHaveURL('/login');
  });

  test('should logout and redirect to login page', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('password-input').fill('Password123');
    await page.getByTestId('login-button').click();

    // Wait for navigation to items page
    await expect(page).toHaveURL('/items');

    // Click logout button
    await page.getByRole('button', { name: 'Logout' }).click();

    // Assert redirect to login page
    await expect(page).toHaveURL('/login');
  });
});
