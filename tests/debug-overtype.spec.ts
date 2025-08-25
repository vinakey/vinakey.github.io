import { test, expect } from '@playwright/test';

test.describe('OverType Debug', () => {
  test('detailed OverType debugging', async ({ page }) => {
    await page.goto('http://localhost:5176');
    await page.waitForLoadState('networkidle');
    
    // Check if the script loaded
    const scriptLoaded = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(s => s.src && s.src.includes('overtype'));
    });
    
    console.log('OverType script loaded:', scriptLoaded);
    
    // Check exact OverType structure
    const overTypeStructure = await page.evaluate(() => {
      if (typeof window.OverType === 'undefined') {
        return 'OverType not found';
      }
      
      const structure: any = {};
      structure.type = typeof window.OverType;
      structure.constructor = typeof window.OverType.constructor;
      structure.isFunction = typeof window.OverType === 'function';
      structure.hasNew = 'prototype' in window.OverType;
      
      try {
        structure.keys = Object.keys(window.OverType);
        structure.methods = Object.getOwnPropertyNames(window.OverType);
      } catch (e) {
        structure.error = e.message;
      }
      
      return structure;
    });
    
    console.log('OverType structure:', JSON.stringify(overTypeStructure, null, 2));
    
    // Try different ways to call OverType
    const testResults = await page.evaluate(() => {
      const results: any = {};
      const testDiv = document.createElement('div');
      testDiv.id = 'test-editor';
      testDiv.style.height = '200px';
      document.body.appendChild(testDiv);
      
      // Test 1: Direct constructor call
      try {
        const instance1 = new (window.OverType as any)('#test-editor', {
          placeholder: 'Test...'
        });
        results.directConstructor = {
          success: true,
          type: typeof instance1,
          isArray: Array.isArray(instance1),
          length: instance1?.length
        };
      } catch (e) {
        results.directConstructor = { success: false, error: e.message };
      }
      
      // Test 2: Try OverType function call
      try {
        const instance2 = (window.OverType as any)('#test-editor', {
          placeholder: 'Test...'
        });
        results.functionCall = {
          success: true,
          type: typeof instance2,
          isArray: Array.isArray(instance2),
          length: instance2?.length
        };
      } catch (e) {
        results.functionCall = { success: false, error: e.message };
      }
      
      // Test 3: Check if it's a default export
      try {
        const OverTypeClass = (window.OverType as any).default || window.OverType;
        const instance3 = new OverTypeClass('#test-editor', {
          placeholder: 'Test...'
        });
        results.defaultExport = {
          success: true,
          type: typeof instance3,
          isArray: Array.isArray(instance3),
          length: instance3?.length
        };
      } catch (e) {
        results.defaultExport = { success: false, error: e.message };
      }
      
      // Check if textarea was created
      results.textareaAfterTest = document.querySelectorAll('textarea').length;
      
      return results;
    });
    
    console.log('Test results:', JSON.stringify(testResults, null, 2));
    
    // Check network requests
    const requests = [];
    page.on('request', request => {
      if (request.url().includes('overtype')) {
        requests.push({
          url: request.url(),
          status: 'pending'
        });
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('overtype')) {
        requests.push({
          url: response.url(),
          status: response.status(),
          ok: response.ok()
        });
      }
    });
    
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log('Network requests for OverType:', requests);
    
    // Take screenshot
    await page.screenshot({ path: 'overtype-debug.png', fullPage: true });
  });
});