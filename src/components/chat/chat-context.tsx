"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

export type Msg = { id: string; role: "user" | "assistant"; content: string };
type Status = "idle" | "streaming" | "error";

type ChatCtx = {
  messages: Msg[];
  status: Status;
  error: string | null;
  send: (text: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
  /** Whether the floating chat panel is open. */
  open: boolean;
  setOpen: (open: boolean | ((o: boolean) => boolean)) => void;
};

const Ctx = createContext<ChatCtx | null>(null);
const uid = () => Math.random().toString(36).slice(2);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const history = useRef<Msg[]>([]);

  const commit = (next: Msg[]) => {
    history.current = next;
    setMessages(next);
  };

  const send = useCallback(async (text: string) => {
    const content = text.trim().slice(0, 800);
    if (!content || abort.current) return;

    const user: Msg = { id: uid(), role: "user", content };
    const bot: Msg = { id: uid(), role: "assistant", content: "" };
    const convo = [...history.current, user];
    commit([...convo, bot]);
    setStatus("streaming");
    setError(null);

    const ctrl = new AbortController();
    abort.current = ctrl;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: convo.map(({ role, content }) => ({ role, content })) }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        commit([...convo, { ...bot, content: acc }]);
      }
      setStatus("idle");
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setStatus("idle");
      } else {
        // drop the empty bot bubble and show the error
        const last = history.current[history.current.length - 1];
        if (last?.role === "assistant" && !last.content) commit(history.current.slice(0, -1));
        setError((e as Error).message);
        setStatus("error");
      }
    } finally {
      abort.current = null;
    }
  }, []);

  const stop = useCallback(() => abort.current?.abort(), []);
  const reset = useCallback(() => {
    abort.current?.abort();
    commit([]);
    setError(null);
    setStatus("idle");
  }, []);

  return <Ctx.Provider value={{ messages, status, error, send, stop, reset, open, setOpen }}>{children}</Ctx.Provider>;
}

export function useChat() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useChat must be used inside <ChatProvider>");
  return ctx;
}
