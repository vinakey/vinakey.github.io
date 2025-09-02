/**
 * VinaKey Extension Popup Script
 */

class VinaKeyPopup {
  constructor() {
    this.settings = {
      enabled: true,
      inputMethod: "TELEX",
      showTooltips: true,
    };

    this.initElements();
    this.loadSettings();
    this.attachEventListeners();
  }

  initElements() {
    this.enabledToggle = document.getElementById("enabledToggle");
    this.inputMethodSelect = document.getElementById("inputMethodSelect");
    this.statusText = document.getElementById("statusText");
    this.openOptionsBtn = document.getElementById("openOptionsBtn");
  }

  async loadSettings() {
    try {
      // Get settings from background script
      const settings = await this.getSettings();
      this.settings = { ...this.settings, ...settings };

      // Update UI elements
      this.updateUI();
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "getSettings" }, resolve);
    });
  }

  updateSettings(newSettings) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        {
          action: "updateSettings",
          settings: newSettings,
        },
        resolve,
      );
    });
  }

  updateUI() {
    // Update toggle
    this.enabledToggle.checked = this.settings.enabled;

    // Update status text
    this.statusText.textContent = this.settings.enabled
      ? "Enabled"
      : "Disabled";
    this.statusText.className = this.settings.enabled
      ? "toggle-status enabled"
      : "toggle-status disabled";

    // Update input method
    this.inputMethodSelect.value = this.settings.inputMethod;

    // Update container class
    document.body.className = this.settings.enabled ? "enabled" : "disabled";
  }

  attachEventListeners() {
    // Toggle enabled/disabled
    this.enabledToggle.addEventListener("change", async (e) => {
      this.settings.enabled = e.target.checked;
      await this.updateSettings({ enabled: this.settings.enabled });
      this.updateUI();
    });

    // Input method selection
    this.inputMethodSelect.addEventListener("change", async (e) => {
      this.settings.inputMethod = e.target.value;
      await this.updateSettings({ inputMethod: this.settings.inputMethod });
      this.updateReferenceContent();
    });

    // Open options page
    this.openOptionsBtn.addEventListener("click", () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL("options/options.html"),
      });
      window.close();
    });

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        window.close();
      }

      // Toggle with Ctrl+Shift+V
      if (e.ctrlKey && e.shiftKey && e.key === "V") {
        this.enabledToggle.checked = !this.enabledToggle.checked;
        this.enabledToggle.dispatchEvent(new Event("change"));
      }
    });
  }

  updateReferenceContent() {
    // Update quick reference based on selected input method
    // This could be expanded to show method-specific shortcuts
    const method = this.settings.inputMethod;

    // For now, always show TELEX shortcuts
    // Could be enhanced to show VNI/VIQR specific shortcuts
    console.log(`Reference updated for ${method} method`);
  }
}

// Initialize popup when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new VinaKeyPopup();
});
