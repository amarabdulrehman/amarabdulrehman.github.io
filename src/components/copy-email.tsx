"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {}
      }}
      className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[15px] text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg"
    >
      {email}
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
      <span className="sr-only" aria-live="polite">{copied ? "Copied" : ""}</span>
    </button>
  );
}
