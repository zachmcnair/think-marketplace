import { Metadata } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://marketplace.thinkagents.ai'

export const metadata: Metadata = {
  title: "Browse Directory",
  description: "Explore the complete directory of AI agents, tools, and apps built on the Think Protocol. Filter by type, status, and category to find the perfect solution.",
  openGraph: {
    title: "Browse Directory | Think Marketplace",
    description: "Explore the complete directory of AI agents, tools, and apps built on the Think Protocol.",
    url: `${BASE_URL}/browse`,
    type: "website",
  },
  twitter: {
    title: "Browse Directory | Think Marketplace",
    description: "Explore the complete directory of AI agents, tools, and apps built on the Think Protocol.",
  },
  alternates: {
    canonical: `${BASE_URL}/browse`,
  },
}

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
