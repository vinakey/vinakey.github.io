import { test, expect } from '@playwright/test';

test.describe('Debug Specific Vietnamese Words', () => {
  test('test "mootj hai ba boons" transformation', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const textarea = page.locator('textarea').first();
    await textarea.click();
    
    // Test each word individually first
    console.log('=== Testing individual words ===');
    
    // Test "mootj" -> "một"
    await textarea.fill('');
    await textarea.type('mootj');
    await page.waitForTimeout(100);
    let value = await textarea.inputValue();
    console.log(`"mootj" → "${value}" (expected: "một")`);
    
    // Test "boons" -> "bốn" 
    await textarea.fill('');
    await textarea.type('boons');
    await page.waitForTimeout(100);
    value = await textarea.inputValue();
    console.log(`"boons" → "${value}" (expected: "bốn")`);
    
    // Test the full phrase
    console.log('=== Testing full phrase ===');
    await textarea.fill('');
    await textarea.type('mootj hai ba boons');
    await page.waitForTimeout(300);
    value = await textarea.inputValue();
    console.log(`"mootj hai ba boons" → "${value}" (expected: "một hai ba bốn")`);
    
    // Test step by step typing to see where it breaks
    console.log('=== Step by step typing ===');
    await textarea.fill('');
    
    // Type character by character and log each step
    const phrase = 'mootj hai ba boons';
    for (let i = 0; i < phrase.length; i++) {
      await textarea.type(phrase[i]);
      if (i % 3 === 0 || phrase[i] === ' ') {
        await page.waitForTimeout(50);
        value = await textarea.inputValue();
        console.log(`After "${phrase.substring(0, i+1)}": "${value}"`);
      }
    }
    
    // Final result
    value = await textarea.inputValue();
    console.log(`Final result: "${value}"`);
    
    // Test some other problematic combinations
    console.log('=== Testing other combinations ===');
    
    // Test "oo" -> "ô"
    await textarea.fill('');
    await textarea.type('oo');
    await page.waitForTimeout(100);
    value = await textarea.inputValue();
    console.log(`"oo" → "${value}" (expected: "ô")`);
    
    // Test "oof" -> "ồ"
    await textarea.fill('');
    await textarea.type('oof');
    await page.waitForTimeout(100);
    value = await textarea.inputValue();
    console.log(`"oof" → "${value}" (expected: "ồ")`);
    
    // Test "ooj" -> "ộ" 
    await textarea.fill('');
    await textarea.type('ooj');
    await page.waitForTimeout(100);
    value = await textarea.inputValue();
    console.log(`"ooj" → "${value}" (expected: "ộ")`);
    
    // Test "oos" -> "ố"
    await textarea.fill('');
    await textarea.type('oos');
    await page.waitForTimeout(100);
    value = await textarea.inputValue();
    console.log(`"oos" → "${value}" (expected: "ố")`);
  });
});