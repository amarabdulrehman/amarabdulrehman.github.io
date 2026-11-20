"use client";

import Link from "next/link";
import { Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatOptional } from "./chat/chat-context";

/** Opens the Role-Fit Matcher; outside the home page it links there with ?match=1. */
export function TestFitButton({ className, label = "Test role fit" }: { className?: string; label?: string }) {
  const chat = useChatOptional();
  const inner = (
    <>
      <Target className="size-3.5" /> {label}
    </>
  );
  const cls = cn("inline-flex items-center gap-1.5", className);
  if (!chat) {
    return (
      <Link href="/?match=1" className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={() => chat.openFit()} className={cls}>
      {inner}
    </button>
  );
}
