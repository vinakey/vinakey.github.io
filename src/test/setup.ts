import "@testing-library/jest-dom";

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock window.OverType since it's loaded via script tag
Object.defineProperty(window, "OverType", {
  value: {
    setTheme: vi.fn(),
    getInstance: vi.fn(),
    destroyAll: vi.fn(),
  },
  writable: true,
});
