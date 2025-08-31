import { test, expect } from '@playwright/test';

test.describe('VinaKey Editor E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Wait for OverType to initialize
    await page.waitForFunction(() => window.OverType);
    
    // Wait for Vietnamese input to be available
    await page.waitForFunction(() => (window as any).vietnameseInput);
  });

  test('should load the editor interface correctly', async ({ page }) => {
    // Check if the main components are visible
    await expect(page.locator('[data-testid="editor-container"]')).toBeVisible();
    
    // Check if control buttons are present
    await expect(page.getByRole('button', { name: 'OFF' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'TELEX' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'VNI' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'VIQR' })).toBeVisible();
    
    // Check action buttons
    await expect(page.getByRole('button', { name: 'Clear' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Copy' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Paste' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Download' })).toBeVisible();
  });

  test('should initialize OverType editor', async ({ page }) => {
    // Wait for OverType textarea to appear
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible({ timeout: 10000 });
    
    // Check if textarea is editable
    await textarea.click();
    await textarea.type('Hello World');
    await expect(textarea).toHaveValue(/Hello World/);
  });

  test('should activate TELEX mode', async ({ page }) => {
    // Click TELEX button
    await page.getByRole('button', { name: 'TELEX' }).click();
    
    // Verify TELEX button is active (has primary color)
    const telexButton = page.getByRole('button', { name: 'TELEX' });
    await expect(telexButton).toHaveClass(/bg-primary/);
    
    // Check console for activation message
    const messages = await page.evaluate(() => {
      return (window as any).vietnameseInput?.getMethod();
    });
    expect(messages).toBe('TELEX');
  });

  test('should process Vietnamese TELEX input - basic transformations', async ({ page }) => {
    // Activate TELEX mode
    await page.getByRole('button', { name: 'TELEX' }).click();
    
    // Wait for textarea
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Clear any existing content
    await page.getByRole('button', { name: 'Clear' }).click();
    
    // Test basic transformations
    const testCases = [
      { input: 'aa', expected: 'â' },
      { input: 'ee', expected: 'ê' },  
      { input: 'oo', expected: 'ô' },
      { input: 'dd', expected: 'đ' },
    ];

    for (const testCase of testCases) {
      await textarea.clear();
      await textarea.type(testCase.input, { delay: 100 });
      
      // Wait for processing
      await page.waitForTimeout(200);
      
      const value = await textarea.inputValue();
      expect(value).toContain(testCase.expected);
      
      console.log(`✅ ${testCase.input} → ${value}`);
    }
  });

  test('should process Vietnamese TELEX input - complex words', async ({ page }) => {
    // Activate TELEX mode
    await page.getByRole('button', { name: 'TELEX' }).click();
    
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Test complex Vietnamese words
    const testCases = [
      { input: 'Tieesng', expected: 'Tiếng' },
      { input: 'Vieetj', expected: 'Việt' },
      { input: 'ngoon', expected: 'ngôn' },
      { input: 'ngono', expected: 'ngôn' }, // long-distance
      { input: 'nguwx', expected: 'ngữ' },
      { input: 'hoaij', expected: 'hoại' },
    ];

    for (const testCase of testCases) {
      await textarea.clear();
      
      // Type the word character by character with small delays
      for (const char of testCase.input) {
        await textarea.type(char, { delay: 50 });
      }
      
      // Wait for processing
      await page.waitForTimeout(300);
      
      const value = await textarea.inputValue();
      expect(value.trim()).toBe(testCase.expected);
      
      console.log(`✅ ${testCase.input} → ${value.trim()}`);
    }
  });

  test('should process Vietnamese paragraph correctly', async ({ page }) => {
    // Activate TELEX mode
    await page.getByRole('button', { name: 'TELEX' }).click();
    
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Clear editor
    await page.getByRole('button', { name: 'Clear' }).click();
    
    // Type a Vietnamese sentence word by word
    const telexWords = ['Tieesng', 'Vieetj', 'laf', 'ngoon', 'nguwx'];
    const expectedWords = ['Tiếng', 'Việt', 'là', 'ngôn', 'ngữ'];
    
    for (let i = 0; i < telexWords.length; i++) {
      if (i > 0) {
        await textarea.type(' ', { delay: 50 });
      }
      
      // Type word character by character
      for (const char of telexWords[i]) {
        await textarea.type(char, { delay: 30 });
      }
      
      await page.waitForTimeout(100);
    }
    
    // Wait for final processing
    await page.waitForTimeout(500);
    
    const finalValue = await textarea.inputValue();
    const expectedSentence = expectedWords.join(' ');
    
    expect(finalValue.trim()).toBe(expectedSentence);
    console.log(`✅ Sentence: ${finalValue.trim()}`);
  });

  test('should toggle between input modes', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Test OFF mode
    await page.getByRole('button', { name: 'OFF' }).click();
    await textarea.clear();
    await textarea.type('aa');
    await page.waitForTimeout(200);
    let value = await textarea.inputValue();
    expect(value).toBe('aa'); // No transformation in OFF mode
    
    // Test TELEX mode  
    await page.getByRole('button', { name: 'TELEX' }).click();
    await textarea.clear();
    await textarea.type('aa', { delay: 50 });
    await page.waitForTimeout(200);
    value = await textarea.inputValue();
    expect(value).toBe('â'); // Should transform in TELEX mode
    
    console.log('✅ Mode toggling works correctly');
  });

  test('should handle editor actions', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Test Clear button
    await textarea.type('test content');
    await page.getByRole('button', { name: 'Clear' }).click();
    const clearedValue = await textarea.inputValue();
    expect(clearedValue).toBe('');
    
    // Test typing after clear
    await page.getByRole('button', { name: 'TELEX' }).click();
    await textarea.type('aa', { delay: 50 });
    await page.waitForTimeout(200);
    const newValue = await textarea.inputValue();
    expect(newValue).toBe('â');
    
    console.log('✅ Editor actions work correctly');
  });

  test('should test engine from console', async ({ page }) => {
    // Test engine via console
    const testResults = await page.evaluate(async () => {
      const input = (window as any).vietnameseInput;
      if (!input) return { error: 'vietnameseInput not available' };
      
      // Test engine method
      const engine = input.telexEngine;
      const testCases = [
        ['aa', 'â'],
        ['Tieesng', 'Tiếng'],
        ['ngono', 'ngôn'],
        ['hoaij', 'hoại'],
      ];
      
      const results: any[] = [];
      testCases.forEach(([inp, exp]) => {
        const result = engine.processWord(inp);
        results.push({
          input: inp,
          expected: exp,
          actual: result,
          correct: result === exp
        });
      });
      
      return results;
    });
    
    expect(testResults).not.toHaveProperty('error');
    
    // Verify all test cases passed
    for (const result of testResults as any[]) {
      expect(result.correct).toBe(true);
      console.log(`✅ Console test: ${result.input} → ${result.actual}`);
    }
  });

  test('should handle complex Vietnamese typing scenario', async ({ page }) => {
    // Activate TELEX
    await page.getByRole('button', { name: 'TELEX' }).click();
    
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    await page.getByRole('button', { name: 'Clear' }).click();
    
    // Type a complex Vietnamese text with mixed patterns
    const complexText = 'dduowcj nhaanj';
    const expectedResult = 'được nhận';
    
    // Type character by character with realistic delays
    for (const char of complexText) {
      await textarea.type(char, { delay: 40 });
      if (char === ' ') {
        await page.waitForTimeout(100); // Slight pause at word boundaries
      }
    }
    
    await page.waitForTimeout(500);
    
    const finalValue = await textarea.inputValue();
    expect(finalValue.trim()).toBe(expectedResult);
    
    console.log(`✅ Complex typing: "${complexText}" → "${finalValue.trim()}"`);
  });
});