import Link from "next/link";
import { ArrowRight, Bot, Wrench, AppWindow, Users } from "lucide-react";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "About",
  description: "Learn about Think Marketplace and the Think Agent Standard",
};

export default function AboutPage() {
  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
            About Think Marketplace
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The official showcase for projects and builders in the Think
            ecosystem.
          </p>
        </div>

        {/* What is Think Marketplace */}
        <section className="mb-16">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-6">
            What is Think Marketplace?
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground">
              Think Marketplace is a curated directory of apps, tools, and
              autonomous agents built on the{" "}
              <a
                href="https://docs.thinkagents.ai/whitepaper/think-agent-standard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Think Agent Standard
              </a>
              . It&apos;s a window into what&apos;s possible when AI is
              something you own, not rent.
            </p>
            <p className="text-muted-foreground">
              Here you&apos;ll find autonomous agents, developer tools,
              interfaces, and applications, all built on the open protocol for
              user-owned AI.
            </p>
          </div>
        </section>

        {/* Types */}
        <section className="mb-16">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-6">
            What&apos;s Listed?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 mb-4">
                  <Bot className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-body text-lg font-semibold text-foreground mb-2">
                  Agents
                </h3>
                <p className="text-sm text-muted-foreground">
                  Autonomous AI entities built on the Think Agent Standard with
                  Soul, Mind, and Body components.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 mb-4">
                  <Wrench className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-body text-lg font-semibold text-foreground mb-2">
                  Tools
                </h3>
                <p className="text-sm text-muted-foreground">
                  Modules that agents use to get things done. Calculate, fetch,
                  send, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 mb-4">
                  <AppWindow className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-body text-lg font-semibold text-foreground mb-2">
                  Apps
                </h3>
                <p className="text-sm text-muted-foreground">
                  Full applications built on Think. Productivity suites,
                  creative tools, and more.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Think Fit */}
        <section className="mb-16">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-6">
            The Think Agent Standard
          </h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
            <p className="text-muted-foreground">
              Each listing shows its &quot;Think Fit,&quot; which tells you how
              it aligns with the three components of the Think Agent Standard:
            </p>
          </div>
          <div className="grid gap-4">
            <div className="rounded-lg border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground mb-1">
                Soul: Identity & Ownership
              </h3>
              <p className="text-sm text-muted-foreground">
                The cryptographic identity and wallet that anchors trust,
                authorship, and transaction rights. A valid NFI (Non-Fungible
                Intelligence) on-chain.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground mb-1">
                Mind: Reasoning & Coordination
              </h3>
              <p className="text-sm text-muted-foreground">
                The logic and memory that make it intelligent. Holds context,
                decision logic, and determines which tools to call.
              </p>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card">
              <h3 className="font-semibold text-foreground mb-1">
                Body: Interface & Expression
              </h3>
              <p className="text-sm text-muted-foreground">
                How the agent interacts with you and the world. The user
                interface that connects it to various surfaces and platforms.
              </p>
            </div>
          </div>
        </section>

        {/* Guidelines */}
        <section id="guidelines" className="mb-16 scroll-mt-20">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-6">
            <Users className="inline-block mr-2 h-6 w-6 text-primary" aria-hidden="true" />
            Contributor Guidelines
          </h2>
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground mb-3">
                This is a contributor-only showcase.
              </h3>
              <p className="text-muted-foreground mb-4">
                To be featured, you need a working project, not just an idea or
                concept. This keeps the directory credible and helps visitors
                find real, usable tools.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                <strong>What counts as a contribution:</strong>
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Ship a project:</strong> An agent, tool, or app
                    that&apos;s live and usable (even if in beta)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Build infrastructure:</strong> Components, APIs, or
                    integrations others can use
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Design systems:</strong> UX flows, wireframes, or UI
                    kits for the ecosystem
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Create content:</strong> Documentation, tutorials,
                    or guides that help others build
                  </span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground border-t border-border/50 pt-4">
                <strong>Note:</strong> &quot;Working&quot; doesn&apos;t mean
                perfect. Beta projects, MVPs, and experiments are all welcome as
                long as someone can actually try them.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* How to Get Started */}
        <section id="get-started" className="mb-16 scroll-mt-20">
          <h2 className="font-body text-2xl font-semibold text-foreground mb-6">
            How to Get Started
          </h2>
          <div className="grid gap-4">
            <div className="rounded-lg border border-border p-4 bg-card">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  1
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Learn the basics
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Read the{" "}
                    <a
                      href="https://docs.thinkagents.ai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Think documentation
                    </a>{" "}
                    to understand the Agent Standard and how Soul, Mind, and
                    Body work together.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  2
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Join the community
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect with other builders in the{" "}
                    <a
                      href="https://discord.gg/thinkagents"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Think Discord
                    </a>
                    . Ask questions, share ideas, and find collaborators.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  3
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Build something
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start small. A simple tool, an agent experiment, or even
                    documentation improvements. Every contribution counts.
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4 bg-card">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  4
                </span>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Submit your project
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Once you have something working,{" "}
                    <Link href="/submit" className="text-primary hover:underline">
                      submit it to the directory
                    </Link>
                    . Our team will review it and help you get featured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center pt-8">
          <h2 className="font-heading text-4xl tracking-tight text-foreground sm:text-5xl mb-6">
            Ready to share your project?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Submit your app, tool, or agent to the Think Marketplace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/submit">
                Submit a Listing
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://docs.thinkagents.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the Docs
              </a>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
