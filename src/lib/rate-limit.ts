/**
 * Per-visitor rate limiting shared by every serverless instance.
 *
 * With Upstash Redis configured (UPSTASH_REDIS_REST_URL/TOKEN, or the KV_REST_API_URL/TOKEN
 * names the Vercel Marketplace integration sets), counts live in Redis, so a limit holds
 * across instances and cold starts. Without it, each instance keeps its own in-memory
 * count: weaker, but the routes still work in local dev and if Redis is ever removed.
 * If Redis errors at request time we fail open to the in-memory count rather than block
 * real visitors.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type Limit = { name: string; limit: number; windowSeconds: number };

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = url && token ? new Redis({ url, token }) : null;

const limiters = new Map<string, Ratelimit>();
const memory = new Map<string, number[]>();

function memoryLimited({ name, limit, windowSeconds }: Limit, id: string) {
  const key = `${name}:${id}`;
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter((t) => now - t < windowSeconds * 1000);
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > 5000) memory.clear();
  return recent.length > limit;
}

/** True when this visitor has gone over the limit and the request should get a 429. */
export async function rateLimited(cfg: Limit, id: string): Promise<boolean> {
  if (!redis) return memoryLimited(cfg, id);
  let rl = limiters.get(cfg.name);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(cfg.limit, `${cfg.windowSeconds} s`),
      prefix: `rl:${cfg.name}`,
      analytics: false,
    });
    limiters.set(cfg.name, rl);
  }
  try {
    const { success } = await rl.limit(id);
    return !success;
  } catch (e) {
    console.warn(`[rate-limit] redis unavailable, using in-memory count:`, (e as Error).message);
    return memoryLimited(cfg, id);
  }
}

/** The visitor's IP as Vercel reports it. */
export function clientIp(req: Request) {
  return req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export const CHAT_LIMIT: Limit = { name: "chat", limit: 20, windowSeconds: 10 * 60 };
export const LEAD_LIMIT: Limit = { name: "lead", limit: 3, windowSeconds: 60 * 60 };
