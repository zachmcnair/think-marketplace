"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

export function ShareButton({ title, text, url: propUrl }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = propUrl ?? (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-xl border-border/50 hover:bg-muted transition-all"
          title="Share"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xl w-48">
        {typeof navigator !== "undefined" && !!navigator.share && (
          <DropdownMenuItem onClick={handleShare} className="rounded-lg cursor-pointer">
            <Share2 className="mr-2 h-4 w-4" />
            <span>Share via...</span>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleCopy} className="rounded-lg cursor-pointer">
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy Link</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
