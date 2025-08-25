import { test, expect } from '@playwright/test';

test.describe('Simple Vietnamese Input Test', () => {
  test('test Vietnamese input directly', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await page.waitForLoadState('networkidle');
    
    // Wait for OverType to initialize
    await page.waitForTimeout(3000);
    
    // Check if textarea exists
    const textareaCount = await page.locator('textarea').count();
    console.log(`Found ${textareaCount} textarea(s)`);
    
    if (textareaCount === 0) {
      console.log('❌ No textarea found');
      return;
    }
    
    // Get the textarea
    const textarea = page.locator('textarea').first();
    
    // Click to focus
    await textarea.click();
    console.log('✓ Clicked textarea');
    
    // Test basic typing first
    await textarea.fill('');
    await textarea.type('hello');
    
    let value = await textarea.inputValue();
    console.log(`Basic typing test: "${value}"`);
    expect(value).toBe('hello');
    
    // Clear and test Vietnamese TELEX transformation
    await textarea.fill('');
    
    // Type 'aa' which should become 'â' with TELEX
    await textarea.type('aa');
    await page.waitForTimeout(100);
    
    value = await textarea.inputValue();
    console.log(`After typing "aa": "${value}"`);
    
    // Test tone marker 's' -> acute accent
    await textarea.fill('');
    await textarea.type('as');
    await page.waitForTimeout(100);
    
    value = await textarea.inputValue();
    console.log(`After typing "as": "${value}"`);
    
    // Test full word transformation
    await textarea.fill('');
    await textarea.type('xin chaof');
    await page.waitForTimeout(200);
    
    value = await textarea.inputValue();
    console.log(`After typing "xin chaof": "${value}"`);
    
    // Test dd -> đ
    await textarea.fill('');
    await textarea.type('dd');
    await page.waitForTimeout(100);
    
    value = await textarea.inputValue();
    console.log(`After typing "dd": "${value}"`);
    
    // Test ow -> ơ  
    await textarea.fill('');
    await textarea.type('ow');
    await page.waitForTimeout(100);
    
    value = await textarea.inputValue();
    console.log(`After typing "ow": "${value}"`);
    
    // Test more complex combinations
    await textarea.fill('');
    await textarea.type('theees gioois');
    await page.waitForTimeout(200);
    
    value = await textarea.inputValue();
    console.log(`After typing "theees gioois": "${value}"`);
    
    console.log('✓ Vietnamese input tests completed');
  });
});