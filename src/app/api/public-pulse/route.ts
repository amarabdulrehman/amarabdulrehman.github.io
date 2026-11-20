/**
 * Anonymous production heartbeat for the ToffeeOS card.
 *
 * If TOFFEEOS_PULSE_URL is set (an aggregate-only endpoint on ToffeeOS, no tenant or
 * customer data), its JSON is validated and passed through. Otherwise a static payload
 * built from the site's verified numbers is returned with `source: "static"`, so the
 * UI never shows a broken state and never presents static numbers as live telemetry.
 */

import { connection, NextResponse } from "next/server";
import { STATIC_PULSE, type Pulse } from "@/lib/pulse";

const STATUSES = new Set(["operational", "degraded", "down"]);

function parse(x: unknown): Pulse | null {
  if (!x || typeof x !== "object") return null;
  const o = x as Record<string, unknown>;
  const status = typeof o.status === "string" && STATUSES.has(o.status) ? (o.status as Pulse["status"]) : null;
  const orders = typeof o.dailyOrders === "number" && o.dailyOrders >= 0 ? o.dailyOrders : null;
  const failed = typeof o.failedSyncs === "number" && o.failedSyncs >= 0 ? Math.round(o.failedSyncs) : null;
  if (!status || orders === null) return null;
  return {
    source: "live",
    label: STATIC_PULSE.label,
    status,
    dailyOrders: orders.toLocaleString("en-US"),
    failedSyncs: failed,
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
  };
}

export async function GET() {
  const url = process.env.TOFFEEOS_PULSE_URL;
  if (url) {
    // read live at request time (the CDN caches it for 60s via Cache-Control below)
    await connection();
    try {
      const res = await fetch(url, {
        headers: process.env.TOFFEEOS_PULSE_TOKEN ? { Authorization: `Bearer ${process.env.TOFFEEOS_PULSE_TOKEN}` } : undefined,
        cache: "no-store",
        signal: AbortSignal.timeout(2500),
      });
      if (res.ok) {
        const live = parse(await res.json());
        if (live) return NextResponse.json(live, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } });
      }
    } catch (e) {
      console.warn("[pulse] falling back to static:", (e as Error).message);
    }
  }
  return NextResponse.json(STATIC_PULSE, { headers: { "Cache-Control": "public, s-maxage=300" } });
}
