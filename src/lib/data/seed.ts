/**
 * Seed Data for Think Marketplace
 * ================================
 * Demo data for development and POC.
 * In production, this comes from the Railway PostgreSQL database via Prisma.
 */

import { Listing, Builder, Category } from "@/types";

export const categories: Category[] = [
  {
    id: "cat-productivity",
    name: "Productivity",
    slug: "productivity",
    description: "Tools and apps to enhance your workflow",
    icon: "zap",
  },
  {
    id: "cat-media",
    name: "Media & Content",
    slug: "media",
    description: "Create, manage, and distribute content",
    icon: "image",
  },
  {
    id: "cat-trading",
    name: "Trading & Finance",
    slug: "trading",
    description: "DeFi, trading bots, and financial tools",
    icon: "trending-up",
  },
  {
    id: "cat-devtools",
    name: "Developer Tools",
    slug: "devtools",
    description: "Build faster with AI-powered dev tools",
    icon: "code",
  },
  {
    id: "cat-social",
    name: "Social & Community",
    slug: "social",
    description: "Community management and social tools",
    icon: "users",
  },
  {
    id: "cat-data",
    name: "Data & Analytics",
    slug: "data",
    description: "Extract insights from your data",
    icon: "bar-chart",
  },
];

export const builders: Builder[] = [
  {
    id: "builder-1",
    name: "Think Labs",
    slug: "think-labs",
    bio: "Core team building the foundation of user-owned AI. We're creating the infrastructure for a new generation of intelligent applications.",
    avatar_url: "/avatars/think-labs.svg",
    website: "https://thinkagents.ai",
    twitter: "thinkagents",
    github: "think-labs",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "builder-2",
    name: "Autonomous Studio",
    slug: "autonomous-studio",
    bio: "Building autonomous agents that work while you sleep. Focused on trading, research, and automation.",
    avatar_url: "/avatars/autonomous-studio.svg",
    website: "https://autonomous.studio",
    twitter: "autonomousstudio",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: "builder-3",
    name: "Neural Forge",
    slug: "neural-forge",
    bio: "Crafting AI tools for developers. Making machine learning accessible to every builder.",
    avatar_url: "/avatars/neural-forge.svg",
    website: "https://neuralforge.dev",
    github: "neural-forge",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-15T00:00:00Z",
  },
  {
    id: "builder-4",
    name: "DataMind Collective",
    slug: "datamind-collective",
    bio: "A collective of data scientists and AI researchers building the next generation of analytics tools.",
    avatar_url: "/avatars/datamind.svg",
    twitter: "datamindcollective",
    discord: "datamind",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-04-15T00:00:00Z",
  },
  {
    id: "builder-5",
    name: "Safeclip",
    slug: "safeclip",
    bio: "Building privacy-first tools for sensitive work. Your data stays yours.",
    website: "https://safeclip.app",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "builder-6",
    name: "Elysium",
    slug: "elysium",
    bio: "Creating intelligent agency tools that amplify human potential.",
    website: "https://elysium.ai",
    twitter: "elysiumai",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-05-15T00:00:00Z",
  },
  {
    id: "builder-7",
    name: "Clipper Labs",
    slug: "clipper-labs",
    bio: "Reimagining how you interact with your clipboard. Smart, fast, helpful.",
    website: "https://clipperlabs.io",
    twitter: "clipperlabs",
    created_at: "2024-03-15T00:00:00Z",
    updated_at: "2024-05-20T00:00:00Z",
  },
  {
    id: "builder-8",
    name: "Story First Labs",
    slug: "story-first-labs",
    bio: "Putting narrative at the heart of creation. Tools for storytellers, by storytellers.",
    website: "https://storyfirst.ai",
    twitter: "storyfirstlabs",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
];

export const listings: Listing[] = [
  {
    id: "listing-1",
    name: "ThinkOS",
    slug: "thinkos",
    type: "app",
    short_description: "The operating system for user-owned AI. Run, train, and own your intelligent agents locally.",
    long_description: `ThinkOS transforms your computer into a powerful AI runtime. It orchestrates multiple agents, runs models locally, and connects to decentralized inference networks when you need scale.

## Key Features
- **Local-first**: Your data stays on your machine
- **Multi-agent orchestration**: Run multiple agents in parallel
- **Model flexibility**: Use any compatible model
- **Network integration**: Connect to the Think Tree for shared intelligence

## Think Fit
ThinkOS is the reference implementation of the Think Agent Standard, providing the Mind runtime for your agents.`,
    status: "live",
    categories: ["cat-productivity", "cat-devtools"],
    tags: ["operating-system", "local-ai", "privacy", "agents"],
    links: {
      website: "https://thinkagents.ai/os",
      docs: "https://docs.thinkagents.ai",
      repo: "https://github.com/think-labs/thinkos",
    },
    media: [
      {
        id: "media-1",
        url: "/screenshots/thinkos-dashboard.png",
        alt: "ThinkOS Dashboard showing agent management interface",
        type: "image",
        order: 0,
      },
    ],
    icon_url: undefined,
    thumbnail_url: undefined, // Add thumbnail for featured display
    builder_id: "builder-1",
    think_fit: {
      soul: {
        has_wallet_auth: "yes",
        identity_anchor: "NFI token on Ethereum/ApeChain",
      },
      mind: {
        mind_runtime: "local",
        tooling: "Full Think Agent Standard toolset",
      },
      body: {
        interface_type: "desktop",
        surfaces: ["macos", "windows", "linux"],
      },
    },
    visibility: "featured",
    review_state: "approved",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "listing-2",
    name: "Safeclip",
    slug: "safeclip",
    type: "app",
    short_description: "Private Clipping and Transcription. Built for sensitive work. Clip, quote, and transcribe audio and video locally, keeping sensitive recordings in-house.",
    long_description: `Safeclip is built for sensitive work. Clip, quote, and transcribe audio and video locally, keeping sensitive recordings in-house.

## Key Features
- **Local transcription**: All processing happens on your device
- **Audio & video clipping**: Extract and quote from recordings
- **Privacy-first**: Sensitive content never leaves your machine
- **Searchable archives**: Find any clip or quote instantly

## Built for Sensitive Work
Perfect for legal, medical, journalism, and any work where confidentiality matters.`,
    status: "live",
    categories: ["cat-productivity", "cat-media"],
    tags: ["transcription", "privacy", "audio", "video", "clipping"],
    links: {
      website: "https://safeclip.app",
      docs: "https://docs.safeclip.app",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-5",
    think_fit: {
      soul: {
        has_wallet_auth: "planned",
        identity_anchor: "Think Agent integration coming soon",
      },
      mind: {
        mind_runtime: "local",
        tooling: "Local transcription, audio/video processing",
      },
      body: {
        interface_type: "desktop",
        surfaces: ["macos", "windows"],
      },
    },
    visibility: "featured",
    review_state: "approved",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-05-15T00:00:00Z",
  },
  {
    id: "listing-3",
    name: "Code Companion",
    slug: "code-companion",
    type: "tool",
    short_description: "AI-powered code review and refactoring tool that integrates with your development workflow.",
    long_description: `Code Companion is a deterministic code analysis tool that integrates with your IDE and CI/CD pipeline. It provides instant feedback on code quality, suggests refactoring opportunities, and catches bugs before they reach production.

## Features
- **Real-time analysis**: Get feedback as you type
- **Multi-language support**: Works with 20+ programming languages
- **CI/CD integration**: Automated checks on every pull request
- **Custom rules**: Define your team's coding standards

Unlike agents, Code Companion is a deterministic tool. Same input always produces the same output.`,
    status: "live",
    categories: ["cat-devtools"],
    tags: ["code-review", "refactoring", "developer-tools", "ci-cd"],
    links: {
      website: "https://neuralforge.dev/code-companion",
      docs: "https://docs.neuralforge.dev/code-companion",
      repo: "https://github.com/neural-forge/code-companion",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-3",
    think_fit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "AST parsing, linting, static analysis",
      },
      body: {
        interface_type: "extension",
        surfaces: ["vscode", "jetbrains", "github"],
      },
    },
    visibility: "public",
    review_state: "approved",
    created_at: "2024-04-01T00:00:00Z",
    updated_at: "2024-05-01T00:00:00Z",
  },
  {
    id: "listing-4",
    name: "Research Agent",
    slug: "research-agent",
    type: "agent",
    short_description: "Autonomous research assistant that gathers, synthesizes, and presents information on any topic.",
    long_description: `Research Agent is your tireless research assistant. Give it a topic, and it will scour the web, academic papers, and databases to compile comprehensive research reports.

## Capabilities
- Web search and content extraction
- Academic paper analysis
- Data visualization
- Citation management
- Multi-source synthesis

Perfect for market research, competitive analysis, academic work, or satisfying your curiosity.`,
    status: "live",
    categories: ["cat-productivity", "cat-data"],
    tags: ["research", "automation", "knowledge", "analysis"],
    links: {
      website: "https://datamind.co/research-agent",
      demo: "https://demo.datamind.co/research",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-4",
    think_fit: {
      soul: {
        has_wallet_auth: "planned",
        identity_anchor: "Coming with Think integration",
      },
      mind: {
        mind_runtime: "server",
        tooling: "Web scraping, NLP, summarization, citation tools",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser", "slack", "notion"],
      },
    },
    visibility: "public",
    review_state: "approved",
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "listing-5",
    name: "Social Sentinel",
    slug: "social-sentinel",
    type: "agent",
    short_description: "Monitor your brand across social platforms with AI-powered sentiment analysis and alerts.",
    long_description: `Social Sentinel keeps watch over your brand's presence across social media. It monitors mentions, analyzes sentiment, identifies trends, and alerts you to potential PR issues before they escalate.

## What It Does
- Real-time mention monitoring across platforms
- Sentiment analysis with context understanding
- Trend identification and reporting
- Automated responses for common queries
- Crisis detection and alerting`,
    status: "beta",
    categories: ["cat-social", "cat-data"],
    tags: ["social-media", "monitoring", "sentiment", "brand"],
    links: {
      website: "https://datamind.co/social-sentinel",
      waitlist: "https://datamind.co/social-sentinel/waitlist",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-4",
    think_fit: {
      mind: {
        mind_runtime: "server",
        tooling: "Social APIs, sentiment analysis, alerting",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser", "slack", "discord"],
      },
    },
    visibility: "public",
    review_state: "approved",
    created_at: "2024-05-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "listing-6",
    name: "Content Studio",
    slug: "content-studio",
    type: "app",
    short_description: "All-in-one content creation suite with AI writing, image generation, and publishing tools.",
    long_description: `Content Studio is your complete content creation toolkit. Write blog posts, generate images, create social media content, and publish across platforms, all from one interface.

## Included Tools
- AI writing assistant with multiple styles
- Image generation and editing
- Social media scheduler
- SEO optimization
- Analytics dashboard`,
    status: "concept",
    categories: ["cat-media", "cat-productivity"],
    tags: ["content", "writing", "images", "marketing"],
    links: {
      waitlist: "https://autonomous.studio/content-studio/waitlist",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-2",
    think_fit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "LLM writing, image generation, scheduling APIs",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser"],
      },
    },
    visibility: "public",
    review_state: "approved",
    created_at: "2024-06-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "listing-7",
    name: "Agency App",
    slug: "agency-app",
    type: "app",
    short_description: "Intelligent agency tools that amplify human potential. Manage, coordinate, and scale your operations with AI assistance.",
    long_description: `Agency App is your intelligent operations hub. Coordinate teams, manage projects, and scale your agency with AI-powered assistance.

## Key Features
- **Smart coordination**: AI helps manage tasks and deadlines
- **Team amplification**: Tools that make your team more effective
- **Scalable operations**: Grow without growing pains
- **Integrated workflows**: Connect your favorite tools

## Built for Agencies
Whether you're a creative studio, consulting firm, or service provider, Agency App adapts to your workflow.`,
    status: "live",
    categories: ["cat-productivity"],
    tags: ["agency", "management", "coordination", "teams"],
    links: {
      website: "https://elysium.ai/agency",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-6",
    think_fit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "Task management, scheduling, team coordination",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser", "slack"],
      },
    },
    visibility: "featured",
    review_state: "approved",
    created_at: "2024-04-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "listing-8",
    name: "Clippy",
    slug: "clippy",
    type: "app",
    short_description: "Your smart clipboard assistant. Copy smarter, paste faster, and never lose a snippet again.",
    long_description: `Clippy reimagines your clipboard as an intelligent assistant. It learns what you copy, organizes it automatically, and helps you paste exactly what you need.

## Key Features
- **Smart history**: Unlimited clipboard history with intelligent search
- **Auto-organization**: AI categorizes your clips automatically
- **Quick paste**: Keyboard shortcuts for your frequent clips
- **Cross-device sync**: Your clips follow you everywhere

## Work Smarter
Stop losing valuable snippets. Clippy remembers everything so you don't have to.`,
    status: "live",
    categories: ["cat-productivity"],
    tags: ["clipboard", "productivity", "snippets", "assistant"],
    links: {
      website: "https://clipperlabs.io/clippy",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-7",
    think_fit: {
      mind: {
        mind_runtime: "local",
        tooling: "Clipboard management, text processing, sync",
      },
      body: {
        interface_type: "desktop",
        surfaces: ["macos", "windows", "linux"],
      },
    },
    visibility: "featured",
    review_state: "approved",
    created_at: "2024-05-01T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
  {
    id: "listing-9",
    name: "Story First",
    slug: "story-first",
    type: "app",
    short_description: "Narrative-driven creation tools. Put your story at the center and let AI help you tell it beautifully.",
    long_description: `Story First puts narrative at the heart of creation. Whether you're writing a novel, crafting a brand story, or building a presentation, Story First helps you tell it beautifully.

## Key Features
- **Narrative structure**: AI helps you build compelling story arcs
- **Character development**: Tools for creating memorable characters
- **Visual storytelling**: Generate images that match your narrative
- **Multi-format export**: From documents to presentations to video scripts

## For Storytellers
Writers, marketers, educators, and creators. Story First adapts to your creative process.`,
    status: "live",
    categories: ["cat-media", "cat-productivity"],
    tags: ["storytelling", "writing", "narrative", "creative"],
    links: {
      website: "https://storyfirst.ai",
    },
    media: [],
    icon_url: undefined,
    thumbnail_url: undefined,
    builder_id: "builder-8",
    think_fit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "LLM writing, narrative structure, image generation",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser"],
      },
    },
    visibility: "featured",
    review_state: "approved",
    created_at: "2024-05-15T00:00:00Z",
    updated_at: "2024-06-01T00:00:00Z",
  },
];

// Helper function to get listing with builder populated
export function getListingWithBuilder(listing: Listing): Listing {
  const builder = builders.find((b) => b.id === listing.builder_id);
  return { ...listing, builder };
}

// Helper to get all listings with builders
export function getAllListingsWithBuilders(): Listing[] {
  return listings.map(getListingWithBuilder);
}

// Helper to get featured listings
export function getFeaturedListings(): Listing[] {
  return listings
    .filter((l) => l.visibility === "featured" && l.review_state === "approved")
    .map(getListingWithBuilder);
}

// Helper to get listings by type
export function getListingsByType(type: Listing["type"]): Listing[] {
  return listings
    .filter((l) => l.type === type && l.review_state === "approved")
    .map(getListingWithBuilder);
}

// Helper to get listings by builder
export function getListingsByBuilder(builderId: string): Listing[] {
  return listings
    .filter((l) => l.builder_id === builderId && l.review_state === "approved")
    .map(getListingWithBuilder);
}

// Helper to search listings
export function searchListings(query: string): Listing[] {
  const lowerQuery = query.toLowerCase();
  return listings
    .filter(
      (l) =>
        l.review_state === "approved" &&
        (l.name.toLowerCase().includes(lowerQuery) ||
          l.short_description.toLowerCase().includes(lowerQuery) ||
          l.tags.some((t) => t.toLowerCase().includes(lowerQuery)))
    )
    .map(getListingWithBuilder);
}

// Helper to get builder by slug
export function getBuilderBySlug(slug: string): Builder | undefined {
  return builders.find((b) => b.slug === slug);
}

// Helper to get listing by slug
export function getListingBySlug(slug: string): Listing | undefined {
  const listing = listings.find((l) => l.slug === slug);
  return listing ? getListingWithBuilder(listing) : undefined;
}
