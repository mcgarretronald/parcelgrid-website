import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Copy,
  Loader2,
  MapPin,
  MessageCircle,
  Package,
  Search,
  Share2,
  Store,
  Truck,
} from "lucide-react";
import Footer from "../components/Footer";
import { MiniFaq } from "../components/MiniFaq";
import { Reveal } from "../components/Reveal";
import { STATIONS_FAQ_IDS, faqByIds } from "../lib/faqData";
import { useScrollToTop } from "../hooks/useScrollToTop";
import {
  fetchPickupStations,
  findStationByShareParam,
  logStationSearchMiss,
  stationShareText,
  stationShareUrl,
  type Station,
  type StationCapability,
} from "../lib/stations";

type FilterMode = "all" | "send" | "collect";

const flagshipHubs = [
  {
    id: "ronald-ngala",
    shortName: "Ronald Ngala",
    name: "City Centre Mall — Ronald Ngala",
    address: "Shop LG12, Basement, Ronald Ngala Street, Nairobi CBD",
    services: "Parcel Drop-Off, Collection, Walk-In Booking, COD Support",
    mapTitle: "ParcelGrid Courier Services, Ronald Ngala Street",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.813395161258!2d36.824911410792836!3d-1.2859883986963683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f11c43c98b89d%3A0x442d20dabf9264b5!2sParcelGrid%20Courier%20Services-%20Ronald%20Ngala%20Street!5e0!3m2!1sen!2ske!4v1791380783768!5m2!1sen!2ske",
  },
  {
    id: "moi-avenue",
    shortName: "Moi Avenue",
    name: "Iconic Business Plaza — Moi Avenue",
    address: "Ground Floor, Shop G13 (Between Sasa Mall & Sawa Mall), Moi Avenue, Nairobi CBD",
    services: "Parcel Drop-Off, Collection, Walk-In Booking, COD Support",
    mapTitle: "ParcelGrid Courier Services, Moi Avenue",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.8182806741765!2d36.82043671079267!3d-1.2828584986995366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1190bea91a07%3A0x14f4fce39750d0df!2sParcelGrid%20Courier%20Services%E2%80%93%20Moi%20Avenue!5e0!3m2!1sen!2ske!4v1791380869461!5m2!1sen!2ske",
  },
  {
    id: "taveta-road",
    shortName: "Taveta Road",
    name: "Jithada Shopping Complex — Taveta Road",
    address: "Ground Floor, Shop F7 (Opposite Samagat Building), Taveta Road, Nairobi CBD",
    services: "Parcel Drop-Off, Collection, Walk-In Booking, COD Support",
    mapTitle: "ParcelGrid Courier Services, Taveta Road",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.817401352373!2d36.823271210792846!3d-1.2834223986989701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f116c2b88b5ff%3A0xdc1f0c637cd56f73!2sParcelGrid%20Courier%20Services%20%E2%80%93%20Taveta%20Road!5e0!3m2!1sen!2ske!4v1791380808173!5m2!1sen!2ske",
  },
];

function matchesQuery(station: Station, q: string): boolean {
  if (!q) return true;
  const hay = `${station.town} ${station.businessName} ${station.address} ${station.county || ""}`.toLowerCase();
  return hay.includes(q);
}

function CapabilityBadge({ capability }: { capability: StationCapability }) {
  if (capability === "send_collect") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00473E] px-3 py-1 text-xs font-semibold text-[#E9FF15]">
        <Truck className="size-3.5" aria-hidden />
        Send & Collect
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00473E]/15 bg-[#00473E]/[0.06] px-3 py-1 text-xs font-semibold text-[#00473E]/80">
      <Package className="size-3.5" aria-hidden />
      Pickup Only
    </span>
  );
}

