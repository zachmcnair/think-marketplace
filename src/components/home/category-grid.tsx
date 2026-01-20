"use client";

import Link from "next/link";
import { Bot, Wrench, AppWindow } from "lucide-react";
import { SpotlightCard } from "@/components/ui/spotlight-card";

interface CategoryGridProps {
  counts: {
    agents: number;
    tools: number;
    apps: number;
  };
}

export function CategoryGrid({ counts }: CategoryGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {/* Agents */}
      <Link
        href="/browse?type=agent"
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      >
        <SpotlightCard className="h-full hover:border-purple-500/50 transition-colors" spotlightColor="rgba(168, 85, 247, 0.25)">
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 ring-1 ring-purple-500/20">
                <Bot className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Agents
                </h3>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {counts.agents} listings
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed flex-grow">
              Autonomous AI with Soul, Mind, and Body. The core of the Think Agent Standard.
            </p>
          </div>
        </SpotlightCard>
      </Link>

      {/* Tools */}
      <Link
        href="/browse?type=tool"
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      >
        <SpotlightCard className="h-full hover:border-blue-500/50 transition-colors" spotlightColor="rgba(59, 130, 246, 0.25)">
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 ring-1 ring-blue-500/20">
                <Wrench className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Tools
                </h3>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {counts.tools} listings
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed flex-grow">
              Modules that agents use to get things done. Calculate, fetch, send, and more.
            </p>
          </div>
        </SpotlightCard>
      </Link>

      {/* Apps */}
      <Link
        href="/browse?type=app"
        className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl"
      >
        <SpotlightCard className="h-full hover:border-green-500/50 transition-colors" spotlightColor="rgba(34, 197, 94, 0.25)">
          <div className="p-8 h-full flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-500/20">
                <AppWindow className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-2xl font-medium text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Apps
                </h3>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {counts.apps} listings
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed flex-grow">
              Full applications built on Think. Productivity tools, creative suites, and more.
            </p>
          </div>
        </SpotlightCard>
      </Link>
    </div>
  );
}
