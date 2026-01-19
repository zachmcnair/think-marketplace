"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle, AlertCircle, Lock } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NftGate } from "@/components/auth/nft-gate";
import type { ListingType, ListingStatus, Category } from "@/types";

interface FormData {
  name: string;
  type: ListingType | "";
  short_description: string;
  long_description: string;
  status: ListingStatus | "";
  category: string;
  tags: string;
  website: string;
  demo: string;
  docs: string;
  repo: string;
  builder_name: string;
  builder_email: string;
  builder_twitter: string;
}

const initialFormData: FormData = {
  name: "",
  type: "",
  short_description: "",
  long_description: "",
  status: "",
  category: "",
  tags: "",
  website: "",
  demo: "",
  docs: "",
  repo: "",
  builder_name: "",
  builder_email: "",
  builder_twitter: "",
};

function SubmitForm() {
  const { getAccessToken, user } = usePrivy();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories from API
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    }
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!formData.name || !formData.type || !formData.short_description) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    if (formData.short_description.length > 300) {
      setError("Short description must be 300 characters or less.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.builder_name || !formData.builder_email) {
      setError("Builder name and email are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Get auth token
      const token = await getAccessToken();
      if (!token) {
        setError("Authentication required. Please connect your wallet.");
        setIsSubmitting(false);
        return;
      }

      // Submit to API
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          walletAddress: user?.wallet?.address,
          name: formData.name,
          type: formData.type,
          shortDescription: formData.short_description,
          longDescription: formData.long_description || null,
          status: formData.status || "concept",
          categories: formData.category ? [formData.category] : [],
          tags: formData.tags
            ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
            : [],
          links: {
            website: formData.website || null,
            demo: formData.demo || null,
            docs: formData.docs || null,
            repo: formData.repo || null,
          },
          builderName: formData.builder_name,
          builderEmail: formData.builder_email,
          builderTwitter: formData.builder_twitter?.replace("@", "") || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Submission failed");
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <CheckCircle
              className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <h1 className="font-body text-3xl font-semibold text-foreground mb-4">
            Submission Received!
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Thanks for submitting <strong>{formData.name}</strong>. We&apos;ll
            review your listing and get back to you soon.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild>
              <Link href="/browse">Browse Directory</Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFormData(initialFormData);
                setIsSubmitted(false);
              }}
            >
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-body text-3xl font-semibold text-foreground mb-2">
          Submit a Listing
        </h1>
        <p className="text-muted-foreground">
          Share your app, tool, or agent with the Think community. All
          submissions are reviewed before being published.
        </p>
      </div>

      {/* Contributor notice */}
      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardContent className="p-4">
          <p className="text-sm text-foreground">
            <strong>Contributor-only showcase:</strong> To be featured in v1,
            you must contribute something concrete to the Think ecosystem.
            This can be code, design, content, or documentation.{" "}
            <Link href="/about#guidelines" className="text-primary hover:underline">
              Learn more →
            </Link>
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="My Awesome Tool"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">
                  Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(v) => handleSelectChange("type", v)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">App</SelectItem>
                    <SelectItem value="tool">Tool</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="short_description">
                Short Description <span className="text-destructive">*</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  ({formData.short_description.length}/300)
                </span>
              </Label>
              <Input
                id="short_description"
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="A brief pitch for your listing"
                maxLength={300}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long_description">Full Description</Label>
              <Textarea
                id="long_description"
                name="long_description"
                value={formData.long_description}
                onChange={handleChange}
                placeholder="Describe what your listing does, key features, and how it fits with Think..."
                rows={6}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleSelectChange("status", v)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="beta">Beta</SelectItem>
                    <SelectItem value="concept">Concept</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => handleSelectChange("category", v)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.slug}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="ai, productivity, automation (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Separate tags with commas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demo">Demo URL</Label>
                <Input
                  id="demo"
                  name="demo"
                  type="url"
                  value={formData.demo}
                  onChange={handleChange}
                  placeholder="https://demo.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="docs">Documentation</Label>
                <Input
                  id="docs"
                  name="docs"
                  type="url"
                  value={formData.docs}
                  onChange={handleChange}
                  placeholder="https://docs.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo">Repository</Label>
                <Input
                  id="repo"
                  name="repo"
                  type="url"
                  value={formData.repo}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Builder Info */}
        <Card>
          <CardHeader>
            <CardTitle>Builder Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="builder_name">
                  Name / Studio <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="builder_name"
                  name="builder_name"
                  value={formData.builder_name}
                  onChange={handleChange}
                  placeholder="Your name or studio name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="builder_email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="builder_email"
                  name="builder_email"
                  type="email"
                  value={formData.builder_email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="builder_twitter">Twitter / X Handle</Label>
                <Input
                  id="builder_twitter"
                  name="builder_twitter"
                  value={formData.builder_twitter}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/">Cancel</Link>
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function NftRequiredMessage() {
  const { login, authenticated } = usePrivy();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Lock
            className="h-8 w-8 text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          />
        </div>
        <h1 className="font-body text-3xl font-semibold text-foreground mb-4">
          NFT Required
        </h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
          Submitting listings is exclusive to Think NFT holders. Connect your
          wallet to verify your NFT ownership.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!authenticated ? (
            <Button onClick={login}>Connect Wallet</Button>
          ) : (
            <Button variant="outline" asChild>
              <Link href="/browse">Browse Directory</Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <a
              href="https://opensea.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Get NFT
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Layout>
      <NftGate fallback={<NftRequiredMessage />}>
        <SubmitForm />
      </NftGate>
    </Layout>
  );
}
