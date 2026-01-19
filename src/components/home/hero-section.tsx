"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BackgroundGrid } from "@/components/ui/background-grid";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background selection:bg-primary/20">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0">
        <BackgroundGrid
          className="[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-20"
        />
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px] opacity-50" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 ring-1 ring-inset ring-primary/20">
              The Think Protocol Ecosystem
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            className="font-heading text-5xl tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance font-normal"
          >
            Discover User-Owned AI
            <br />
            Built on <span className="text-primary relative inline-block">
              Think
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-primary opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed"
          >
            Explore a universe of agents, tools, and apps where you control your identity, memory, and data. The future of AI is decentralized.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" asChild>
              <Link href="/browse">
                Browse the Directory
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all" asChild>
              <Link href="/submit">Submit Your Project</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
