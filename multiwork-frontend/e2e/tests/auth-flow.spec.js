const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should register a new user', async ({ page }) => {
    await page.goto('/signup');

    // Fill registration form
    await page.fill('input[type="email"]', 'e2e-test@example.com');
    await page.fill('input[type="text"]', 'e2etestuser');
    await page.fill('input[type="password"]', 'password123');

    // Submit form
    await page.click('input[type="submit"]');

    // Should redirect to login page after successful registration
    await expect(page).toHaveURL(/.*login/);
  });

  test('should login with valid credentials', async ({ page, context }) => {
    // First, register a user (or use existing test user)
    await page.goto('/signup');
    await page.fill('input[type="email"]', 'e2e-login@example.com');
    await page.fill('input[type="text"]', 'e2eloginuser');
    await page.fill('input[type="password"]', 'password123');
    await page.click('input[type="submit"]');
    
    // Wait for redirect to login
    await page.waitForURL(/.*login/);

    // Now login
    await page.fill('input[type="email"]', 'e2e-login@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('input[type="submit"]');

    // Should redirect to home page after successful login
    await expect(page).toHaveURL(/.*home/);
    
    // Token should be stored in localStorage
    const token = await page.evaluate(() => localStorage.getItem('token'));
    expect(token).toBeTruthy();
  });

  test('should show error on invalid login credentials', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('input[type="submit"]');

    // Should show error message
    await expect(page.locator('.error')).toBeVisible();
  });

  test('should navigate to signup from login page', async ({ page }) => {
    await page.goto('/login');

    // Click on create account link
    const signupLink = page.locator('a').filter({ hasText: /create account|signup/i });
    await signupLink.click();

    await expect(page).toHaveURL(/.*signup/);
  });

  test('should navigate to login from signup page', async ({ page }) => {
    await page.goto('/signup');

    // Click on already have account link
    const loginLink = page.locator('a').filter({ hasText: /already have account|login/i });
    await loginLink.click();

    await expect(page).toHaveURL(/.*login/);
  });
});
