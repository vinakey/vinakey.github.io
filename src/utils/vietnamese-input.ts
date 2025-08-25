// Vietnamese Input Method wrapper for AVIM.js
export type InputMethod = "OFF" | "AUTO" | "TELEX" | "VNI" | "VIQR";

// Extend window object to include AVIM
declare global {
  interface Window {
    AVIM: any;
    AVIMObj: any;
    AVIMGlobalConfig: any;
  }
}

class VietnameseInput {
  private avimInstance: any = null;
  private attachedElements = new Set<HTMLElement>();
  private currentMethod: InputMethod = "AUTO";
  private enabled: boolean = true;

  constructor() {
    // Wait for AVIM to be available
    this.initializeAVIM();
  }

  private async initializeAVIM() {
    // Wait for AVIM to be loaded
    let attempts = 0;

    while (!window.AVIM && attempts < 50) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      attempts++;
    }

    if (window.AVIM) {
      // Create AVIM instance
      this.avimInstance = new window.AVIM();
      console.log("✓ AVIM initialized successfully");

      // Configure AVIM for TELEX by default
      if (window.AVIMGlobalConfig) {
        window.AVIMGlobalConfig.method = 1; // 1 = TELEX
        window.AVIMGlobalConfig.onOff = 1;
        window.AVIMGlobalConfig.showControl = 0; // Don't show the control panel
      }
    } else {
      console.error("❌ AVIM failed to load");
    }
  }

  public attach(element: HTMLTextAreaElement | HTMLInputElement): void {
    if (this.attachedElements.has(element)) return;

    this.attachedElements.add(element);

    // Use AVIM's attach method if available
    if (this.avimInstance) {
      try {
        this.avimInstance.attach(element);
        console.log("✓ AVIM attached to element");
      } catch (error) {
        console.error("Error attaching AVIM:", error);
      }
    }
  }

  public detach(element: HTMLTextAreaElement | HTMLInputElement): void {
    if (!this.attachedElements.has(element)) return;

    this.attachedElements.delete(element);

    // Use AVIM's detach method if available
    if (this.avimInstance) {
      try {
        this.avimInstance.detach(element);
        console.log("✓ AVIM detached from element");
      } catch (error) {
        console.error("Error detaching AVIM:", error);
      }
    }
  }

  public setMethod(method: InputMethod): void {
    this.currentMethod = method;

    if (window.AVIMGlobalConfig) {
      switch (method) {
        case "OFF":
          window.AVIMGlobalConfig.onOff = 0;
          break;
        case "AUTO":
          window.AVIMGlobalConfig.method = 0;
          window.AVIMGlobalConfig.onOff = 1;
          break;
        case "TELEX":
          window.AVIMGlobalConfig.method = 1;
          window.AVIMGlobalConfig.onOff = 1;
          break;
        case "VNI":
          window.AVIMGlobalConfig.method = 2;
          window.AVIMGlobalConfig.onOff = 1;
          break;
        case "VIQR":
          window.AVIMGlobalConfig.method = 3;
          window.AVIMGlobalConfig.onOff = 1;
          break;
      }
    }
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;

    if (window.AVIMGlobalConfig) {
      window.AVIMGlobalConfig.onOff = enabled ? 1 : 0;
    }
  }

  public getMethod(): InputMethod {
    return this.currentMethod;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton instance
export const vietnameseInput = new VietnameseInput();
