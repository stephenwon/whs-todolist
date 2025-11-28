// WHS-TodoList Integration Test based on user scenarios
const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3000';

test.describe('WHS-TodoList Integration Tests', () => {
  // Test Scenario 3.1.1: 신규 사용자 회원가입 (New user registration)
  test('should allow new user registration', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for the page to load
    await expect(page.locator('text=로그인')).toBeVisible();
    
    // Click register link
    await page.locator('text=회원가입').click();
    
    // Fill registration form with unique data
    const randomString = Math.random().toString(36).substring(7);
    const email = `testuser+${randomString}@example.com`;
    const password = 'SecurePass123!';
    const username = `TestUser${randomString}`;
    
    await page.locator('[name="email"]').fill(email);
    await page.locator('[name="password"]').fill(password);
    await page.locator('[name="confirmPassword"]').fill(password);
    await page.locator('[name="username"]').fill(username);
    
    // Submit registration
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to login page after successful registration
    await expect(page.locator('text=로그인')).toBeVisible();
    console.log('✅ Registration test passed');
  });

  // Test Scenario 3.1.2: 기존 사용자 로그인 (Existing user login)
  test('should allow existing user login', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Fill login form (using a test account)
    await page.locator('[name="email"]').fill('testuser@example.com'); // This would be a test user
    await page.locator('[name="password"]').fill('SecurePass123!');
    
    // Submit login
    await page.locator('button[type="submit"]').click();
    
    // Should redirect to todo list page after successful login
    await expect(page.locator('text=할일 목록')).toBeVisible();
    console.log('✅ Login test passed');
  });

  // Test Scenario 2.1.1: 출근길 할일 확인 및 추가 (Check and add tasks)
  test('should allow adding a new task', async ({ page }) => {
    // First, login
    await page.goto(BASE_URL);
    await page.locator('[name="email"]').fill('testuser@example.com');
    await page.locator('[name="password"]').fill('SecurePass123!');
    await page.locator('button[type="submit"]').click();
    
    // Wait for todo list to load
    await expect(page.locator('text=할일 목록')).toBeVisible();
    
    // Click add task button (usually a + icon)
    await page.locator('button:has-text("+")').click();
    
    // Fill task form
    await page.locator('[name="title"]').fill('팀장님께 보고서 제출');
    await page.locator('[name="description"]').fill('오전 11시까지 제출 필요');
    await page.locator('[name="start_date"]').fill('2025-11-27');
    await page.locator('[name="due_date"]').fill('2025-11-27');
    
    // Submit task
    await page.locator('button:has-text("추가")').click();
    
    // Task should appear in the list
    await expect(page.locator('text=팀장님께 보고서 제출')).toBeVisible();
    console.log('✅ Add task test passed');
  });

  // Test Scenario 2.1.2: 업무 중 할일 완료 처리 (Complete a task)
  test('should allow completing a task', async ({ page }) => {
    // First, login
    await page.goto(BASE_URL);
    await page.locator('[name="email"]').fill('testuser@example.com');
    await page.locator('[name="password"]').fill('SecurePass123!');
    await page.locator('button[type="submit"]').click();
    
    // Wait for todo list to load
    await expect(page.locator('text=할일 목록')).toBeVisible();
    
    // Find the task and click the complete checkbox
    const taskCheckbox = page.locator('input[type="checkbox"]').first();
    await taskCheckbox.click();
    
    // Task should be marked as completed (visually)
    await expect(taskCheckbox).toBeChecked();
    console.log('✅ Complete task test passed');
  });

  // Test Scenario 2.1.3: 실수로 삭제한 할일 복원 (Restore deleted task)
  test('should allow deleting and restoring a task', async ({ page }) => {
    // First, login
    await page.goto(BASE_URL);
    await page.locator('[name="email"]').fill('testuser@example.com');
    await page.locator('[name="password"]').fill('SecurePass123!');
    await page.locator('button[type="submit"]').click();
    
    // Wait for todo list to load
    await expect(page.locator('text=할일 목록')).toBeVisible();
    
    // Get initial task count
    const initialTaskCount = await page.locator('.todo-item').count();
    
    // Find a task and click the delete button
    const deleteButton = page.locator('button:has-text("🗑️")').first();
    await deleteButton.click();
    
    // Confirm deletion if needed
    if (await page.locator('text=정말 삭제하시겠습니까').isVisible()) {
      await page.locator('button:has-text("확인")').click();
    }
    
    // Task should be moved to trash
    await expect(page.locator('.todo-item')).toHaveCount(initialTaskCount - 1);
    
    // Navigate to trash
    await page.locator('text=휴지통').click();
    
    // Find the task in trash and click restore
    const restoreButton = page.locator('button:has-text("복원")').first();
    await restoreButton.click();
    
    // Should return to main todo list
    await expect(page.locator('text=할일 목록')).toBeVisible();
    
    console.log('✅ Delete and restore test passed');
  });

  // Test Scenario for search and filtering
  test('should allow searching and filtering tasks', async ({ page }) => {
    // First, login
    await page.goto(BASE_URL);
    await page.locator('[name="email"]').fill('testuser@example.com');
    await page.locator('[name="password"]').fill('SecurePass123!');
    await page.locator('button[type="submit"]').click();
    
    // Wait for todo list to load
    await expect(page.locator('text=할일 목록')).toBeVisible();
    
    // Test search functionality
    await page.locator('[name="search"]').fill('보고서');
    await expect(page.locator('text=팀장님께 보고서 제출')).toBeVisible();
    
    // Test filtering
    await page.locator('text=진행 중').click();
    
    // Clear search
    await page.locator('[name="search"]').clear();
    
    console.log('✅ Search and filter test passed');
  });
});