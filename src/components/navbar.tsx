import { Link } from "@heroui/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

export const Navbar = () => {
  return (
    <nav className="fixed top-0 right-0 z-50 p-4">
      <div className="flex items-center gap-3">
        <Link isExternal href="https://github.com/vinakey/vinakey.github.io" title="GitHub">
          <GithubIcon className="text-default-500 hover:text-primary transition-colors" size={20} />
        </Link>
        <ThemeSwitch />
      </div>
    </nav>
  );
};
