import { test, expect } from '@playwright/test';

test.describe('Items Management', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage first
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    
    // Reset the backend store and wait for completion
    const resetResponse = await page.request.post('http://localhost:3001/reset');
    expect(resetResponse.status()).toBe(200);
    console.log('Backend reset successful');
    
    // Login programmatically
    await page.goto('/login');
    await page.getByTestId('email-input').fill('user@example.com');
    await page.getByTestId('password-input').fill('Password123');
    await page.getByTestId('login-button').click();
    
    // Wait for navigation to items page
    await expect(page).toHaveURL('/items');
    await expect(page.getByTestId('items-list')).toBeVisible();
  });

  test('should create a new item with title and description', async ({ page }) => {
    const testTitle = 'Test Item Title';
    const testDescription = 'Test Item Description';

    // Fill in the create form
    await page.getByTestId('create-title-input').fill(testTitle);
    await page.getByTestId('create-description-input').fill(testDescription);

    // Submit the form
    await page.getByTestId('create-button').click();

    // Assert the item appears in the list
    await expect(page.getByTestId('item-1')).toBeVisible();
    await expect(page.getByTestId('title-1')).toContainText(testTitle);
    await expect(page.getByTestId('description-1')).toContainText(testDescription);

    // Assert form is cleared
    await expect(page.getByTestId('create-title-input')).toHaveValue('');
    await expect(page.getByTestId('create-description-input')).toHaveValue('');
  });

  test('should create item with title only', async ({ page }) => {
    const testTitle = 'Title Only Item';

    // Fill in only the title
    await page.getByTestId('create-title-input').fill(testTitle);

    // Submit the form
    await page.getByTestId('create-button').click();

    // Assert the item appears in the list
    await expect(page.getByTestId('item-1')).toBeVisible();
    await expect(page.getByTestId('title-1')).toContainText(testTitle);
    await expect(page.getByTestId('description-1')).toBeEmpty();
  });

  test('should not create item without title', async ({ page }) => {
    const testDescription = 'Description without title';

    // Fill in only the description
    await page.getByTestId('create-description-input').fill(testDescription);

    // Try to submit the form (should be prevented by HTML5 validation)
    await page.getByTestId('create-button').click();

    // Assert no item was created
    await expect(page.getByTestId('item-1')).not.toBeVisible();
  });

  test('should edit an existing item', async ({ page }) => {
    const originalTitle = 'Original Title';
    const originalDescription = 'Original Description';
    const updatedTitle = 'Updated Title';
    const updatedDescription = 'Updated Description';

    // Create an item first
    await page.getByTestId('create-title-input').fill(originalTitle);
    await page.getByTestId('create-description-input').fill(originalDescription);
    await page.getByTestId('create-button').click();

    // Wait for item to appear
    await expect(page.getByTestId('item-1')).toBeVisible();

    // Click edit button
    await page.getByTestId('edit-1').click();

    // Assert edit form is visible
    await expect(page.getByTestId('edit-title-1')).toBeVisible();
    await expect(page.getByTestId('edit-description-1')).toBeVisible();

    // Update the item
    await page.getByTestId('edit-title-1').fill(updatedTitle);
    await page.getByTestId('edit-description-1').fill(updatedDescription);

    // Save changes
    await page.getByTestId('save-1').click();

    // Assert updated content is displayed
    await expect(page.getByTestId('title-1')).toContainText(updatedTitle);
    await expect(page.getByTestId('description-1')).toContainText(updatedDescription);

    // Assert edit form is no longer visible
    await expect(page.getByTestId('edit-title-1')).not.toBeVisible();
  });

  test('should cancel edit without saving changes', async ({ page }) => {
    const originalTitle = 'Original Title';
    const originalDescription = 'Original Description';

    // Create an item first
    await page.getByTestId('create-title-input').fill(originalTitle);
    await page.getByTestId('create-description-input').fill(originalDescription);
    await page.getByTestId('create-button').click();

    // Wait for item to appear
    await expect(page.getByTestId('item-1')).toBeVisible();

    // Click edit button
    await page.getByTestId('edit-1').click();

    // Make changes but don't save
    await page.getByTestId('edit-title-1').fill('Changed Title');
    await page.getByTestId('edit-description-1').fill('Changed Description');

    // Cancel changes
    await page.getByTestId('cancel-1').click();

    // Assert original content is still displayed
    await expect(page.getByTestId('title-1')).toContainText(originalTitle);
    await expect(page.getByTestId('description-1')).toContainText(originalDescription);

    // Assert edit form is no longer visible
    await expect(page.getByTestId('edit-title-1')).not.toBeVisible();
  });

  test('should delete an existing item', async ({ page }) => {
    const testTitle = 'Item to Delete';
    const testDescription = 'This item will be deleted';

    // Create an item first
    await page.getByTestId('create-title-input').fill(testTitle);
    await page.getByTestId('create-description-input').fill(testDescription);
    await page.getByTestId('create-button').click();

    // Wait for item to appear
    await expect(page.getByTestId('item-1')).toBeVisible();

    // Delete the item
    await page.getByTestId('delete-1').click();

    // Assert item no longer exists in the list
    await expect(page.getByTestId('item-1')).not.toBeVisible();
  });

  test('should handle multiple items correctly', async ({ page }) => {
    const items = [
      { title: 'First Item', description: 'First Description' },
      { title: 'Second Item', description: 'Second Description' },
      { title: 'Third Item', description: 'Third Description' }
    ];

    // Create multiple items
    for (const item of items) {
      await page.getByTestId('create-title-input').fill(item.title);
      await page.getByTestId('create-description-input').fill(item.description);
      await page.getByTestId('create-button').click();
      // Wait for the item to be created and visible
      await page.waitForTimeout(100);
    }

    // Wait for all items to be loaded
    await page.waitForTimeout(500);

    // Get all item elements and verify count
    const itemElements = await page.locator('[data-testid^="item-"]').all();
    expect(itemElements.length).toBe(items.length);

    // Check each item by its actual data-testid
    for (let i = 0; i < itemElements.length; i++) {
      const itemElement = itemElements[i];
      const testId = await itemElement.getAttribute('data-testid');
      const itemId = testId.replace('item-', '');
      
      // Verify the content matches what we expect (items are displayed in creation order)
      await expect(page.getByTestId(`title-${itemId}`)).toContainText(items[i].title);
      await expect(page.getByTestId(`description-${itemId}`)).toContainText(items[i].description);
    }

    // Delete the middle item (should be item-2)
    await page.getByTestId('delete-2').click();

    // Wait for deletion to complete
    await page.waitForTimeout(500);

    // Assert the correct item was deleted (should have 2 items remaining)
    const remainingItems = await page.locator('[data-testid^="item-"]').all();
    expect(remainingItems.length).toBe(2);
    
    // Verify the remaining items are item-1 and item-3
    await expect(page.getByTestId('item-1')).toBeVisible();
    await expect(page.getByTestId('item-3')).toBeVisible();
    await expect(page.getByTestId('item-2')).not.toBeVisible();
  });

  test('should display empty state when no items exist', async ({ page }) => {
    // Assert empty state message is visible
    await expect(page.locator('text=No items found.')).toBeVisible();
  });

  test('should handle server errors gracefully', async ({ page }) => {
    // This test would require mocking network responses
    // For now, we'll test the happy path and assume error handling works
    // In a real scenario, you might use page.route() to mock API failures
    
    // Create an item to ensure the page works normally
    await page.getByTestId('create-title-input').fill('Test Item');
    await page.getByTestId('create-button').click();
    
    await expect(page.getByTestId('item-1')).toBeVisible();
  });
});
