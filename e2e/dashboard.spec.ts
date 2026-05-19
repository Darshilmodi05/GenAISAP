import { test, expect } from '@playwright/test';

test.describe('GenAISAP Mission Control - Core Telemetry E2E Checks', () => {
  
  test.beforeEach(async ({ page }) => {
    // Intercept Supabase Auth Token requests (signInWithPassword)
    await page.route('**/auth/v1/token*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-access-token-jwt',
          token_type: 'bearer',
          expires_in: 3600,
          refresh_token: 'mock-refresh-token-jwt',
          user: {
            id: 'd3b07384-d113-4c8d-9b5c-c9cea7c21e9a',
            aud: 'authenticated',
            role: 'authenticated',
            email: 'darshil@sap.corp',
            user_metadata: { tenant_id: 'default' }
          }
        })
      });
    });

    // Intercept Supabase Auth User checks (token verification)
    await page.route('**/auth/v1/user*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'd3b07384-d113-4c8d-9b5c-c9cea7c21e9a',
          aud: 'authenticated',
          role: 'authenticated',
          email: 'darshil@sap.corp',
          user_metadata: { tenant_id: 'default' }
        })
      });
    });

    // Intercept MFA authenticator checklist queries
    await page.route('**/auth/v1/factors*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          totp: []
        })
      });
    });

    // Visit Login screen and trigger demo bypass session
    await page.goto('/login');
    
    // Fill credentials form
    await page.fill('input[type="email"]', 'darshil@sap.corp');
    await page.fill('input[type="password"]', 'quantum-access-key-1337');
    
    // Click login
    await page.click('button[type="submit"]');
    
    // Wait for redirect to MFA Verification Page
    await page.waitForURL('**/verify*');
    
    // Populate the 6-digit OTP code to trigger automatic redirect
    const otpInputs = page.locator('input[type="text"]');
    await otpInputs.nth(0).fill('2');
    await otpInputs.nth(1).fill('3');
    await otpInputs.nth(2).fill('4');
    await otpInputs.nth(3).fill('5');
    await otpInputs.nth(4).fill('6');
    await otpInputs.nth(5).fill('7');
    
    // Wait for redirect to dashboard home
    await page.waitForURL('**/dashboard/home');
  });

  test('should successfully render the Mission Control home deck', async ({ page }) => {
    // Confirm presence of primary header
    await expect(page.locator('h1')).toContainText('EXECUTIVE');
    
    // Confirm presence of the main sidebar container
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('should support seamless, lag-free route transitions across all views', async ({ page }) => {
    // 1. Click Data Nodes button in sidebar
    await page.click('a[href="/dashboard/data-nodes"]');
    await page.waitForURL('**/dashboard/data-nodes');
    await expect(page.locator('h1')).toContainText('NODES');

    // 2. Click Analytics button in sidebar
    await page.click('a[href="/dashboard/analytics"]');
    await page.waitForURL('**/dashboard/analytics');
    await expect(page.locator('h1')).toContainText('ANALYTICS');

    // 3. Click Audit Logs button in sidebar
    await page.click('a[href="/dashboard/audit-logs"]');
    await page.waitForURL('**/dashboard/audit-logs');
    await expect(page.locator('h1')).toContainText('LOGS');

    // 4. Click Settings button in sidebar
    await page.click('a[href="/dashboard/settings"]');
    await page.waitForURL('**/dashboard/settings');
    await expect(page.locator('h1')).toContainText('STATIONS');
  });

  test('should trigger high-fidelity gateway configuration modal in Data Nodes', async ({ page }) => {
    // Navigate to Data Nodes
    await page.click('a[href="/dashboard/data-nodes"]');
    await page.waitForURL('**/dashboard/data-nodes');
    
    // Click the "Configure" button on the first card (SAP S/4HANA Production)
    const configureBtn = page.locator('button:has-text("Configure")').first();
    await configureBtn.click();
    
    // Verify overlay presence
    const modalHeader = page.locator('h2:has-text("Configure Gateway Node")');
    await expect(modalHeader).toBeVisible();
    
    // Verify input populated with default SAP URL
    const urlInput = page.locator('input[type="url"]');
    await expect(urlInput).toHaveValue(/https:\/\/.*\.sap\.corp/);

    // Close the modal
    await page.click('button:has(svg)');
  });

  test('should open security incident metadata payload sentinel drawer in Audit Logs', async ({ page }) => {
    // Navigate to Audit Logs
    await page.click('a[href="/dashboard/audit-logs"]');
    await page.waitForURL('**/dashboard/audit-logs');
    
    // Click on a row inside the audit registry
    const rlsLog = page.locator('tr:has-text("RLS_SECURITY_VIOLATION")');
    await rlsLog.click();
    
    // Verify sentinel drawer header opened
    const drawerTitle = page.locator('h3:has-text("Audit Metadata")');
    await expect(drawerTitle).toBeVisible();
    
    // Verify presence of RLS footprint JSON dump
    const jsonConsole = page.locator('pre');
    await expect(jsonConsole).toBeVisible();
    await expect(jsonConsole).toContainText('violated_policy');

    // Close the drawer
    await page.click('button:has-text("Close Sentinel Drawer")');
  });
});
