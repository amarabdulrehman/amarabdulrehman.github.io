/** Shape of /api/public-pulse, shared by the route and the ToffeeOS status bar. */

export type Pulse = {
  source: "live" | "static";
  label: string;
  status: "operational" | "degraded" | "down" | "in-production";
  dailyOrders: string;
  failedSyncs: number | null;
  updatedAt: string | null;
};

export const STATIC_PULSE: Pulse = {
  source: "static",
  label: "SPILL & Loom POS",
  status: "in-production",
  dailyOrders: "200+",
  failedSyncs: null,
  updatedAt: null,
};
