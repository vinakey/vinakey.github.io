import { test, expect } from '@playwright/test';

test.describe('Debug aa transformation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => window.OverType);
    await page.waitForFunction(() => (window as any).vietnameseInput);
  });

  test('should debug aa → â transformation step by step', async ({ page }) => {
    // Activate TELEX mode
    await page.getByRole('button', { name: 'TELEX' }).click();
    
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Clear editor
    await page.getByRole('button', { name: 'Clear' }).click();
    
    // Test direct engine processing via console
    const engineTest = await page.evaluate(() => {
      const input = (window as any).vietnameseInput;
      const engine = input.telexEngine;
      return {
        processWord_aa: engine.processWord('aa'),
        process_a_a: engine.process('a', 'a'),
        currentMethod: input.getMethod(),
        isEnabled: input.isEnabled()
      };
    });
    
    console.log('Engine tests:', engineTest);
    expect(engineTest.processWord_aa).toBe('â');
    expect(engineTest.process_a_a).toBe('â');
    
    // Now test in actual editor
    await textarea.type('a', { delay: 100 });
    let value1 = await textarea.inputValue();
    console.log('After first "a":', value1);
    
    await textarea.type('a', { delay: 100 });
    let value2 = await textarea.inputValue();
    console.log('After second "a":', value2);
    
    await page.waitForTimeout(500);
    let finalValue = await textarea.inputValue();
    console.log('Final value:', finalValue);
    
    // Check what's in the editor
    const editorDebug = await page.evaluate(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      return {
        value: textarea.value,
        selectionStart: textarea.selectionStart,
        selectionEnd: textarea.selectionEnd
      };
    });
    
    console.log('Editor debug:', editorDebug);
  });

  test('should compare with OFF mode', async ({ page }) => {
    const textarea = page.locator('textarea');
    await expect(textarea).toBeVisible();
    
    // Test with OFF mode first
    await page.getByRole('button', { name: 'OFF' }).click();
    await page.getByRole('button', { name: 'Clear' }).click();
    
    await textarea.type('aa', { delay: 100 });
    const offValue = await textarea.inputValue();
    console.log('OFF mode result:', offValue);
    
    // Now test with TELEX
    await page.getByRole('button', { name: 'TELEX' }).click();
    await page.getByRole('button', { name: 'Clear' }).click();
    
    await textarea.type('aa', { delay: 100 });
    await page.waitForTimeout(500);
    const telexValue = await textarea.inputValue();
    console.log('TELEX mode result:', telexValue);
    
    // Check if there are any other input systems interfering
    const globalCheck = await page.evaluate(() => {
      return {
        hasAVIM: typeof (window as any).AVIMGlobalConfig !== 'undefined',
        hasOtherVietInputs: typeof (window as any).VietIME !== 'undefined',
        telexEngine: (window as any).vietnameseInput?.getEngineInfo?.(),
        overTypeVersion: typeof window.OverType
      };
    });
    
    console.log('Global systems check:', globalCheck);
  });
});