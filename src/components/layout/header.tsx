"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginButton } from "@/components/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Browse", href: "/browse" },
  { name: "Submit", href: "/submit" },
  { name: "About", href: "/about" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use light mode assets as default during SSR
  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/think-brainfist-darkmode-mode.svg" 
    : "/think-brainfist-light-mode.svg";
  
  const wordmarkSrc = mounted && resolvedTheme === "dark"
    ? "/think-marketplace-wordmark-dark-mode-white.svg"
    : "/think-marketplace-wordmark-light-mode.svg";

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link
            href="/"
            className="-m-1.5 p-1.5 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md group"
          >
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Image
                src={logoSrc}
                alt=""
                width={32}
                height={36}
                className="h-9 w-auto"
                priority
              />
            </motion.div>
            <Image
              src={wordmarkSrc}
              alt="Think Marketplace"
              width={120}
              height={16}
              className="h-4 w-auto ml-1"
              priority
            />
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-all hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md px-2 py-1 relative",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.name}
              {pathname === item.href && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right side - theme toggle, login, and CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          <ThemeToggle />
          <LoginButton />
          <Button asChild className="shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <Link href="/submit">Submit Listing</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden gap-x-2">
          <ThemeToggle />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8" aria-label="Mobile navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-lg font-medium transition-colors hover:text-primary px-2 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      pathname === item.href
                        ? "text-primary bg-accent"
                        : "text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  <LoginButton />
                  <Button asChild className="w-full">
                    <Link href="/submit" onClick={() => setMobileMenuOpen(false)}>
                      Submit Listing
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </motion.header>
  );
}