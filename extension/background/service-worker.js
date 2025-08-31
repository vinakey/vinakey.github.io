/**
 * VinaKey Extension Background Service Worker
 */

// Extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
  console.log('VinaKey extension installed:', details.reason);
  
  // Set default settings
  chrome.storage.sync.set({
    inputMethod: 'TELEX',
    enabled: true,
    showTooltips: true
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'getSettings':
      chrome.storage.sync.get(['inputMethod', 'enabled', 'showTooltips'], (settings) => {
        sendResponse({
          inputMethod: settings.inputMethod || 'TELEX',
          enabled: settings.enabled !== false,
          showTooltips: settings.showTooltips !== false
        });
      });
      return true; // Keep message channel open for async response
      
    case 'updateSettings':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
        
        // Notify all content scripts of settings change
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
              action: 'settingsUpdated',
              settings: request.settings
            });
          });
        });
      });
      return true;
      
    case 'toggleEnabled':
      chrome.storage.sync.get(['enabled'], (result) => {
        const newState = !result.enabled;
        chrome.storage.sync.set({ enabled: newState }, () => {
          sendResponse({ enabled: newState });
          
          // Update extension icon based on state
          updateExtensionIcon(newState);
          
          // Notify all content scripts
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach(tab => {
              chrome.tabs.sendMessage(tab.id, {
                action: 'toggleEnabled',
                enabled: newState
              });
            });
          });
        });
      });
      return true;
  }
});

// Update extension icon based on enabled state
function updateExtensionIcon(enabled) {
  const iconPath = enabled ? 'icons/icon-32.png' : 'icons/icon-32-disabled.png';
  chrome.action.setIcon({ path: iconPath });
}

// Initialize icon on startup
chrome.storage.sync.get(['enabled'], (result) => {
  updateExtensionIcon(result.enabled !== false);
});