export type StationCapability = "send_collect" | "collect_only";

export type Station = {
  id: string;
  /** Numeric Agents.id for booking APIs (agentId / originAgentId). */
  agentId: string;
  source: "pickup" | "flagship" | "dropoff";
  town: string;
  businessName: string;
  address: string;
  county?: string;
  capability: StationCapability;
  coordinates?: string;
  distanceFromHQ?: number;
};

const PICKUP_API = "https://app.escrowcourier.com/website-backend-services/api/pickup-points";
const PICKUP_PROXY = "/pickup-points-api";
const PICKUP_FN = "/api/pickup-points";

const DROPOFF_API =
  "https://app.escrowcourier.com/user-services/api/agents/allowed-drop-off-points";
const DROPOFF_PROXY = "/dropoff-points-api";
const DROPOFF_FN = "/api/dropoff-points";

function asArray(data: unknown): any[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.agents)) return obj.agents;
  }
  return [];
}

async function fetchJson(sources: string[]): Promise<any[]> {
  for (const source of sources) {
    try {
      const res = await fetch(source, { headers: { Accept: "application/json" } });
      if (!res.ok) continue;
      const text = await res.text();
      let data: unknown;
      try {
        data = JSON.parse(text);
      } catch {
        continue;
      }
      const arr = asArray(data);
      if (arr.length) return arr;
    } catch {
      // try next
    }
  }
  return [];
}

