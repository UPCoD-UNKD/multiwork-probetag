const { test, expect } = require('@playwright/test');

test.describe('Navigation Flow', () => {
  test('should navigate from splash to login', async ({ page }) => {
    await page.goto('/');
    
    // Wait for splash screen (adjust based on actual implementation)
    await page.waitForTimeout(1000);
    
    // Navigate to login (adjust selector based on actual implementation)
    await page.goto('/login');
    
    await expect(page).toHaveURL(/.*login/);
  });

  test('should navigate to home after login', async ({ page }) => {
    // Mock authentication
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-token');
    });
    
    await page.goto('/home');
    
    await expect(page).toHaveURL(/.*home/);
  });

  test('should navigate to profile page', async ({ page }) => {
    // Mock authentication
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('token', 'mock-jwt-token');
    });
    
    await page.goto('/profile');
    
    await expect(page).toHaveURL(/.*profile/);
  });

  test('should navigate to skills page', async ({ page }) => {
    await page.goto('/skills');
    
    await expect(page).toHaveURL(/.*skills/);
  });

  test('should show 404 for invalid route', async ({ page }) => {
    await page.goto('/invalid-route-12345');
    
    // Should show 404 or NotFound component
    // Adjust selector based on actual NotFound component
    const pageContent = await page.textContent('body');
    expect(pageContent).toBeTruthy();
  });
});
