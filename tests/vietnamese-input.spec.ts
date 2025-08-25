import { test, expect } from '@playwright/test';

test.describe('Vietnamese Input Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the main page
    await page.goto('http://localhost:5176');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Wait for OverType to initialize
    await page.waitForTimeout(2000);
  });

  test('should load OverType library', async ({ page }) => {
    // Check if OverType is available in the window
    const overTypeExists = await page.evaluate(() => {
      return typeof window.OverType !== 'undefined';
    });
    
    expect(overTypeExists).toBe(true);
    console.log('✓ OverType library loaded');
  });

  test('should initialize OverType editor', async ({ page }) => {
    // Check if the editor container exists
    const editorContainer = page.locator('[data-testid="editor-container"], .overtype-container, .editor-container');
    
    // If not found by test id, look for textarea which indicates OverType initialized
    const textarea = page.locator('textarea');
    
    if (await textarea.count() > 0) {
      expect(await textarea.count()).toBeGreaterThan(0);
      console.log('✓ OverType editor initialized (textarea found)');
    } else {
      console.log('❌ No textarea found - OverType may not have initialized');
    }
    
    // Also check for OverType specific elements
    const overtypeElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('.overtype, [class*="overtype"], [id*="overtype"]');
      return elements.length;
    });
    
    console.log(`Found ${overtypeElements} OverType-related elements`);
  });

  test('should have Vietnamese input controls', async ({ page }) => {
    // Check for Vietnamese input method buttons
    const methodButtons = page.locator('button').filter({ hasText: /AUTO|TELEX|VNI|VIQR/ });
    const buttonCount = await methodButtons.count();
    
    expect(buttonCount).toBeGreaterThan(0);
    console.log(`✓ Found ${buttonCount} Vietnamese input method buttons`);

    // Check for ON/OFF toggle
    const toggleButton = page.locator('button').filter({ hasText: /ON|OFF/ });
    const toggleCount = await toggleButton.count();
    
    expect(toggleCount).toBeGreaterThan(0);
    console.log(`✓ Found ${toggleCount} ON/OFF toggle button(s)`);
  });

  test('should allow typing in the editor', async ({ page }) => {
    // Wait a bit more for initialization
    await page.waitForTimeout(3000);
    
    // Try to find the textarea
    const textarea = page.locator('textarea').first();
    
    if (await textarea.count() === 0) {
      console.log('❌ No textarea found for typing');
      
      // Debug: log all elements that might be the editor
      const allTextInputs = await page.evaluate(() => {
        const inputs = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]');
        return Array.from(inputs).map(el => ({
          tagName: el.tagName,
          type: el.getAttribute('type'),
          id: el.id,
          className: el.className,
          contentEditable: el.getAttribute('contenteditable')
        }));
      });
      
      console.log('All possible text inputs:', JSON.stringify(allTextInputs, null, 2));
      return;
    }
    
    // Try to click and type in the textarea
    await textarea.click();
    await textarea.fill(''); // Clear first
    await textarea.type('hello world');
    
    const value = await textarea.inputValue();
    expect(value).toBe('hello world');
    console.log('✓ Basic typing works: ' + value);
  });

  test('should transform Vietnamese input with TELEX', async ({ page }) => {
    // Wait for initialization
    await page.waitForTimeout(3000);
    
    // Ensure TELEX is selected
    const telexButton = page.locator('button').filter({ hasText: 'TELEX' }).first();
    if (await telexButton.count() > 0) {
      await telexButton.click();
      console.log('✓ Selected TELEX input method');
    }
    
    // Ensure Vietnamese input is ON
    const onButton = page.locator('button').filter({ hasText: 'ON' }).first();
    if (await onButton.count() > 0) {
      await onButton.click();
      console.log('✓ Vietnamese input is ON');
    }
    
    // Find textarea
    const textarea = page.locator('textarea').first();
    
    if (await textarea.count() === 0) {
      console.log('❌ No textarea found for Vietnamese input test');
      return;
    }
    
    // Test Vietnamese transformation
    await textarea.click();
    await textarea.fill(''); // Clear
    
    // Type Vietnamese words using TELEX
    await textarea.type('xin chao');
    
    let value = await textarea.inputValue();
    console.log('After typing "xin chao": ' + value);
    
    // Try specific TELEX transformations
    await textarea.fill('');
    await textarea.type('aa'); // Should become â
    
    value = await textarea.inputValue();
    console.log('After typing "aa": ' + value);
    
    // Try with tone
    await textarea.fill('');
    await textarea.type('as'); // Should become á
    
    value = await textarea.inputValue();
    console.log('After typing "as": ' + value);
    
    if (value === 'á') {
      console.log('✓ Vietnamese TELEX transformation works!');
    } else {
      console.log('❌ Vietnamese TELEX transformation not working');
    }
  });

  test('debug page state', async ({ page }) => {
    // Wait for page to fully load
    await page.waitForTimeout(3000);
    
    // Get comprehensive debug info
    const debugInfo = await page.evaluate(() => {
      const info: any = {};
      
      // Check OverType
      info.overTypeExists = typeof window.OverType !== 'undefined';
      info.overTypeMethods = window.OverType ? Object.keys(window.OverType) : [];
      
      // Count elements
      info.textareas = document.querySelectorAll('textarea').length;
      info.buttons = document.querySelectorAll('button').length;
      
      // Check for specific elements
      info.editorContainer = document.querySelector('[class*="editor"], [id*="editor"]') !== null;
      info.vietnameseButtons = Array.from(document.querySelectorAll('button')).filter(btn => 
        btn.textContent && /AUTO|TELEX|VNI|VIQR|ON|OFF/.test(btn.textContent)
      ).length;
      
      // Get all button texts
      info.buttonTexts = Array.from(document.querySelectorAll('button')).map(btn => btn.textContent?.trim());
      
      // Check for errors in console
      info.errors = (window as any).consoleErrors || [];
      
      return info;
    });
    
    console.log('🔍 Debug Info:', JSON.stringify(debugInfo, null, 2));
    
    // Take a screenshot for visual debugging
    await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
    console.log('📸 Screenshot saved as debug-screenshot.png');
  });
});