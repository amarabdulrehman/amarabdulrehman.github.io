"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/lib/content";
import { cn } from "@/lib/utils";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure contexts: fall back to a hidden textarea.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

/** One-click copy of Amar's email, with a "Copied to clipboard" confirmation. */
export function useCopyEmail() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);
  const copy = async () => {
    if (!(await copyText(profile.email))) return;
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2200);
  };
  return { copied, copy };
}

/** Primary pill: shows the address itself, so it's useful even before clicking. */
export function CopyEmailButton({ className }: { className?: string }) {
  const { copied, copy } = useCopyEmail();
  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email copied to clipboard" : `Copy email address ${profile.email}`}
        className={cn("btn-primary group min-w-0", className)}
      >
        <span className="truncate">{copied ? "Copied to clipboard" : profile.email}</span>
        <span className="btn-icon">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</span>
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? "Email address copied to clipboard" : ""}
      </span>
    </>
  );
}

/** Compact mono link-style button for the footer. */
export function CopyEmailInline({ className }: { className?: string }) {
  const { copied, copy } = useCopyEmail();
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Email copied to clipboard" : `Copy email address ${profile.email}`}
      className={cn("inline-flex items-center gap-1 uppercase tracking-[0.08em] hover:text-fg", className)}
    >
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
      <span aria-live="polite">{copied ? "Copied" : "Copy email"}</span>
    </button>
  );
}
