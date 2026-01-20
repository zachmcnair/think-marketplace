/**
 * Seed Script for Think Marketplace
 * Migrates demo data to Railway Postgres
 */

import { PrismaClient, ListingType, ListingStatus, ListingVisibility, ReviewState } from '@prisma/client'

const prisma = new PrismaClient()

// Categories seed data
const categories = [
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
]

// Builders seed data
const builders = [
  {
    id: "builder-1",
    name: "Think Labs",
    slug: "think-labs",
    bio: "Core team building the foundation of user-owned AI. We're creating the infrastructure for a new generation of intelligent applications.",
    avatarUrl: "/avatars/think-labs.svg",
    website: "https://thinkagents.ai",
    twitter: "thinkagents",
    github: "think-labs",
  },
  {
    id: "builder-2",
    name: "Autonomous Studio",
    slug: "autonomous-studio",
    bio: "Building autonomous agents that work while you sleep. Focused on trading, research, and automation.",
    avatarUrl: "/avatars/autonomous-studio.svg",
    website: "https://autonomous.studio",
    twitter: "autonomousstudio",
  },
  {
    id: "builder-3",
    name: "Neural Forge",
    slug: "neural-forge",
    bio: "Crafting AI tools for developers. Making machine learning accessible to every builder.",
    avatarUrl: "/avatars/neural-forge.svg",
    website: "https://neuralforge.dev",
    github: "neural-forge",
  },
  {
    id: "builder-4",
    name: "DataMind Collective",
    slug: "datamind-collective",
    bio: "A collective of data scientists and AI researchers building the next generation of analytics tools.",
    avatarUrl: "/avatars/datamind.svg",
    twitter: "datamindcollective",
    discord: "datamind",
  },
  {
    id: "builder-5",
    name: "Safeclip",
    slug: "safeclip",
    bio: "Building privacy-first tools for sensitive work. Your data stays yours.",
    website: "https://safeclip.app",
  },
  {
    id: "builder-6",
    name: "Elysium",
    slug: "elysium",
    bio: "Creating intelligent agency tools that amplify human potential.",
    website: "https://elysium.ai",
    twitter: "elysiumai",
  },
  {
    id: "builder-7",
    name: "Clipper Labs",
    slug: "clipper-labs",
    bio: "Reimagining how you interact with your clipboard. Smart, fast, helpful.",
    website: "https://clipperlabs.io",
    twitter: "clipperlabs",
  },
  {
    id: "builder-8",
    name: "Story First Labs",
    slug: "story-first-labs",
    bio: "Putting narrative at the heart of creation. Tools for storytellers, by storytellers.",
    website: "https://storyfirst.ai",
    twitter: "storyfirstlabs",
  },
]

