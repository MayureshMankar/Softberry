import { test, expect } from '@playwright/test';

test('Admin access control and product management', async ({ page }) => {
  // Test 1: Non-admin users cannot access admin pages
  await page.goto('/admin');
  await expect(page).toHaveURL(/.*admin\/login/);

  // Test 2: Admin login works
  await page.fill('input[type="email"]', 'admin@example.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  
  // Should redirect to admin dashboard
  await page.waitForURL('/admin');
  await expect(page.getByText('Admin Dashboard')).toBeVisible();

  // Test 3: Admin can navigate to product management
  await page.click('text=Products');
  await expect(page).toHaveURL(/.*admin\/products/);
  await expect(page.getByText('Product Management')).toBeVisible();

  // Test 4: Admin can add a new product
  await page.click('button:has-text("Add Product")');
  await page.fill('input[name="name"]', 'Test Product');
  await page.fill('input[name="price"]', '1000');
  await page.fill('input[name="slug"]', 'test-product');
  await page.click('button:has-text("Save Product")');
  
  // Should show success message
  await expect(page.getByText('Product created')).toBeVisible();

  // Test 5: Admin can edit a product
  await page.click('button:has-text("Edit")');
  await page.fill('input[name="price"]', '1500');
  await page.click('button:has-text("Save Product")');
  
  // Should show success message
  await expect(page.getByText('Product updated')).toBeVisible();

  // Test 6: Admin can delete a product
  await page.click('button:has-text("Delete")');
  // Confirm deletion in dialog
  await page.click('button:has-text("Confirm")');
  
  // Should show success message
  await expect(page.getByText('Product deleted')).toBeVisible();

  // Test 7: Admin logout works
  await page.click('button:has-text("Logout")');
  await page.waitForURL('/');
  await expect(page).toHaveURL('/');
});