import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "@/components/theme-switch";
import { GithubIcon } from "@/components/icons";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="full" position="sticky">
      {/* Left side - VinKey branding */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-foreground leading-tight">
              <span className="text-primary">Vin</span>
              <span className="text-secondary">Key</span>
            </h1>
            <p className="text-sm text-default-500 italic">
              Vietnamese markdown editor
            </p>
          </div>
        </NavbarBrand>
      </NavbarContent>

      {/* Right side - GitHub and theme toggle */}
      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <Link isExternal href="https://github.com/vinakey/vinakey.github.io" title="GitHub">
            <GithubIcon className="text-default-500 hover:text-primary transition-colors" size={20} />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile - Right side */}
      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <Link isExternal href="https://github.com/vinakey/vinakey.github.io" title="GitHub">
          <GithubIcon className="text-default-500" size={20} />
        </Link>
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};