function StationCard({
  station,
  shared,
  locationCopied,
  highlighted,
  onShare,
  onCopyLocation,
}: {
  station: Station;
  shared: boolean;
  locationCopied: boolean;
  highlighted?: boolean;
  onShare: () => void;
  onCopyLocation: () => void;
}) {
  return (
    <li
      id={station.id}
      data-station-slug={station.town}
      className={`station-card flex flex-col justify-between rounded-2xl border bg-white p-5 shadow-sm ${
        highlighted
          ? "border-[#00473E]/40 ring-2 ring-[#E9FF15]/80 ring-offset-2"
          : "border-black/[0.07]"
      }`}
    >
      <div>
        <div className="mb-3 flex items-center justify-between gap-2">
          <CapabilityBadge capability={station.capability} />
          {station.county ? (
            <span className="truncate text-[11px] font-bold tracking-wider text-[#5c6562] uppercase">
              {station.county}
            </span>
          ) : null}
        </div>

        <h3 className="font-[Sora] text-base font-extrabold tracking-tight text-[#111] uppercase">
          {station.town}
        </h3>
        <p className="mt-1 text-xs font-semibold text-[#00473E]">{station.businessName}</p>

        <div className="mt-3 mb-1 flex items-start gap-2 text-xs leading-relaxed text-[#3d4542]">
          <MapPin className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
          <span>{station.address}</span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/[0.06] pt-3">
        <button
          type="button"
          onClick={onCopyLocation}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-[#222] transition-colors hover:bg-[#f7f8f6]"
        >
          {locationCopied ? (
            <>
              <Check className="size-3.5 text-[#00473E]" />
              Copied
            </>
          ) : (
            <>
              <Copy className="size-3.5 text-[#5c6562]" aria-hidden />
              Copy location
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onShare}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-[#222] transition-colors hover:bg-[#f7f8f6]"
        >
          {shared ? (
            <>
              <Check className="size-3.5 text-[#00473E]" />
              Shared
            </>
          ) : (
            <>
              <Share2 className="size-3.5 text-[#5c6562]" />
              Share
            </>
          )}
        </button>
      </div>
    </li>
  );
}

function EmptyDirectoryState({
  query,
  filter,
  queryMatches,
  sendInQuery,
  collectInQuery,
  onShowAll,
  onShowSend,
  onShowCollect,
  onClearSearch,
}: {
  query: string;
  filter: FilterMode;
  queryMatches: number;
  sendInQuery: number;
  collectInQuery: number;
  onShowAll: () => void;
  onShowSend: () => void;
  onShowCollect: () => void;
  onClearSearch: () => void;
}) {
  const label = query.trim() || "that search";
  const filterBlocked = Boolean(query.trim()) && queryMatches > 0 && filter !== "all";

  if (filterBlocked) {
    const otherFilter = filter === "send" ? "Drop-Off & Send" : "Pickup / Collection Only";
    return (
      <div className="mt-10 overflow-hidden rounded-2xl border border-[#00473E]/15 bg-[#f7f8f6]">
        <div className="border-b border-[#00473E]/10 bg-[#00473E] px-5 py-4 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.14em] text-[#E9FF15] uppercase">
            Coverage found
          </p>
          <h3 className="mt-1 font-[Sora] text-lg font-semibold text-white sm:text-xl">
            We serve “{label}” — just not under this filter
          </h3>
        </div>
        <div className="px-5 py-6 sm:px-8">
          <p className="text-sm leading-relaxed text-[#3d4542]">
            No stations matched <span className="font-semibold text-[#111]">“{label}”</span> under{" "}
            <span className="font-semibold text-[#111]">{otherFilter}</span>. We still found{" "}
            <span className="font-semibold text-[#00473E]">{queryMatches}</span> station
            {queryMatches === 1 ? "" : "s"} for that search
            {sendInQuery > 0 || collectInQuery > 0 ? (
              <>
                {" "}
                (
                {sendInQuery > 0 && `${sendInQuery} Send & Collect`}
                {sendInQuery > 0 && collectInQuery > 0 && ", "}
                {collectInQuery > 0 && `${collectInQuery} collection only`})
              </>
            ) : null}
            . This does <span className="font-semibold">not</span> mean ParcelGrid skips that town.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onShowAll}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00473E] px-4 text-sm font-semibold text-white"
            >
              Show all {queryMatches} match{queryMatches === 1 ? "" : "es"}
              <ArrowRight className="size-4" aria-hidden />
            </button>
            {sendInQuery > 0 && filter !== "send" && (
              <button
                type="button"
                onClick={onShowSend}
                className="inline-flex min-h-11 items-center rounded-full border border-[#00473E]/25 bg-white px-4 text-sm font-semibold text-[#00473E]"
              >
                View Drop-Off & Send ({sendInQuery})
              </button>
            )}
            {collectInQuery > 0 && filter !== "collect" && (
              <button
                type="button"
                onClick={onShowCollect}
                className="inline-flex min-h-11 items-center rounded-full border border-[#00473E]/25 bg-white px-4 text-sm font-semibold text-[#00473E]"
              >
                View collection points ({collectInQuery})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-black/[0.08] bg-[#f7f8f6]">
      <div className="px-5 py-8 text-center sm:px-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#00473E] text-[#E9FF15]">
          <MapPin className="size-6" aria-hidden />
        </div>
        <h3 className="mt-4 font-[Sora] text-lg font-semibold text-[#111] sm:text-xl">
          {query.trim()
            ? `No listed station for “${label}” yet`
            : "No stations in this filter"}
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-[#5c6562]">
          {query.trim() ? (
            <>
              That does <span className="font-semibold text-[#111]">not</span> mean we don’t deliver
              to {label}. Buyers often collect from a nearby town, and sellers can still drop off
              at any Nairobi CBD branch or Send & Collect station.
            </>
          ) : (
            <>Try another filter, or search a town name to see coverage nearby.</>
          )}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {query.trim() && (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex min-h-11 items-center rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-[#00473E]"
            >
              Clear search
            </button>
          )}
          <button
            type="button"
            onClick={onShowAll}
            className="inline-flex min-h-11 items-center rounded-full bg-[#00473E] px-4 text-sm font-semibold text-white"
          >
            Browse all stations
          </button>
          <a
            href="https://wa.me/254745111555?text=Hi%20ParcelGrid%2C%20I%20need%20help%20finding%20a%20station"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00473E]/20 bg-white px-4 text-sm font-semibold text-[#00473E]"
          >
            <MessageCircle className="size-4" aria-hidden />
            Ask support
          </a>
          <a
            href="#cbd-hubs"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-black/10 bg-white px-4 text-sm font-semibold text-[#5c6562]"
          >
            Nairobi CBD branches
            <ArrowRight className="size-4" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}

async function shareStation(station: Station) {
  const text = stationShareText(station);
  const url = stationShareUrl(station);
  const title = `ParcelGrid Station: ${station.town}`;

  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      // URL is already in the message body for WhatsApp/Instagram paste fidelity.
      await navigator.share({ title, text, url });
      return "shared";
    } catch {
      // fall through to clipboard (user cancel or unsupported payload)
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}

export default function PickupPointsPage() {
  useScrollToTop();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sharedId, setSharedId] = useState<string | null>(null);
  const [copiedLocationId, setCopiedLocationId] = useState<string | null>(null);
  const [focusedStationId, setFocusedStationId] = useState<string | null>(null);
  const [activeHubId, setActiveHubId] = useState(flagshipHubs[0].id);
  const [mountedHubMaps, setMountedHubMaps] = useState<string[]>([flagshipHubs[0].id]);

  const selectHub = (id: string) => {
    setActiveHubId(id);
    setMountedHubMaps((current) => (current.includes(id) ? current : [...current, id]));
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const pickups = await fetchPickupStations();
        if (cancelled) return;

        const merged = [...pickups].sort((a, b) => {
          if (a.capability !== b.capability) {
            return a.capability === "send_collect" ? -1 : 1;
          }
          return a.town.localeCompare(b.town) || a.businessName.localeCompare(b.businessName);
        });
        setStations(merged);
      } catch {
        if (!cancelled) setError("Unable to load stations right now. Please refresh and try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Deep link: /pickup-points?station=bamburi → fill search, highlight card,
  // scroll to directory (heading + filters + results), not past it onto the card alone.
  useEffect(() => {
    if (loading || !stations.length) return;
    const param = searchParams.get("station");
    if (!param) return;

    const match = findStationByShareParam(stations, param);
    const searchSeed = match?.town || param.replace(/[-_]+/g, " ").trim();
    setFilter("all");
    setQuery(searchSeed);
    setFocusedStationId(match?.id || null);

    window.setTimeout(() => {
      const el =
        document.getElementById("station-directory") ||
        document.getElementById("directory-heading");
      if (!el) return;
      const header = document.querySelector("header");
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    }, 150);
  }, [loading, stations, searchParams]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.setTimeout(() => window.scrollTo({ top, behavior: "smooth" }), 50);
      }
    }
  }, [location]);

  const queryNormalized = query.trim().toLowerCase();

  const queryMatchedStations = useMemo(
    () => stations.filter((station) => matchesQuery(station, queryNormalized)),
    [stations, queryNormalized],
  );

  const filtered = useMemo(() => {
    return queryMatchedStations.filter((station) => {
      if (filter === "send" && station.capability !== "send_collect") return false;
      if (filter === "collect" && station.capability !== "collect_only") return false;
      return true;
    });
  }, [queryMatchedStations, filter]);

  const sendCount = stations.filter((s) => s.capability === "send_collect").length;
  const collectCount = stations.filter((s) => s.capability === "collect_only").length;
  const sendInQuery = queryMatchedStations.filter((s) => s.capability === "send_collect").length;
  const collectInQuery = queryMatchedStations.filter((s) => s.capability === "collect_only").length;

  // Log true station misses (no town/shop match at all) to location-service
  // so ops can review coverage gaps via /api/location-searches/not-found.
  useEffect(() => {
    if (loading || error) return;
    const q = query.trim();
    if (q.length < 4) return;
    if (queryMatchedStations.length > 0) return;
    if (stations.length === 0) return;

    const handle = window.setTimeout(() => {
      void logStationSearchMiss({
        searchQuery: q,
        filter,
        stationCountLoaded: stations.length,
      });
    }, 900);

    return () => window.clearTimeout(handle);
  }, [query, queryMatchedStations.length, stations.length, loading, error, filter]);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const onShare = async (station: Station) => {
    const result = await shareStation(station);
    if (result === "copied" || result === "shared") {
      setSharedId(station.id);
      window.setTimeout(() => setSharedId((id) => (id === station.id ? null : id)), 2000);
    }
  };

  const onCopyLocation = async (station: Station) => {
    const text = [station.town, station.businessName, station.address].filter(Boolean).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLocationId(station.id);
      window.setTimeout(
        () => setCopiedLocationId((id) => (id === station.id ? null : id)),
        2000,
      );
    } catch {
      // ignore clipboard failures
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>ParcelGrid Pickup & Drop-Off Stations Kenya | 300+ Towns Covered</title>
        <meta
          name="title"
          content="ParcelGrid Pickup & Drop-Off Stations Kenya | 300+ Towns Covered"
        />
        <meta
          name="description"
          content="Find ParcelGrid parcel pickup points and drop-off stations across Kenya. Send or collect parcels in Nairobi CBD, Mombasa, Nakuru, Eldoret, Kisumu, and 300+ towns."
        />
        <meta
          name="keywords"
          content="ParcelGrid pickup points, courier drop-off Kenya, send parcel from Nakuru, courier drop-off Eldoret, Nairobi CBD drop-off, parcel collection Kenya, Pay on Delivery stations"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={origin ? `${origin}/pickup-points` : "/pickup-points"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={origin ? `${origin}/pickup-points` : ""} />
        <meta
          property="og:title"
          content="ParcelGrid Pickup & Drop-Off Stations Kenya | 300+ Towns Covered"
        />
        <meta
          property="og:description"
          content="Send or collect parcels at ParcelGrid stations across Nairobi CBD and 300+ towns in Kenya."
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="ParcelGrid Pickup & Drop-Off Stations Kenya | 300+ Towns Covered"
        />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(0,71,62,0.5),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">
            Drop-Off & Pickup Stations
          </p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            ParcelGrid Stations: Drop Off & Pick Up Across Kenya
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
            Send parcels upcountry from our Nairobi CBD branches and selected regional stations, or direct
            your buyers to collect at over 300 verified pickup points countrywide.
          </p>
        </div>
      </section>

      {/* CBD branches */}
      <Reveal as="section" className="border-b border-black/[0.06] bg-[#f7f8f6] py-12 sm:py-16" id="cbd-hubs">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Central branches</p>
            <h2 className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Nairobi CBD Drop-Off & Dispatch Branches
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6562] sm:text-base">
              Drop off parcels, book walk-ins, and collect returns at any of our three central branches:
            </p>
          </div>

          <Reveal as="div" variant="stagger" className="mt-8 grid gap-4 md:grid-cols-3">
            {flagshipHubs.map((hub) => {
              const active = hub.id === activeHubId;
              return (
                <button
                  key={hub.id}
                  type="button"
                  onClick={() => selectHub(hub.id)}
                  aria-pressed={active}
                  className={`station-card rounded-2xl border bg-white p-5 text-left sm:p-6 ${
                    active
                      ? "border-[#00473E]/35 shadow-[0_0_0_1px_rgba(233,255,21,0.55),0_12px_28px_rgba(0,71,62,0.1)]"
                      : "border-black/[0.06]"
                  }`}
                >
                  <span className="inline-flex rounded-full bg-[#E9FF15] px-2.5 py-1 text-[11px] font-semibold text-[#00473E]">
                    Send & Collect
                  </span>
                  <h3 className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">{hub.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">{hub.address}</p>
                  <p className="mt-4 text-xs font-medium text-[#00473E]">Services: {hub.services}</p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#00473E]">
                    <MapPin className="size-3.5" aria-hidden />
                    {active ? "Showing on map" : "Show on map"}
                  </p>
                </button>
              );
            })}
          </Reveal>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div
              role="tablist"
              aria-label="Nairobi CBD branch maps"
              className="flex overflow-x-auto overscroll-x-contain bg-[#f4f5f2] sm:grid sm:grid-cols-3 sm:overflow-visible"
            >
              {flagshipHubs.map((hub) => {
                const selected = hub.id === activeHubId;
                return (
                  <button
                    key={`map-tab-${hub.id}`}
                    id={`stations-hub-tab-${hub.id}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={`stations-hub-panel-${hub.id}`}
                    onClick={() => selectHub(hub.id)}
                    className={`min-w-[7.5rem] shrink-0 border-b px-3 py-3.5 text-left transition-colors sm:min-w-0 sm:px-5 sm:py-4 ${
                      selected
                        ? "border-[#E9FF15] bg-white text-[#071410]"
                        : "border-black/10 bg-[#f4f5f2] text-[#5d6b68] hover:text-[#071410]"
                    }`}
                  >
                    <span className="block truncate text-sm font-semibold">{hub.shortName}</span>
                    <span className="mt-0.5 hidden truncate text-xs text-[#5d6b68] sm:block">
                      View map & directions
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="relative h-[360px] bg-[#f4f5f2] sm:h-[440px]">
              {flagshipHubs.map((hub) => {
                const selected = hub.id === activeHubId;
                return (
                  <div
                    key={`map-panel-${hub.id}`}
                    id={`stations-hub-panel-${hub.id}`}
                    role="tabpanel"
                    aria-labelledby={`stations-hub-tab-${hub.id}`}
                    hidden={!selected}
                    className="absolute inset-0"
                  >
                    {mountedHubMaps.includes(hub.id) ? (
                      <iframe
                        title={hub.mapTitle}
                        src={hub.mapSrc}
                        className="h-full w-full border-0"
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Directory */}
      <Reveal as="section" className="py-12 sm:py-16" id="station-directory" aria-labelledby="directory-heading">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                id="directory-heading"
                className="font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
              >
                Find a station near you
              </h2>
              <p className="mt-2 text-sm text-[#5c6562]">
                Live directory from ParcelGrid station data — town, landmark, and shop name.
              </p>
            </div>
            {!loading && !error && (
              <p className="text-sm text-[#5c6562]">
                Showing <span className="font-semibold text-[#111]">{filtered.length}</span> of{" "}
                {stations.length} stations
              </p>
            )}
          </div>

          <p className="mt-6 rounded-xl border border-[#00473E]/12 bg-[#00473E]/[0.04] px-4 py-3 text-sm text-[#3d4542]">
            Every listed station supports <span className="font-semibold text-[#00473E]">customer collection</span> and{" "}
            <span className="font-semibold text-[#00473E]">Pay on Delivery (COD)</span>. Use the filters to find
            places that also accept outgoing parcels.
          </p>

          {/* Filters */}
          <div
            className="mt-5 flex gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Filter stations by capability"
          >
            {(
              [
                { id: "all" as const, label: `All Stations (300+)` },
                { id: "send" as const, label: `Drop-Off & Send (${sendCount || "—"})` },
                { id: "collect" as const, label: `Pickup / Collection Only (${collectCount || "—"})` },
              ] as const
            ).map((item) => {
              const active = filter === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(item.id)}
                  className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[#00473E] text-white"
                      : "border border-black/10 bg-white text-[#5c6562] hover:border-[#00473E]/30 hover:text-[#00473E]"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <form
            className="mt-4 flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 shadow-sm"
            onSubmit={(e) => e.preventDefault()}
          >
            <Search className="size-5 shrink-0 text-[#5c6562]" aria-hidden />
            <label htmlFor="station-search" className="sr-only">
              Search stations
            </label>
            <input
              id="station-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by town, county, or landmark (e.g., Eldoret, Nakuru, Meru)..."
              className="min-h-11 min-w-0 flex-1 bg-transparent text-sm text-[#111] outline-none placeholder:text-[#9aa3a0]"
            />
          </form>

          {/* States */}
          {loading && (
            <div className="mt-12 flex flex-col items-center justify-center gap-3 py-16 text-[#00473E]">
              <Loader2 className="size-8 animate-spin" />
              <p className="text-sm font-medium">Loading live ParcelGrid stations…</p>
            </div>
          )}

          {error && !loading && (
            <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <EmptyDirectoryState
              query={query}
              filter={filter}
              queryMatches={queryMatchedStations.length}
              sendInQuery={sendInQuery}
              collectInQuery={collectInQuery}
              onShowAll={() => setFilter("all")}
              onShowSend={() => setFilter("send")}
              onShowCollect={() => setFilter("collect")}
              onClearSearch={() => {
                setQuery("");
                setFilter("all");
              }}
            />
          )}

          {!loading && !error && filtered.length > 0 && (
            <Reveal as="ul" variant="stagger" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((station) => (
                <StationCard
                  key={station.id}
                  station={station}
                  shared={sharedId === station.id}
                  locationCopied={copiedLocationId === station.id}
                  highlighted={focusedStationId === station.id}
                  onShare={() => onShare(station)}
                  onCopyLocation={() => onCopyLocation(station)}
                />
              ))}
            </Reveal>
          )}
        </div>
      </Reveal>

      {/* SEO / two-way shipping block */}
      <Reveal as="section" className="border-t border-black/[0.06] bg-[#f7f8f6] py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#00473E] text-[#E9FF15]">
            <Truck className="size-6" aria-hidden />
          </div>
          <h2 className="font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
            Sending Parcels Outside Nairobi?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5c6562]">
            ParcelGrid operates a growing network of drop-off stations across Kenya&apos;s key commercial
            towns, allowing upcountry sellers to send items directly to Nairobi or other regional stations.
            Every station supports prepaid parcels and secure Pay on Delivery (COD) with instant M-Pesa
            wallet settlement upon collection.
          </p>
          <p className="mt-4 text-base leading-relaxed text-[#5c6562]">
            Need help finding your nearest drop-off or pickup point? Call or WhatsApp our support line on{" "}
            <a href="https://wa.me/254745111555" className="font-semibold text-[#00473E] hover:underline">
              0745 111 555
            </a>{" "}
            /{" "}
            <a href="tel:+254794333888" className="font-semibold text-[#00473E] hover:underline">
              0794 333 888
            </a>
            .
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-[#5c6562] uppercase">
              Follow ParcelGrid
            </p>
            <ul className="flex items-center gap-3">
              {stationSocialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.ariaLabel}
                    className="inline-flex size-11 items-center justify-center rounded-full border border-black/10 bg-white text-[#00473E] transition-colors hover:border-[#00473E]/35 hover:bg-[#00473E] hover:text-[#E9FF15]"
                  >
                    {link.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/book-parcel"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#E9FF15] px-7 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4ee12]"
            >
              <Package className="size-4" aria-hidden />
              Book a Parcel Online
            </Link>
            <Link
              to="/about"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-7 text-sm font-semibold text-[#00473E] transition-colors hover:border-[#00473E]/40"
            >
              <Store className="size-4" aria-hidden />
              About ParcelGrid
            </Link>
          </div>
        </div>
      </Reveal>

      <MiniFaq
        id="stations-faq"
        items={faqByIds(STATIONS_FAQ_IDS)}
        kicker="Stations"
        description="How sending, collecting and holding times work at our CBD branches and upcountry stations."
      />

      <Footer />
    </div>
  );
}

const stationSocialLinks = [
  {
    label: "Facebook",
    ariaLabel: "ParcelGrid on Facebook",
    href: "https://www.facebook.com/p/ParcelGrid-61582861464189/",
    icon: <FacebookIcon />,
  },
  {
    label: "WhatsApp",
    ariaLabel: "WhatsApp support",
    href: "https://wa.me/254745111555",
    icon: <WhatsAppIcon />,
  },
  {
    label: "Instagram",
    ariaLabel: "ParcelGrid on Instagram",
    href: "https://www.instagram.com/parcelgrid/?hl=en",
    icon: <InstagramIcon />,
  },
  {
    label: "TikTok",
    ariaLabel: "ParcelGrid on TikTok",
    href: "https://www.tiktok.com/@parcelgrid",
    icon: <TikTokIcon />,
  },
];

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}
