import { Metadata } from "next"
import { getBaseUrl } from "@/lib/utils"

const BASE_URL = getBaseUrl()

export const metadata: Metadata = {
  title: "Submit Your Project",
  description: "Submit your AI agent, tool, or app to the Think Marketplace. Get discovered by users and builders in the Think ecosystem.",
  openGraph: {
    title: "Submit Your Project | Think Marketplace",
    description: "Submit your AI agent, tool, or app to the Think Marketplace. Get discovered by users and builders in the Think ecosystem.",
    url: `${BASE_URL}/submit`,
    type: "website",
  },
  twitter: {
    title: "Submit Your Project | Think Marketplace",
    description: "Submit your AI agent, tool, or app to the Think Marketplace.",
  },
  alternates: {
    canonical: `${BASE_URL}/submit`,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function SubmitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
