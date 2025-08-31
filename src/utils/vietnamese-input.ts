/**
 * Vietnamese Input Manager
 *
 * Manages Vietnamese typing through various input methods.
 * Currently implements TELEX method with real-time character processing.
 * Attaches to text inputs and transforms typing as user types.
 */
export type InputMethod = "OFF" | "AUTO" | "TELEX" | "VNI" | "VIQR";

import { TelexInputMethod } from "../engine/methods/telex";

class VietnameseInput {
  private telexEngine = new TelexInputMethod();
  private attachedElements = new Set<HTMLElement>();
  private currentMethod: InputMethod = "TELEX"; // Start with TELEX
  private enabled: boolean = true;
  private currentWords = new Map<HTMLElement, string>(); // Track current word being typed
  private originalWords = new Map<HTMLElement, string>(); // Track original typed sequence
  private lastCursorPositions = new Map<HTMLElement, number>(); // Track cursor position

  constructor() {
    console.log(
      "🚀 New Vietnamese TELEX engine initialized - ready for real-time processing!",
    );
  }

  public attach(element: HTMLTextAreaElement | HTMLInputElement): void {
    if (this.attachedElements.has(element)) return;

    this.attachedElements.add(element);
    this.currentWords.set(element, "");
    this.lastCursorPositions.set(element, 0);

    // Attach event listeners for Vietnamese input processing
    this.setupEventListeners(element);
    console.log("✓ Vietnamese TELEX engine attached to editor textarea!");
  }

  public detach(element: HTMLTextAreaElement | HTMLInputElement): void {
    if (!this.attachedElements.has(element)) return;

    this.attachedElements.delete(element);
    this.currentWords.delete(element);
    this.originalWords.delete(element);
    this.lastCursorPositions.delete(element);

    // Remove event listeners
    this.removeEventListeners(element);
    console.log("✓ Vietnamese TELEX engine detached from element");
  }

  private setupEventListeners(element: HTMLElement): void {
    if (!(element as any)._vietnameseInputAttached) {
      // Only process on keyup to avoid conflicts with input events
      element.addEventListener(
        "keyup",
        this.handleKeyUpWithProcessing.bind(this, element),
      );
      element.addEventListener(
        "keydown",
        this.handleKeyDown.bind(this, element),
      );
      (element as any)._vietnameseInputAttached = true;
    }
  }

  private removeEventListeners(element: HTMLElement): void {
    // Clean up listeners
    (element as any)._vietnameseInputAttached = false;
  }

  private handleKeyDown(element: HTMLElement, event: KeyboardEvent): void {
    if (
      !this.enabled ||
      this.currentMethod === "OFF" ||
      this.currentMethod !== "TELEX"
    )
      return;

    // Reset word tracking on space, enter, or word boundary characters
    if (event.key === " " || event.key === "Enter" || event.key === "Tab") {
      this.currentWords.set(element, "");
      this.originalWords.set(element, "");
    }
  }

  private handleKeyUpWithProcessing(
    element: HTMLElement,
    event: KeyboardEvent,
  ): void {
    if (
      !this.enabled ||
      this.currentMethod === "OFF" ||
      this.currentMethod !== "TELEX"
    )
      return;

    const inputElement = element as HTMLInputElement | HTMLTextAreaElement;

    // Track cursor position for word boundary detection
    const cursorPos = inputElement.selectionStart || 0;
    const lastPos = this.lastCursorPositions.get(element) || 0;

    // If cursor moved significantly or backspace was pressed, reset word tracking
    if (Math.abs(cursorPos - lastPos) > 1 || event.key === "Backspace") {
      this.currentWords.set(element, "");
      this.originalWords.set(element, "");
    }

    this.lastCursorPositions.set(element, cursorPos);

    // Process Vietnamese input after keyup
    if (event.key.length === 1 || event.key === "Backspace") {
      this.processCurrentWord(inputElement);
    }
  }

  private processCurrentWord(
    inputElement: HTMLInputElement | HTMLTextAreaElement,
  ): void {
    const cursorPos = inputElement.selectionStart || 0;
    const textBefore = inputElement.value.substring(0, cursorPos);
    const textAfter = inputElement.value.substring(cursorPos);

    // Extract the current word being typed (letters only)
    const wordMatch = textBefore.match(/[a-zA-Z\^]+$/);

    if (wordMatch) {
      const currentWord = wordMatch[0];

      // Process the word with our TELEX engine every time
      const processedWord = this.telexEngine.processWord(currentWord);

      if (processedWord !== currentWord) {
        console.log(`🔄 TELEX: "${currentWord}" → "${processedWord}"`);

        const beforeWord = textBefore.substring(
          0,
          textBefore.length - currentWord.length,
        );
        const newValue = beforeWord + processedWord + textAfter;
        const newCursorPos = beforeWord.length + processedWord.length;

        // Update the input value
        inputElement.value = newValue;
        inputElement.setSelectionRange(newCursorPos, newCursorPos);

        // Trigger input event to notify other systems (like OverType)
        const inputEvent = new Event("input", { bubbles: true });

        (inputEvent as any)._vietnameseProcessed = true;
        inputElement.dispatchEvent(inputEvent);
      }
    }
  }

  public setMethod(method: InputMethod): void {
    const oldMethod = this.currentMethod;

    this.currentMethod = method;

    // Clear all current word states when switching methods
    this.currentWords.clear();
    this.originalWords.clear();
    this.lastCursorPositions.clear();

    console.log(`🔄 Input method changed: ${oldMethod} → ${method}`);

    if (method === "TELEX") {
      console.log("✅ TELEX mode active - Vietnamese typing enabled!");
    } else if (method === "OFF") {
      console.log("❌ Vietnamese input disabled");
    } else {
      console.log(`⚠️  ${method} mode selected but only TELEX is implemented`);
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;

    // Clear all current word states when enabling/disabling
    this.currentWords.clear();
    this.originalWords.clear();
    this.lastCursorPositions.clear();

    console.log(
      enabled ? "✅ Vietnamese input enabled" : "❌ Vietnamese input disabled",
    );
  }

  public getMethod(): InputMethod {
    return this.currentMethod;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public getEngineInfo(): string {
    return "Vietnamese TELEX Engine v2.0 - Supporting all Vietnamese diacritics and tones";
  }

  public testEngine(): void {
    console.log("🧪 Testing TELEX Engine:");
    const testCases = [
      ["Tieesng", "Tiếng"],
      ["Vieetj", "Việt"],
      ["ngoon", "ngôn"],
      ["ngono", "ngôn"], // long-distance
      ["nguwx", "ngữ"],
      ["dduowcj", "được"],
      ["hoaij", "hoại"],
      ["vietj", "viẹt"],
    ];

    testCases.forEach(([input, expected]) => {
      const result = this.telexEngine.processWord(input);

      console.log(
        `"${input}" → "${result}" ${result === expected ? "✅" : "❌"}`,
      );
    });
  }
}

// Export singleton instance
export const vietnameseInput = new VietnameseInput();

// Make it available globally for console testing
if (typeof window !== "undefined") {
  (window as any).vietnameseInput = vietnameseInput;
  console.log(
    "🌐 vietnameseInput is now available in console! Try: vietnameseInput.testEngine()",
  );
}
