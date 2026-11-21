/** Shape of /api/public-pulse, shared by the route and the ToffeeOS status bar. */

export type Pulse = {
  source: "live" | "static";
  label: string;
  status: "operational" | "degraded" | "down" | "in-production";
  /** Pre-formatted order figure, e.g. "42 orders/day (30-day avg)". */
  orders: string;
  failedSyncs: number | null;
  updatedAt: string | null;
};

export const STATIC_PULSE: Pulse = {
  source: "static",
  label: "SPILL & Loom POS",
  status: "in-production",
  orders: "~5,000 orders processed",
  failedSyncs: null,
  updatedAt: null,
};
