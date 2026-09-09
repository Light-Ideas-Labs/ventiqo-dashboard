"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon } from "lucide-react";

import ThemeToggle from '@/components/layouts/ThemeToggle/theme-toggle';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavItemProps {
  children: React.ReactNode;
  href?: string;
}

function NavItem({ children, href }: NavItemProps) {
  return (
    <li>
      <a
        href={href || "#"}
        // target={href ? "_blank" : "_self"}
        className="flex items-center gap-2 font-medium"
      >
        {children}
      </a>
    </li>
  );
}

const NAV_MENU = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Explore Events", href: "/events" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact Us", href: "/#contact-us" },
];

export function Navbar() {
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false); // Explicit open state for the Sheet

  React.useEffect(() => {
    function handleScroll() {
      setIsScrolling(window.scrollY > 0);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-0 transition-colors duration-300 ${
        isScrolling ? "bg-[#75C9E3]/80 text-white" : "bg-[#75C9E3] text-white"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Image
          src={"/images/logo/ventiqo-white-logo.svg"}
          alt="Ventiqo Logo"
          width={45}
          height={45}
        />

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-6">
          {NAV_MENU.map(({ name, href }) => (
            <NavItem key={name} href={href}>
              <span>{name}</span>
            </NavItem>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="rounded-full border border-white/70 px-5 py-1.5 text-sm font-medium transition hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            href="/sign-up"
            className="rounded-full bg-white px-5 py-1.5 text-sm font-medium text-[#2C7873] transition hover:bg-white/90"
          >
            Signup
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <button
              className="lg:hidden"
              onClick={() => setIsSheetOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="w-6 h-6 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="px-4!">
            <div className="space-y-6 py-6">
              {/* Mobile Navigation */}
              <ul className="space-y-4">
                {NAV_MENU.map(({ name, href }) => (
                  <li key={name}>
                    <Link href={href} className="text-lg font-medium">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 space-y-2">
                <Link href="/sign-in" className="block text-lg">Login</Link>
                <Link href="/sign-up" className="block text-lg">Signup</Link>
                <ThemeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}

export default Navbar;