function cleanText(value?: string | null): string {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function titleCaseTown(town: string): string {
  if (!town) return "Kenya";
  return town
    .toLowerCase()
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Reject stub / staff-style rows that are not public shop stations. */
function isListableShop(businessName: string, address: string): boolean {
  if (!businessName || !address) return false;
  if (/^(nairobi|kenya)$/i.test(address.trim())) return false;
  if (/^box\b|^p\.?\s*o\.?\s*box\b/i.test(address)) return false;
  // First-name-only labels (Deniss, Douglas, Joseph, David, etc.)
  if (/^[A-Za-z]{2,20}$/.test(businessName) && !/\s|&|ltd|limited|cyber|shop|mall|enterprises|ventures|centre|center|traders|gas|media|farm/i.test(businessName)) {
    return false;
  }
  return true;
}

function parseDistance(raw: any): number | undefined {
  const value =
    raw?.distanceFromHQ ?? raw?.distance_from_hq ?? raw?.distanceFromHq ?? raw?.distance;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function normalizePickupStation(raw: any): Station | null {
  if (!raw || raw.deletedAt) return null;
  if (raw.isPublic === false) return null;
  if (raw.isActive === false) return null;

  const town = cleanText(raw.town) || cleanText(raw.constituency) || "Kenya";
  const businessName = cleanText(raw.businessName);
  if (!businessName) return null;

  const address = cleanText(raw.fullDetailedAddress) || cleanText(raw.address);
  if (!address) return null;
  if (!isListableShop(businessName, address)) return null;

  const agentId = String(raw.id ?? raw.agentId ?? "").trim();
  if (!agentId) return null;

  return {
    id: `pickup-${agentId}-${town}`,
    agentId,
    source: "pickup",
    town: titleCaseTown(town),
    businessName,
    address,
    county: cleanText(raw.county) || undefined,
    capability: raw.is_booking_enabled ? "send_collect" : "collect_only",
    coordinates: cleanText(raw.coordinates) || undefined,
    distanceFromHQ: parseDistance(raw),
  };
}

/** App-style option label: town first, then shop. */
export function stationOptionLabel(station: Station): string {
  return `${station.town} — ${station.businessName}`;
}

/** Search haystack for town + shop + address + county. */
export function stationSearchHaystack(station: Station): string {
  return [station.town, station.businessName, station.address, station.county]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

/**
 * Rank matches so town / shop hits beat address-only hits
 * (e.g. “Kiambu Nairobi Road” should not outrank Nairobi CBD Offices).
 */
function stationSearchScore(station: Station, q: string): number {
  const town = station.town.toLowerCase();
  const shop = station.businessName.toLowerCase();
  const address = station.address.toLowerCase();
  const county = (station.county || "").toLowerCase();

  let score = 0;

  // Canonical Nairobi CBD Offices (agent 366) — always top among matches
  if (station.agentId === "366") score += 1000;

  if (town === q) score += 500;
  else if (town.startsWith(q)) score += 400;
  else if (town.includes(q)) score += 300;

  if (shop === q) score += 250;
  else if (shop.startsWith(q)) score += 200;
  else if (shop.includes(q)) score += 150;

  if (county.startsWith(q) || county.includes(q)) score += 40;

  // Address-only mention (highway names, etc.) — lowest priority
  if (address.includes(q)) score += 10;

  return score;
}

export function filterStations(stations: Station[], query: string): Station[] {
  const q = query.trim().toLowerCase();
  if (!q) return stations;
  return stations
    .map((s) => ({ s, score: stationSearchScore(s, q) }))
    .filter(({ score, s }) => score > 0 || stationSearchHaystack(s).includes(q))
    .sort((a, b) => b.score - a.score || a.s.town.localeCompare(b.s.town))
    .map(({ s }) => s);
}

export function findStationByAgentId(
  stations: Station[],
  agentId: string | number | null | undefined,
): Station | null {
  if (agentId == null || agentId === "") return null;
  const key = String(agentId);
  return stations.find((s) => s.agentId === key || s.id === key) || null;
}

/**
 * Public stations directory — Agents via pickup-points only.
 * Drop-off / Send & Collect = same list where is_booking_enabled is true.
 * Do not call booking-agents (those are CBD booking staff, not shops).
 */
export async function fetchPickupStations(): Promise<Station[]> {
  const sources = import.meta.env.DEV
    ? [PICKUP_PROXY, PICKUP_FN, PICKUP_API]
    : [PICKUP_FN, PICKUP_PROXY, PICKUP_API];
  const raw = await fetchJson(sources);
  return raw.map(normalizePickupStation).filter((s): s is Station => !!s);
}

/**
 * Drop-off / send points — booking-enabled agents.
 * Tries dedicated allowed-drop-off-points API; falls back to send_collect from pickup list.
 */
export async function fetchDropOffStations(): Promise<Station[]> {
  const sources = import.meta.env.DEV
    ? [DROPOFF_PROXY, DROPOFF_FN, DROPOFF_API]
    : [DROPOFF_FN, DROPOFF_PROXY, DROPOFF_API];
  const raw = await fetchJson(sources);
  const fromApi = raw
    .map((item) => {
      const station = normalizePickupStation(item);
      if (!station) return null;
      return {
        ...station,
        source: "dropoff" as const,
        capability: "send_collect" as const,
        id: `dropoff-${station.agentId}-${station.town}`,
      };
    })
    .filter((s): s is Station => !!s);

  if (fromApi.length) return fromApi;

  const pickup = await fetchPickupStations();
  return pickup
    .filter((s) => s.capability === "send_collect")
    .map((s) => ({
      ...s,
      source: "dropoff" as const,
      id: `dropoff-${s.agentId}-${s.town}`,
    }));
}

const SHARE_ORIGIN = "https://escrowcourier.com";

export function slugifyStationPart(value: string): string {
  return String(value || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Public share slug — clean town (e.g. bamburi), never localhost or numeric ids. */
export function stationShareSlug(station: Station): string {
  const townCore = station.town.replace(/\b(town|cbd|county|constituency)\b/gi, "").trim();
  return (
    slugifyStationPart(townCore) ||
    slugifyStationPart(station.town) ||
    slugifyStationPart(station.businessName) ||
    "station"
  );
}

export function stationShareUrl(station: Station): string {
  return `${SHARE_ORIGIN}/pickup-points?station=${encodeURIComponent(stationShareSlug(station))}`;
}

/** Resolve ?station= town slug / shop slug / legacy id against loaded stations. */
export function findStationByShareParam(stations: Station[], param: string): Station | null {
  const raw = decodeURIComponent(String(param || "").trim());
  if (!raw || !stations.length) return null;

  const byId = stations.find((s) => s.id === raw);
  if (byId) return byId;

  const slug = slugifyStationPart(raw);
  if (!slug) return null;

  const townMatches = stations.filter((s) => {
    const townSlug = stationShareSlug({ ...s, businessName: "" });
    return townSlug === slug || slugifyStationPart(s.town) === slug;
  });
  if (townMatches.length === 1) return townMatches[0];
  if (townMatches.length > 1) {
    return townMatches.find((s) => s.capability === "send_collect") || townMatches[0];
  }

  const shopMatch = stations.find((s) => slugifyStationPart(s.businessName) === slug);
  if (shopMatch) return shopMatch;

  const compound = stations.find((s) => {
    const town = slugifyStationPart(s.town);
    const shop = slugifyStationPart(s.businessName);
    return `${town}-${shop}` === slug || slug.startsWith(`${town}-`);
  });
  return compound || null;
}

export function stationShareText(station: Station): string {
  return [
    `📍 ParcelGrid Station: ${station.town} (${station.businessName})`,
    `🏢 Exact Location:`,
    station.address,
    ``,
    `🚚 Track or find your nearest station:`,
    stationShareUrl(station),
    ``,
    `ParcelGrid — Next-day upcountry parcel delivery & instant Pay on Delivery across Kenya.`,
  ].join("\n");
}

/** Google Maps directions / place search for a station. */
export function stationDirectionsUrl(station: Station): string {
  const coords = station.coordinates?.match(/-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?/);
  if (coords) {
    const [lat, lng] = coords[0].split(/\s*,\s*/);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${lat},${lng}`)}`;
  }
  const query = [station.businessName, station.address, station.town, "Kenya"].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const LOCATION_SEARCH_API = "https://app.escrowcourier.com/location-service/api/location-searches";
const LOCATION_SEARCH_PROXY = "/location-searches-api";
const LOCATION_SEARCH_FN = "/api/location-searches";

const loggedMisses = new Set<string>();

export type StationSearchMissPayload = {
  searchQuery: string;
  filter?: "all" | "send" | "collect";
  stationCountLoaded?: number;
};

/**
 * Log a stations-directory miss to location-service so ops can review
 * GET /api/location-searches/not-found (and callerReportedNotFound metadata).
 * Fire-and-forget; never throws to the UI.
 */
export async function logStationSearchMiss(payload: StationSearchMissPayload): Promise<void> {
  const searchQuery = String(payload.searchQuery || "").trim();
  if (searchQuery.length < 4) return;

  const key = searchQuery.toLowerCase();
  if (loggedMisses.has(key)) return;
  loggedMisses.add(key);

  const body = {
    searchQuery,
    notFound: true,
    metadata: {
      source: "parcelgrid-website-stations",
      page: "/pickup-points",
      filter: payload.filter || "all",
      stationCountLoaded: payload.stationCountLoaded ?? null,
      coverageGap: true,
    },
  };

  const sources = import.meta.env.DEV
    ? [LOCATION_SEARCH_PROXY, LOCATION_SEARCH_FN, LOCATION_SEARCH_API]
    : [LOCATION_SEARCH_FN, LOCATION_SEARCH_PROXY, LOCATION_SEARCH_API];

  for (const source of sources) {
    try {
      const res = await fetch(source, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.ok) return;
    } catch {
      // try next
    }
  }
}
