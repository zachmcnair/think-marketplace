import Link from "next/link";
import { Home, Search } from "lucide-react";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="mx-auto max-w-md px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <span className="font-heading text-8xl text-primary/20">
            404
          </span>
        </div>
        <h1 className="font-body text-2xl font-semibold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
          have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/browse">
              <Search className="mr-2 h-4 w-4" aria-hidden="true" />
              Browse Directory
            </Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