// Listings seed data
const listings = [
  {
    id: "listing-1",
    name: "ThinkOS",
    slug: "thinkos",
    type: ListingType.app,
    shortDescription: "The operating system for user-owned AI. Run, train, and own your intelligent agents locally.",
    longDescription: `ThinkOS transforms your computer into a powerful AI runtime. It orchestrates multiple agents, runs models locally, and connects to decentralized inference networks when you need scale.

## Key Features
- **Local-first**: Your data stays on your machine
- **Multi-agent orchestration**: Run multiple agents in parallel
- **Model flexibility**: Use any compatible model
- **Network integration**: Connect to the Think Tree for shared intelligence

## Think Fit
ThinkOS is the reference implementation of the Think Agent Standard, providing the Mind runtime for your agents.`,
    status: ListingStatus.live,
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
    builderId: "builder-1",
    thinkFit: {
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
    visibility: ListingVisibility.featured,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-productivity", "cat-devtools"],
  },
  {
    id: "listing-2",
    name: "Safeclip",
    slug: "safeclip",
    type: ListingType.app,
    shortDescription: "Private Clipping and Transcription. Built for sensitive work. Clip, quote, and transcribe audio and video locally, keeping sensitive recordings in-house.",
    longDescription: `Safeclip is built for sensitive work. Clip, quote, and transcribe audio and video locally, keeping sensitive recordings in-house.

## Key Features
- **Local transcription**: All processing happens on your device
- **Audio & video clipping**: Extract and quote from recordings
- **Privacy-first**: Sensitive content never leaves your machine
- **Searchable archives**: Find any clip or quote instantly

## Built for Sensitive Work
Perfect for legal, medical, journalism, and any work where confidentiality matters.`,
    status: ListingStatus.live,
    tags: ["transcription", "privacy", "audio", "video", "clipping"],
    links: {
      website: "https://safeclip.app",
      docs: "https://docs.safeclip.app",
    },
    media: [],
    builderId: "builder-5",
    thinkFit: {
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
    visibility: ListingVisibility.featured,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-productivity", "cat-media"],
  },
  {
    id: "listing-3",
    name: "Code Companion",
    slug: "code-companion",
    type: ListingType.tool,
    shortDescription: "AI-powered code review and refactoring tool that integrates with your development workflow.",
    longDescription: `Code Companion is a deterministic code analysis tool that integrates with your IDE and CI/CD pipeline. It provides instant feedback on code quality, suggests refactoring opportunities, and catches bugs before they reach production.

## Features
- **Real-time analysis**: Get feedback as you type
- **Multi-language support**: Works with 20+ programming languages
- **CI/CD integration**: Automated checks on every pull request
- **Custom rules**: Define your team's coding standards

Unlike agents, Code Companion is a deterministic tool — same input always produces the same output.`,
    status: ListingStatus.live,
    tags: ["code-review", "refactoring", "developer-tools", "ci-cd"],
    links: {
      website: "https://neuralforge.dev/code-companion",
      docs: "https://docs.neuralforge.dev/code-companion",
      repo: "https://github.com/neural-forge/code-companion",
    },
    media: [],
    builderId: "builder-3",
    thinkFit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "AST parsing, linting, static analysis",
      },
      body: {
        interface_type: "extension",
        surfaces: ["vscode", "jetbrains", "github"],
      },
    },
    visibility: ListingVisibility.public,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-devtools"],
  },
  {
    id: "listing-4",
    name: "Research Agent",
    slug: "research-agent",
    type: ListingType.agent,
    shortDescription: "Autonomous research assistant that gathers, synthesizes, and presents information on any topic.",
    longDescription: `Research Agent is your tireless research assistant. Give it a topic, and it will scour the web, academic papers, and databases to compile comprehensive research reports.

## Capabilities
- Web search and content extraction
- Academic paper analysis
- Data visualization
- Citation management
- Multi-source synthesis

Perfect for market research, competitive analysis, academic work, or satisfying your curiosity.`,
    status: ListingStatus.live,
    tags: ["research", "automation", "knowledge", "analysis"],
    links: {
      website: "https://datamind.co/research-agent",
      demo: "https://demo.datamind.co/research",
    },
    media: [],
    builderId: "builder-4",
    thinkFit: {
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
    visibility: ListingVisibility.public,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-productivity", "cat-data"],
  },
  {
    id: "listing-5",
    name: "Social Sentinel",
    slug: "social-sentinel",
    type: ListingType.agent,
    shortDescription: "Monitor your brand across social platforms with AI-powered sentiment analysis and alerts.",
    longDescription: `Social Sentinel keeps watch over your brand's presence across social media. It monitors mentions, analyzes sentiment, identifies trends, and alerts you to potential PR issues before they escalate.

## What It Does
- Real-time mention monitoring across platforms
- Sentiment analysis with context understanding
- Trend identification and reporting
- Automated responses for common queries
- Crisis detection and alerting`,
    status: ListingStatus.beta,
    tags: ["social-media", "monitoring", "sentiment", "brand"],
    links: {
      website: "https://datamind.co/social-sentinel",
      waitlist: "https://datamind.co/social-sentinel/waitlist",
    },
    media: [],
    builderId: "builder-4",
    thinkFit: {
      mind: {
        mind_runtime: "server",
        tooling: "Social APIs, sentiment analysis, alerting",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser", "slack", "discord"],
      },
    },
    visibility: ListingVisibility.public,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-social", "cat-data"],
  },
  {
    id: "listing-6",
    name: "Content Studio",
    slug: "content-studio",
    type: ListingType.app,
    shortDescription: "All-in-one content creation suite with AI writing, image generation, and publishing tools.",
    longDescription: `Content Studio is your complete content creation toolkit. Write blog posts, generate images, create social media content, and publish across platforms — all from one interface.

## Included Tools
- AI writing assistant with multiple styles
- Image generation and editing
- Social media scheduler
- SEO optimization
- Analytics dashboard`,
    status: ListingStatus.concept,
    tags: ["content", "writing", "images", "marketing"],
    links: {
      waitlist: "https://autonomous.studio/content-studio/waitlist",
    },
    media: [],
    builderId: "builder-2",
    thinkFit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "LLM writing, image generation, scheduling APIs",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser"],
      },
    },
    visibility: ListingVisibility.public,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-media", "cat-productivity"],
  },
  {
    id: "listing-7",
    name: "Agency App",
    slug: "agency-app",
    type: ListingType.app,
    shortDescription: "Intelligent agency tools that amplify human potential. Manage, coordinate, and scale your operations with AI assistance.",
    longDescription: `Agency App is your intelligent operations hub. Coordinate teams, manage projects, and scale your agency with AI-powered assistance.

## Key Features
- **Smart coordination**: AI helps manage tasks and deadlines
- **Team amplification**: Tools that make your team more effective
- **Scalable operations**: Grow without growing pains
- **Integrated workflows**: Connect your favorite tools

## Built for Agencies
Whether you're a creative studio, consulting firm, or service provider, Agency App adapts to your workflow.`,
    status: ListingStatus.live,
    tags: ["agency", "management", "coordination", "teams"],
    links: {
      website: "https://elysium.ai/agency",
    },
    media: [],
    builderId: "builder-6",
    thinkFit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "Task management, scheduling, team coordination",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser", "slack"],
      },
    },
    visibility: ListingVisibility.featured,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-productivity"],
  },
  {
    id: "listing-8",
    name: "Clippy",
    slug: "clippy",
    type: ListingType.app,
    shortDescription: "Your smart clipboard assistant. Copy smarter, paste faster, and never lose a snippet again.",
    longDescription: `Clippy reimagines your clipboard as an intelligent assistant. It learns what you copy, organizes it automatically, and helps you paste exactly what you need.

## Key Features
- **Smart history**: Unlimited clipboard history with intelligent search
- **Auto-organization**: AI categorizes your clips automatically
- **Quick paste**: Keyboard shortcuts for your frequent clips
- **Cross-device sync**: Your clips follow you everywhere

## Work Smarter
Stop losing valuable snippets. Clippy remembers everything so you don't have to.`,
    status: ListingStatus.live,
    tags: ["clipboard", "productivity", "snippets", "assistant"],
    links: {
      website: "https://clipperlabs.io/clippy",
    },
    media: [],
    builderId: "builder-7",
    thinkFit: {
      mind: {
        mind_runtime: "local",
        tooling: "Clipboard management, text processing, sync",
      },
      body: {
        interface_type: "desktop",
        surfaces: ["macos", "windows", "linux"],
      },
    },
    visibility: ListingVisibility.featured,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-productivity"],
  },
  {
    id: "listing-9",
    name: "Story First",
    slug: "story-first",
    type: ListingType.app,
    shortDescription: "Narrative-driven creation tools. Put your story at the center and let AI help you tell it beautifully.",
    longDescription: `Story First puts narrative at the heart of creation. Whether you're writing a novel, crafting a brand story, or building a presentation, Story First helps you tell it beautifully.

## Key Features
- **Narrative structure**: AI helps you build compelling story arcs
- **Character development**: Tools for creating memorable characters
- **Visual storytelling**: Generate images that match your narrative
- **Multi-format export**: From documents to presentations to video scripts

## For Storytellers
Writers, marketers, educators, and creators — Story First adapts to your creative process.`,
    status: ListingStatus.live,
    tags: ["storytelling", "writing", "narrative", "creative"],
    links: {
      website: "https://storyfirst.ai",
    },
    media: [],
    builderId: "builder-8",
    thinkFit: {
      mind: {
        mind_runtime: "hybrid",
        tooling: "LLM writing, narrative structure, image generation",
      },
      body: {
        interface_type: "web",
        surfaces: ["browser"],
      },
    },
    visibility: ListingVisibility.featured,
    reviewState: ReviewState.approved,
    categoryIds: ["cat-media", "cat-productivity"],
  },
]

async function main() {
  console.log('🌱 Starting seed...')

  // Clear existing data
  console.log('🗑️  Clearing existing data...')
  await prisma.listingCategory.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.builder.deleteMany()
  await prisma.category.deleteMany()

  // Seed categories
  console.log('📁 Seeding categories...')
  for (const category of categories) {
    await prisma.category.create({
      data: category,
    })
  }
  console.log(`   ✓ Created ${categories.length} categories`)

  // Seed builders
  console.log('👷 Seeding builders...')
  for (const builder of builders) {
    await prisma.builder.create({
      data: builder,
    })
  }
  console.log(`   ✓ Created ${builders.length} builders`)

  // Seed listings with category relations
  console.log('📦 Seeding listings...')
  for (const listing of listings) {
    const { categoryIds, ...listingData } = listing

    await prisma.listing.create({
      data: {
        ...listingData,
        categories: {
          create: categoryIds.map(categoryId => ({
            categoryId,
          })),
        },
      },
    })
  }
  console.log(`   ✓ Created ${listings.length} listings`)

  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
