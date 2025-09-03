/* eslint-disable no-console */

// Minimal logger that avoids triggering the no-console lint rule across the codebase.
// Use this instead of direct console.* calls.

// Detect dev via Vite's import.meta.env when present
const viteEnv =
  (typeof import.meta !== "undefined" && (import.meta as any).env) || {};
const isDev: boolean = Boolean(
  (viteEnv && viteEnv.DEV) || process.env.NODE_ENV === "development",
);

export const logger = {
  debug: (...args: any[]) => {
    if (isDev) console.debug(...args);
  },
  info: (...args: any[]) => {
    if (isDev) console.info(...args);
  },
  warn: (...args: any[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: any[]) => {
    if (isDev) console.error(...args);
  },
};
