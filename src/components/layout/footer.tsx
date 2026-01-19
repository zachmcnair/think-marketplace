"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Github } from "lucide-react";
import { useEffect, useState } from "react";

// X (formerly Twitter) icon
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const footerLinks = {
  marketplace: [
    { name: "Browse All", href: "/browse" },
    { name: "Apps", href: "/browse?type=app" },
    { name: "Tools", href: "/browse?type=tool" },
    { name: "Agents", href: "/browse?type=agent" },
  ],
  builders: [
    { name: "Submit Listing", href: "/submit" },
    { name: "Builder Guidelines", href: "/about#guidelines" },
    { name: "API Docs", href: "https://docs.thinkagents.ai" },
  ],
  think: [
    { name: "About Think", href: "https://thinkagents.ai" },
    { name: "Documentation", href: "https://docs.thinkagents.ai" },
    { name: "Agent Standard", href: "https://docs.thinkagents.ai/whitepaper/think-agent-standard" },
  ],
};

export function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = mounted && resolvedTheme === "dark" 
    ? "/think-brainfist-darkmode-mode.svg" 
    : "/think-brainfist-light-mode.svg";

  const wordmarkSrc = mounted && resolvedTheme === "dark"
    ? "/think-marketplace-wordmark-dark-mode-white.svg"
    : "/think-marketplace-wordmark-light-mode.svg";

  return (
    <footer className="border-t border-border bg-card" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md w-fit"
            >
              <Image
                src={logoSrc}
                alt=""
                width={32}
                height={36}
                className="h-9 w-auto"
              />
              <Image
                src={wordmarkSrc}
                alt="Think Marketplace"
                width={120}
                height={16}
                className="h-4 w-auto ml-1"
              />
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Apps, tools, and agents built on the Think protocol. AI you actually own.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://x.com/thinkagents"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label="Follow Think on X"
              >
                <XIcon className="h-5 w-5" />
              </a>
              <a
                href="https://github.com/think-labs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                aria-label="View Think on GitHub"
              >
                <Github className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links columns */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">Marketplace</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">For Builders</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.builders.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Think Protocol</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.think.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-xs text-muted-foreground text-center">
            &copy; {new Date().getFullYear()} Think Protocol. Built by the community, for the community.
          </p>
        </div>
      </div>
    </footer>
  );
}
