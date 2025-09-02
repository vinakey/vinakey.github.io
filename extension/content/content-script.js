/**
 * VinaKey Content Script - Injects Vietnamese input into web pages
 */

// Import the Vietnamese input engine (will be bundled)
import { TelexInputMethod } from "../../src/engine/methods/telex.js";

class VinaKeyContentScript {
  constructor() {
    this.inputMethod = new TelexInputMethod();
    this.enabled = true;
    this.currentMethod = "TELEX";
    this.attachedElements = new Set();
    this.compositionData = new Map(); // Track composition state per element

    this.init();
  }

  async init() {
    // Get initial settings
    const settings = await this.getSettings();
    this.enabled = settings.enabled;
    this.currentMethod = settings.inputMethod;

    // Start monitoring for input elements
    this.attachToExistingElements();
    this.observeNewElements();

    // Listen for settings updates
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse);
    });

    console.log("VinaKey content script initialized");
  }

  async getSettings() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: "getSettings" }, resolve);
    });
  }

  handleMessage(message, sender, sendResponse) {
    switch (message.action) {
      case "settingsUpdated":
        this.enabled = message.settings.enabled;
        this.currentMethod = message.settings.inputMethod;
        this.updateAttachedElements();
        break;

      case "toggleEnabled":
        this.enabled = message.enabled;
        this.updateAttachedElements();
        break;
    }
  }

  attachToExistingElements() {
    // Find all text input elements
    const inputs = document.querySelectorAll(
      'input[type="text"], input[type="search"], textarea, [contenteditable="true"]',
    );

    inputs.forEach((element) => this.attachToElement(element));
  }

  observeNewElements() {
    // Watch for new input elements being added to the DOM
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is an input element
            if (this.isInputElement(node)) {
              this.attachToElement(node);
            }

            // Check for input elements within the added node
            const inputs = node.querySelectorAll?.(
              'input[type="text"], input[type="search"], textarea, [contenteditable="true"]',
            );
            inputs?.forEach((element) => this.attachToElement(element));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  isInputElement(element) {
    const tagName = element.tagName?.toLowerCase();
    return (
      (tagName === "input" && ["text", "search"].includes(element.type)) ||
      tagName === "textarea" ||
      element.contentEditable === "true"
    );
  }

  attachToElement(element) {
    if (this.attachedElements.has(element)) return;

    this.attachedElements.add(element);
    this.compositionData.set(element, {
      buffer: "",
      lastProcessedLength: 0,
    });

    // Add event listeners
    element.addEventListener("keydown", (e) => this.handleKeyDown(e, element));
    element.addEventListener("input", (e) => this.handleInput(e, element));
    element.addEventListener("blur", (e) => this.handleBlur(e, element));

    // Add visual indicator when focused (optional)
    element.addEventListener("focus", (e) => this.handleFocus(e, element));
  }

  updateAttachedElements() {
    // Update all attached elements with current settings
    this.attachedElements.forEach((element) => {
      if (this.enabled) {
        element.classList.add("vinakey-enabled");
      } else {
        element.classList.remove("vinakey-enabled");
        this.clearComposition(element);
      }
    });
  }

  handleKeyDown(event, element) {
    if (!this.enabled) return;

    // Handle special keys
    if (event.key === "Escape") {
      this.clearComposition(element);
      return;
    }

    if (event.key === "Enter" || event.key === "Tab") {
      this.commitComposition(element);
      return;
    }
  }

  handleInput(event, element) {
    if (!this.enabled) return;

    const composition = this.compositionData.get(element);
    if (!composition) return;

    // Get current text content
    const currentText = this.getElementText(element);
    const cursorPos = this.getCursorPosition(element);

    // Extract the word being typed (simple approach - could be improved)
    const wordMatch = currentText.slice(0, cursorPos).match(/[a-zA-Z]+$/);
    const currentWord = wordMatch ? wordMatch[0] : "";

    if (currentWord && currentWord !== composition.buffer) {
      // Process the word through Vietnamese input
      const processedWord = this.inputMethod.processWord(currentWord);

      if (processedWord !== currentWord) {
        // Replace the word in the text
        const beforeWord = currentText.slice(0, cursorPos - currentWord.length);
        const afterWord = currentText.slice(cursorPos);
        const newText = beforeWord + processedWord + afterWord;

        // Update element
        this.setElementText(element, newText);
        this.setCursorPosition(
          element,
          beforeWord.length + processedWord.length,
        );
      }

      composition.buffer = currentWord;
    }
  }

  handleFocus(event, element) {
    if (!this.enabled) return;

    // Add visual indicator that VinaKey is active
    element.classList.add("vinakey-active");
  }

  handleBlur(event, element) {
    element.classList.remove("vinakey-active");
    this.clearComposition(element);
  }

  clearComposition(element) {
    const composition = this.compositionData.get(element);
    if (composition) {
      composition.buffer = "";
      composition.lastProcessedLength = 0;
    }
  }

  commitComposition(element) {
    // For now, just clear the composition
    this.clearComposition(element);
  }

  getElementText(element) {
    if (
      element.tagName.toLowerCase() === "textarea" ||
      element.tagName.toLowerCase() === "input"
    ) {
      return element.value;
    } else {
      return element.textContent || "";
    }
  }

  setElementText(element, text) {
    if (
      element.tagName.toLowerCase() === "textarea" ||
      element.tagName.toLowerCase() === "input"
    ) {
      element.value = text;
    } else {
      element.textContent = text;
    }
  }

  getCursorPosition(element) {
    if (
      element.tagName.toLowerCase() === "textarea" ||
      element.tagName.toLowerCase() === "input"
    ) {
      return element.selectionStart || 0;
    } else {
      // For contenteditable, this is more complex
      const selection = window.getSelection();
      return selection.anchorOffset || 0;
    }
  }

  setCursorPosition(element, position) {
    if (
      element.tagName.toLowerCase() === "textarea" ||
      element.tagName.toLowerCase() === "input"
    ) {
      element.selectionStart = element.selectionEnd = position;
    } else {
      // For contenteditable
      const range = document.createRange();
      const selection = window.getSelection();

      if (element.firstChild) {
        range.setStart(
          element.firstChild,
          Math.min(position, element.firstChild.textContent.length),
        );
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => new VinaKeyContentScript(),
  );
} else {
  new VinaKeyContentScript();
}
