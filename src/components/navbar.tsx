import { Link } from "@heroui/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

export const Navbar = () => {
  return (
    <>
      {/* Title on top-left */}
      <nav className="fixed top-0 left-0 z-50 p-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            <span className="text-primary">Vin</span>
            <span className="text-secondary">Key</span>
          </h1>
          <p className="text-sm text-default-500 mt-1 italic">
            Vietnamese markdown editor
          </p>
        </div>
      </nav>
      
      {/* Icons on top-right */}
      <nav className="fixed top-0 right-0 z-50 p-4">
        <div className="flex items-center gap-3">
          <Link isExternal href="https://github.com/vinakey/vinakey.github.io" title="GitHub">
            <GithubIcon className="text-default-500 hover:text-primary transition-colors" size={20} />
          </Link>
          <ThemeSwitch />
        </div>
      </nav>
    </>
  );
};
