import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/system";
import { useHref, useNavigate } from "react-router-dom";

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NavigateOptions;
  }
}

// Simulate pressing theme toggle to light before components load
// This ensures both HeroUI and OverType default to light theme instead of system
if (typeof window !== 'undefined') {
  const currentTheme = localStorage.getItem('heroui-theme');
  if (!currentTheme) {
    console.log('Setting default theme to light in localStorage');
    localStorage.setItem('heroui-theme', 'light');
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <HeroUIProvider navigate={navigate} useHref={useHref}>
      <div className="text-foreground bg-background">
        {children}
      </div>
    </HeroUIProvider>
  );
}
