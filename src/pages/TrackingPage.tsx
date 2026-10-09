import React, { useEffect, useMemo, useState } from 'react';
import { JsonLd } from '../components/JsonLd';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Package,
  MapPin,
  Truck,
  Loader2,
  Clock,
  User,
  Store,
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  PackageCheck,
  PackageX,
  RotateCcw,
  Copy,
  Check,
  ChevronRight,
  ChevronUp,
  Eye,
  Phone,
  MessageCircle,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import Footer from '../components/Footer';
import { TrackEmptyMarketing, TrackSoftSellRail } from '../components/track/TrackMarketing';

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface TrackingEvent {
  status: string;
  description?: string;
  location?: string;
  timestamp?: string;
  date?: Date | null;
  completed?: boolean;
}

interface TrackingData {
  trackingNumber: string;
  status: string;
  statusCode?: string;
  statusLabel: string;
  statusStage: number;
  isReturned?: boolean;
  forwardStage?: number;
  events: TrackingEvent[];
  destination?: string;
  origin?: string;
  customerName?: string;
  vendorName?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function parseDate(value?: string): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d?: Date | null): string {
  if (!d || isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Africa/Nairobi',
  }).format(d);
}

function getFirstString(obj: any, keys: string[]): string | undefined {
  if (!obj || typeof obj !== 'object') return undefined;
  for (const key of keys) {
    const v = obj[key];
    if (typeof v === 'string' && v.trim()) return v.trim();
    if (typeof v === 'number' && !isNaN(v)) return String(v);
  }
  return undefined;
}

/** Return a displayable location, or undefined for placeholder/empty values (null, Unknown, N/A, ...). */
function cleanLocation(value?: string): string | undefined {
  const v = (value || '').trim();
  if (!v) return undefined;
  if (/^(unknown|n\/?a|na|none|null|nil|unspecified|not\s*specified|-+|\.\.\.|tbd)$/i.test(v)) {
    return undefined;
  }
  return v;
}

/** Tidy up an event description (e.g. replace 'by Admin' with the courier brand). */
function cleanDescription(value?: string): string | undefined {
  const v = (value || '').trim();
  if (!v) return undefined;
  return v.replace(/\bby\s+admin\b/gi, 'by ParcelGrid');
}

/** Map Escrow track status (code + milestones) to a normalized label + journey stage (0-4). */
function mapTrackStatus(
  statusCode: string,
  milestones: Record<string, any>,
  rawLabel?: string
): { label: string; stage: number } {
  const code = (statusCode || '').toLowerCase();

  // Prefer an exact match on the live status code.
  const codeMap: Array<[RegExp, string, number]> = [
    [/delivered/, 'Delivered', 4],
    [/cancel/, 'Cancelled', -1],
    [/return/, 'Returned / Not Delivered', -1],
    [/failed|rejected/, 'Returned / Not Delivered', -1],
    [/ready_for_collection/, 'Ready for Collection', 3],
    [/out_for_delivery|dispatched/, 'Out for Delivery', 3],
    [/received_by_escrow|received_by_hq/, 'Received by Escrow', 3],
    [/arrived_at_hq|arrived_at/, 'Arrived at Branch', 3],
    [/in_transit|transit/, 'In Transit', 2],
    [/received_at_origin|picked|collected|scanned/, 'Picked Up', 1],
    [/pending|booked|created/, 'Parcel Booked', 0],
  ];
  for (const [re, label, stage] of codeMap) {
    if (re.test(code)) return { label, stage };
  }

  // Fallback: the furthest reached milestone determines the current stage.
  const milestoneOrder: Array<[string, string, number]> = [
    ['deliveredAt', 'Delivered', 4],
    ['returnedAt', 'Returned / Not Delivered', -1],
    ['cancelledAt', 'Cancelled', -1],
    ['readyForCollectionAt', 'Ready for Collection', 3],
    ['dispatchedAt', 'Out for Delivery', 3],
    ['receivedByEscrowAt', 'Received by Escrow', 3],
    ['arrivedAtHqAt', 'Arrived at Branch', 3],
    ['inTransitToHqAt', 'In Transit', 2],
    ['receivedAtOriginAt', 'Picked Up', 1],
    ['bookedAt', 'Parcel Booked', 0],
  ];
  if (milestones && typeof milestones === 'object') {
    for (const [key, label, stage] of milestoneOrder) {
      if (milestones[key]) return { label, stage };
    }
  }

  return { label: rawLabel || 'Parcel Booked', stage: 0 };
}

/* ------------------------------------------------------------------ */
/* Delivery stages                                                     */
/* ------------------------------------------------------------------ */

interface DeliveryStage {
  title: string;
  description: string;
  icon: LucideIcon;
}

/** The fixed 5-step journey shown on the tracking page. */
const DELIVERY_STAGES: DeliveryStage[] = [
  {
    title: 'Parcel Order Created',
    description: 'Your parcel has been created and is waiting to be handed over to ParcelGrid.',
    icon: CalendarClock,
  },
  {
    title: 'Received by ParcelGrid',
    description: 'ParcelGrid has received your parcel at the dispatch branch.',
    icon: Package,
  },
  {
    title: 'In Transit',
    description: 'Your parcel has left Nairobi and is on the way to the pickup station.',
    icon: Truck,
  },
  {
    title: 'Ready for Collection',
    description: 'Your parcel has arrived at the pickup station and is ready for customer collection.',
    icon: Store,
  },
  {
    title: 'Delivered',
    description: 'The parcel has been successfully delivered.',
    icon: CheckCircle2,
  },
];

/** Map the current status code + milestones to a delivery stage index (0-4, -1 = cancelled/returned). */
function mapToDeliveryStage(statusCode: string, milestones: Record<string, any>): number {
  const code = (statusCode || '').toLowerCase();

  if (/(cancel|return|failed|rejected)/.test(code)) return -1;
  if (/(delivered)/.test(code)) return 4;
  if (/(ready_for_collection)/.test(code)) return 3;
  if (/(out_for_delivery|dispatched|in_transit|transit)/.test(code)) return 2;
  if (/(received_at_origin|received_by_escrow|received_by_hq|arrived_at_hq|arrived_at|picked|collected|scanned)/.test(code)) return 1;
  if (/(pending|booked|created)/.test(code)) return 0;

  // Fallback: furthest reached milestone determines the stage.
  const milestoneOrder: Array<[string, number]> = [
    ['deliveredAt', 4],
    ['returnedAt', -1],
    ['cancelledAt', -1],
    ['readyForCollectionAt', 3],
    ['dispatchedAt', 2],
    ['inTransitToHqAt', 2],
    ['receivedAtOriginAt', 1],
    ['arrivedAtHqAt', 1],
    ['receivedByEscrowAt', 1],
    ['bookedAt', 0],
  ];
  if (milestones && typeof milestones === 'object') {
    for (const [key, idx] of milestoneOrder) {
      if (milestones[key]) return idx;
    }
  }
  return 0;
}

/** The 3-stage return journey appended after the reached outbound stages. */
const RETURN_STAGES: DeliveryStage[] = [
  { title: 'Return initiated', description: 'The return process has been started for this parcel.', icon: RotateCcw },
  { title: 'Returned to head office', description: 'The parcel is being returned to the head office.', icon: PackageX },
  { title: 'Returned', description: 'The parcel has been returned to the sender.', icon: PackageCheck },
];

/** Furthest outbound (delivery) stage reached: 0 = Awaiting handover .. 3 = Ready for Collection. */
function getForwardStageIndex(milestones: Record<string, any>, journey: any[]): number {
  const m = milestones || {};
  let idx = 0;
  if (m.readyForCollectionAt) idx = Math.max(idx, 3);
  if (m.dispatchedAt || m.inTransitToHqAt) idx = Math.max(idx, 2);
  if (m.receivedByEscrowAt || m.arrivedAtHqAt || m.receivedAtOriginAt) idx = Math.max(idx, 1);

  // Fallback: scan the journey for the furthest outbound status.
  for (const e of Array.isArray(journey) ? journey : []) {
    const c = String(getFirstString(e, ['status', 'label', 'title']) || '').toLowerCase();
    if (/(ready_for_collection|ready for collection)/.test(c)) idx = Math.max(idx, 3);
    if (/(dispatched|out_for_delivery|in_transit|transit)/.test(c)) idx = Math.max(idx, 2);
    if (/(received_by_escrow|received_by_hq|arrived_at|received_at_origin|checked.?in|received)/.test(c)) idx = Math.max(idx, 1);
  }
  return idx;
}

/** Stage offset (within RETURN_STAGES) for a returned parcel. */
function getReturnStageOffset(statusCode: string): number {
  const code = (statusCode || '').toLowerCase();
  if (/(return.*(hq|head.?office|office|depot|hub))/.test(code)) return 1;
  if (/(return.*(final|complete|finish|done|success|sender|delivered|back))/.test(code)) return 2;
  if (/^return(ed)?$/.test(code.trim())) return 2;
  return 0;
}

/** Build a standard milestone route when the API has no event history. */
function buildSyntheticEvents(input: {
  stage: number;
  statusLabel: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}): TrackingEvent[] {
  const { stage, statusLabel, createdAt, updatedAt } = input;
  const milestones = [
    {
      label: 'Parcel Order Created',
      desc: 'Your parcel has been created and is waiting to be handed over to ParcelGrid.',
    },
    {
      label: 'Received by ParcelGrid',
      desc: 'ParcelGrid has received your parcel at the dispatch branch.',
    },
    {
      label: 'In Transit',
      desc: 'Your parcel has left Nairobi and is on the way to the pickup station.',
    },
    {
      label: 'Ready for Collection',
      desc: 'Your parcel has arrived at the pickup station and is ready for customer collection.',
    },
    { label: 'Delivered', desc: 'The parcel has been successfully delivered.' },
  ];

  const events: TrackingEvent[] = milestones.map((m, i) => {
    const isCurrent = i === stage && stage >= 0;
    const isPast = stage >= 0 && i < stage;
    const completed = isPast || isCurrent;
    const hasTime = isCurrent ? !!updatedAt : i === 0 ? !!createdAt : false;
    return {
      status: m.label,
      description: m.desc,
      completed,
      date: hasTime ? (isCurrent ? updatedAt ?? null : createdAt ?? null) : null,
      timestamp: hasTime
        ? formatDate(isCurrent ? updatedAt ?? undefined : createdAt ?? undefined)
        : undefined,
    };
  });

  // Journey interrupted (returned / cancelled / failed)
  if (stage < 0) {
    events.forEach((e, i) => {
      e.completed = i === 0;
      e.date = i === 0 ? createdAt ?? null : null;
      e.timestamp = i === 0 ? formatDate(createdAt ?? undefined) : undefined;
    });
    events.push({
      status: statusLabel || 'Parcel Not Delivered',
      description: 'This parcel could not be delivered. Please contact ParcelGrid support for assistance.',
      completed: false,
      date: updatedAt ?? null,
      timestamp: formatDate(updatedAt ?? undefined),
    });
  }

  return events;
}

/** Remove near-duplicate history entries (same status/description/location), keeping the first. */
function dedupeEvents(events: TrackingEvent[]): TrackingEvent[] {
  const seen = new Set<string>();
  const out: TrackingEvent[] = [];
  for (const ev of events) {
    const key = [ev.status, ev.description, ev.location]
      .map((s) => (s || '').trim().toLowerCase())
      .join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(ev);
  }
  return out;
}

/**
 * Try to find the pickup agent (from the pickup-points list) whose business name
 * appears in the parcel destination string, e.g. destination
 * "ANDYTECH COMMUNICATIONS (KISUMU TOWN (ANDYTECH))" -> the ANDYTECH agent.
 * Returns the raw agent record so we can show its fullDetailedAddress.
 */
function matchDestinationAgent(agents: any[], destination?: string): any | null {
  if (!destination || !Array.isArray(agents) || agents.length === 0) return null;
  const destFull = destination.toLowerCase().replace(/[()]/g, ' ').replace(/\s+/g, ' ').trim();
  const destBase = destination
    .replace(/\(.*?\)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

  let best: any = null;
  let bestScore = 0;
  for (const a of agents) {
    const name = String(
      a.businessName ?? a.business_name ?? a.name ?? a.company ?? a.title ?? ''
    ).trim();
    if (!name || name.toLowerCase() === 'unknown') continue;
    const n = name.toLowerCase();
    if (n.length < 3) continue;

    let score = 0;
    if (destFull === n || destBase === n) score = 4;
    else if (destFull.includes(n) || destBase.includes(n)) score = 3;

    if (score > bestScore) {
      bestScore = score;
      best = a;
    }
  }
  return bestScore >= 3 ? best : null;
}

/** Human-friendly business name for an agent record. */
function agentDisplayName(agent: any): string {
  return (
    agent?.businessName ||
    agent?.business_name ||
    agent?.name ||
    agent?.company ||
    agent?.title ||
    'Agent'
  );
}

/** The full detailed street address for an agent record (never contact/phone fields). */
function agentDisplayAddress(agent: any): string {
  const addr = (
    agent?.fullDetailedAddress ||
    agent?.full_detailed_address ||
    agent?.detailedAddress ||
    agent?.detailed_address ||
    agent?.address ||
    ''
  ).trim();
  if (addr) return addr;
  return [agent?.town, agent?.county].filter(Boolean).join(', ');
}

/** Town • county • constituency line for an agent record. */
function agentDisplayMeta(agent: any): string {
  return [agent?.town, agent?.county, agent?.constituency].filter(Boolean).join(' • ');
}

/**
 * The published phone number for an agent record (the pickup station's contact).
 * Prefers the shop attendant's mobile (the person actually at the station), then
 * falls back to the owner's mobile/alternate number.
 */
function agentDisplayPhone(agent: any): string {
  const value =
    agent?.shopAttendantMobileNumber ||
    agent?.shop_attendant_mobile_number ||
    agent?.ownerMobileNumber ||
    agent?.owner_mobile_number ||
    agent?.ownerAlternateMobileNumber ||
    agent?.owner_alternate_mobile_number ||
    agent?.mobileNumber ||
    agent?.phoneNumber ||
    agent?.phone ||
    agent?.telephone ||
    '';
  return String(value).trim();
}

/** Phone line with a copy-to-clipboard button, used on the pickup-station cards. */
const AgentPhoneLine: React.FC<{
  phone: string;
  copied: boolean;
  onCopy: () => void;
}> = ({ phone, copied, onCopy }) => (
  <div className="mt-3 flex flex-wrap items-center gap-2">
    <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400">
      <Phone className="w-3.5 h-3.5" /> Phone
    </span>
    <span className="select-all font-mono text-sm font-semibold text-gray-900 tabular-nums">
      {phone}
    </span>
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Copy pickup agent phone number ${phone}`}
      title="Copy phone number"
      className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#00473E]/25 bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#00473E] transition-colors hover:bg-[#00473E] hover:text-white"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  </div>
);

/** Normalize the dedicated /api/track/:trackingNo response into TrackingData. */
function normalizeTrackResponse(payload: any, fallbackTrackingNo: string): TrackingData {
  const order = payload?.order && typeof payload.order === 'object' ? payload.order : {};
  const currentStatus =
    payload?.currentStatus && typeof payload.currentStatus === 'object' ? payload.currentStatus : {};
  const milestones =
    payload?.milestones && typeof payload.milestones === 'object' ? payload.milestones : {};
  const journey = Array.isArray(payload?.journey) ? payload.journey : [];

  const trackingNumber =
    getFirstString(payload, [
      'trackingNo',
      'trackingNumber',
      'tracking_no',
      'trackingnumber',
      'trackingno',
      'tracking_number',
    ]) || fallbackTrackingNo;

  const rawStatus =
    getFirstString(currentStatus, ['label', 'code', 'status']) ||
    getFirstString(payload, ['status', 'orderStatus', 'deliveryStatus', 'currentStatus', 'state']) ||
    'Parcel Booked';

  const { label } = mapTrackStatus(currentStatus?.code || '', milestones, rawStatus);
  const isReturned =
    /return/.test(currentStatus?.code || '') || !!milestones?.returnedAt;
  const forwardStage = getForwardStageIndex(milestones, journey);
  const stage = isReturned
    ? getReturnStageOffset(currentStatus?.code || '')
    : mapToDeliveryStage(currentStatus?.code || '', milestones);

  const destination =
    getFirstString(order, [
      'destination',
      'customerCounty',
      'destinationCounty',
      'destinationTown',
      'customerAddress',
      'deliveryAddress',
      'toTown',
      'receiverCounty',
    ]) || '';
  const origin =
    getFirstString(order, [
      'origin',
      'fromTown',
      'originTown',
      'pickupPointName',
      'pickupPoint',
      'sourceCounty',
      'vendorCounty',
    ]) ||
    cleanLocation(getFirstString(journey.find((e: any) => e?.branch) || {}, ['branch'])) ||
    '';

  const customerName =
    getFirstString(order, ['customerName', 'receiverName', 'recipientName', 'receiver']) || '';
  const vendorName =
    getFirstString(order, ['vendorName', 'senderName', 'sender']) || '';

  const createdAt =
    parseDate(
      getFirstString(order, ['bookedAt', 'createdAt', 'created_at', 'orderDate', 'bookingDate']) ||
        getFirstString(milestones, ['bookedAt'])
    ) || null;

  const lastJourney = journey.length > 0 ? journey[journey.length - 1] : null;
  const updatedAt =
    parseDate(
      getFirstString(lastJourney, ['timestamp', 'date', 'time', 'datetime', 'createdAt', 'updatedAt']) ||
        getFirstString(order, ['updatedAt', 'updated_at', 'lastUpdate', 'lastUpdated', 'statusDate', 'modifiedAt'])
    ) || null;

  let events: TrackingEvent[];
  if (journey.length > 0) {
    const mapped = journey
      .map((e: any): TrackingEvent => {
        const status =
          getFirstString(e, ['title', 'label', 'status', 'state', 'name', 'event', 'eventType']) ||
          getFirstString(e, ['description', 'message', 'details']) ||
          'Parcel Update';
        const description = cleanDescription(
          getFirstString(e, ['description', 'message', 'details', 'note', 'text', 'comment'])
        );
        const location = cleanLocation(
          getFirstString(e, ['branch', 'location', 'town', 'city', 'place', 'hub', 'station'])
        );
        const timestamp = getFirstString(e, [
          'timestamp',
          'date',
          'time',
          'datetime',
          'createdAt',
          'created_at',
          'updatedAt',
          'updated_at',
          'eventDate',
        ]);
        const parsedDate = parseDate(timestamp);
        return {
          status,
          description,
          location,
          timestamp: parsedDate ? formatDate(parsedDate) : timestamp,
          date: parsedDate,
          completed: true,
        };
      })
      .filter((e: TrackingEvent) => e.status)
      .sort((a: TrackingEvent, b: TrackingEvent) => (a.date?.getTime() ?? 0) - (b.date?.getTime() ?? 0));
    events = dedupeEvents(mapped);
  } else {
    events = buildSyntheticEvents({ stage, statusLabel: label, createdAt, updatedAt });
  }

  return {
    trackingNumber,
    status: rawStatus,
    statusCode: currentStatus?.code || '',
    statusLabel: label,
    statusStage: stage,
    isReturned,
    forwardStage,
    events,
    destination,
    origin,
    customerName,
    vendorName,
    createdAt,
    updatedAt,
  };
}

/* ------------------------------------------------------------------ */
/* Data fetching                                                       */
/* ------------------------------------------------------------------ */

const TRACK_API = 'https://app.escrowcourier.com/order-services/api/track';
const TRACK_PROXY_PATH = '/track-api';
const TRACK_FUNCTION_PATH = '/api/track';
const PICKUP_POINTS_API = 'https://app.escrowcourier.com/website-backend-services/api/pickup-points';
// Same-origin alternatives to the pickup-points API above:
//  - `/api/pickup-points` = the serverless function in `api/pickup-points.js`
//    (returns `Access-Control-Allow-Origin: *`, so it works from any host)
//  - `/pickup-points-api` = dev-only Vite proxy (see `vite.config.ts`) that
//    bypasses the API's CORS allowlist, which rejects http://localhost:5174
const PICKUP_POINTS_FUNCTION_PATH = '/api/pickup-points';
const PICKUP_POINTS_PROXY_PATH = '/pickup-points-api';

/**
 * Load the pickup-points (agents) list.
 *
 * The escrow API only reflects CORS headers for `escrowcourier.com` and
 * `localhost:5173`, so a direct browser fetch fails (without any error surfacing)
 * on other origins - including this project's dev server on port 5174. We therefore
 * try the same-origin options first and only then the API itself, so the agent
 * address/phone lookup works in development, on Netlify and on the k8s deploy.
 */
async function fetchPickupPoints(): Promise<any[]> {
  const sources = import.meta.env.DEV
    ? [PICKUP_POINTS_PROXY_PATH, PICKUP_POINTS_FUNCTION_PATH, PICKUP_POINTS_API]
    : [PICKUP_POINTS_FUNCTION_PATH, PICKUP_POINTS_API, PICKUP_POINTS_PROXY_PATH];

  for (const source of sources) {
    try {
      // No Content-Type header: keeps this a simple GET request (no CORS preflight).
      const res = await fetch(source, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;

      // Read as text first: an SPA host answers unknown paths with index.html,
      // which must not be treated as a successful API response.
      const text = await res.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        continue;
      }

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.agents)
        ? data.agents
        : [];
      if (arr.length) return arr;
    } catch {
      // Network/CORS failure - try the next source.
    }
  }

  throw new Error('Unable to load pickup station details.');
}

type TrackingErrorKind = 'empty' | 'not_found' | 'network' | 'unavailable';

type TrackingUiError = {
  kind: TrackingErrorKind;
  title: string;
  what: string;
  nextSteps: string[];
};

class TrackingLookupError extends Error {
  kind: Exclude<TrackingErrorKind, 'empty'>;
  constructor(kind: Exclude<TrackingErrorKind, 'empty'>, message: string) {
    super(message);
    this.kind = kind;
    this.name = 'TrackingLookupError';
  }
}

function toTrackingUiError(err: unknown, searched: string): TrackingUiError {
  const ref = searched.trim() ? `“${searched.trim()}”` : 'that number';

  if (err instanceof TrackingLookupError && err.kind === 'not_found') {
    return {
      kind: 'not_found',
      title: 'No parcel matches this tracking number',
      what: `We could not find a ParcelGrid shipment for ${ref}. The number may be mistyped, incomplete, or not created yet.`,
      nextSteps: [
        'Check the full tracking number (for example WEB#12345 or MARK#12345) — include letters, #, and digits.',
        'If you just booked, wait a minute and try again after payment.',
        'Still stuck? WhatsApp support with the number you used.',
      ],
    };
  }

  if (
    (err instanceof TrackingLookupError && err.kind === 'network') ||
    (err instanceof Error && /fetch|network|connection/i.test(err.message))
  ) {
    return {
      kind: 'network',
      title: 'Could not connect to tracking',
      what: 'Your device could not reach our tracking service. This is usually a network or connection issue.',
      nextSteps: [
        'Check your internet connection.',
        'Try Track Now again.',
        'If it keeps failing, WhatsApp support and share the tracking number.',
      ],
    };
  }

  return {
    kind: 'unavailable',
    title: 'Tracking is temporarily unavailable',
    what: 'Our tracking service did not respond correctly. This is on our side, not your tracking number.',
    nextSteps: [
      'Wait a moment, then try Track Now again.',
      'You can also track later from the same link or SMS we sent.',
      'Need help now? WhatsApp support with your tracking number.',
    ],
  };
}

async function fetchTracking(trackingNo: string): Promise<TrackingData> {
  const value = trackingNo.trim();
  const encoded = encodeURIComponent(value);

  // Prefer same-origin proxies (avoid CORS). Upstream only allows escrowcourier.com.
  const sources = import.meta.env.DEV
    ? [`${TRACK_PROXY_PATH}/${encoded}`, `${TRACK_FUNCTION_PATH}?tracking=${encoded}`, `${TRACK_API}/${encoded}`]
    : [`${TRACK_FUNCTION_PATH}?tracking=${encoded}`, `${TRACK_PROXY_PATH}/${encoded}`, `${TRACK_API}/${encoded}`];

  let lastStatus: number | null = null;
  let lastNetworkError = false;

  for (const url of sources) {
    try {
      // Simple GET — no Content-Type header (avoids CORS preflight on direct calls).
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      lastStatus = res.status;

      if (res.status === 404) {
        throw new TrackingLookupError('not_found', 'NOT_FOUND');
      }
      if (!res.ok) {
        // Try next source for gateway/proxy failures; keep last status for messaging.
        if (res.status >= 500 || res.status === 502 || res.status === 503) continue;
        throw new TrackingLookupError('unavailable', `STATUS_${res.status}`);
      }

      const text = await res.text();
      let json: any = null;
      try {
        json = JSON.parse(text);
      } catch {
        continue;
      }

      // The track endpoint returns: { success, data: { trackingNo, currentStatus, order, milestones, journey } }
      const payload = json?.data && typeof json.data === 'object' ? json.data : json;

      if (
        json?.success === false ||
        !payload ||
        (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0)
      ) {
        throw new TrackingLookupError('not_found', 'NOT_FOUND');
      }

      return normalizeTrackResponse(payload, value);
    } catch (err) {
      if (err instanceof TrackingLookupError) throw err;
      // Network/CORS failure — try the next source.
      lastNetworkError = true;
    }
  }

  if (lastNetworkError && lastStatus == null) {
    throw new TrackingLookupError('network', 'NETWORK');
  }

  throw new TrackingLookupError('unavailable', lastStatus ? `STATUS_${lastStatus}` : 'UNAVAILABLE');
}

/* ------------------------------------------------------------------ */
/* UI helpers                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const TrackingPage: React.FC = () => {
  useScrollToTop();

  const [trackingNo, setTrackingNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<TrackingUiError | null>(null);
  const [result, setResult] = useState<TrackingData | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copied = copiedKey === 'tracking';
  const [showDetails, setShowDetails] = useState(false);
  const [agentsList, setAgentsList] = useState<any[] | null>(null); // null = not loaded yet
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentError, setAgentError] = useState(false);

  const runTrack = async (raw: string) => {
    const value = raw.trim();
    if (!value) {
      setError({
        kind: 'empty',
        title: 'Enter a tracking number',
        what: 'We need your ParcelGrid tracking number to look up the parcel.',
        nextSteps: [
          'Type the full tracking number from your SMS or booking confirmation.',
          'Then tap Track Now.',
        ],
      });
      setHasSearched(true);
      return;
    }
    setTrackingNo(value);
    setLoading(true);
    setError(null);
    setResult(null);
    setHasSearched(true);
    setShowDetails(false);
    setAgentLoading(false);
    try {
      const data = await fetchTracking(value);
      setResult(data);
    } catch (err: unknown) {
      setError(toTrackingUiError(err, value));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('tracking');
    if (value?.trim()) {
      void runTrack(value);
    }
    // Prefill from the landing tracker once on arrival.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runTrack(trackingNo);
  };

  const isReturned = !!result?.isReturned;
  const forwardCount = Math.min(Math.max((result?.forwardStage ?? 0) + 1, 1), 4);
  const displayStages = isReturned
    ? [...DELIVERY_STAGES.slice(0, forwardCount), ...RETURN_STAGES]
    : DELIVERY_STAGES;
  const stageIdx = isReturned
    ? forwardCount + getReturnStageOffset(result?.statusCode || '')
    : (result?.statusStage ?? -1);
  const currentStage =
    stageIdx >= 0 && stageIdx < displayStages.length ? displayStages[stageIdx] : null;
  const isCompleteJourney =
    stageIdx >= 0 && stageIdx === displayStages.length - 1;
  const progressPercent =
    stageIdx >= 0 ? Math.round(((stageIdx + 1) / displayStages.length) * 100) : 0;

  // Preload the pickup-agents list as soon as a parcel result arrives, so the
  // agent's full detailed address and phone are already available when "View Details" opens.
  useEffect(() => {
    if (!result || agentsList !== null) return;
    let cancelled = false;
    setAgentLoading(true);
    setAgentError(false);
    (async () => {
      try {
        const arr = await fetchPickupPoints();
        if (!cancelled) setAgentsList(arr);
      } catch {
        if (!cancelled) {
          setAgentsList([]);
          setAgentError(true);
        }
      } finally {
        if (!cancelled) setAgentLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result, agentsList]);

  /** Re-run the pickup-agent lookup after a failed attempt. */
  const retryAgents = () => {
    setAgentError(false);
    setAgentsList(null);
  };

  const destAgent = useMemo(
    () => matchDestinationAgent(agentsList || [], result?.destination),
    [agentsList, result]
  );
  const originAgent = useMemo(
    () => matchDestinationAgent(agentsList || [], result?.origin),
    [agentsList, result]
  );

  /** Copy any text to the clipboard, showing a temporary "Copied" state for `key`. */
  const copyToClipboard = async (text: string, key: string) => {
    const value = (text || '').trim();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 2000);
  };

  const handleCopy = () => {
    if (!result) return;
    void copyToClipboard(result.trackingNumber, 'tracking');
  };

  const destAgentPhone = agentDisplayPhone(destAgent);
  const originAgentPhone = agentDisplayPhone(originAgent);

  const handleToggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Track Your Parcel | Live Upcountry Delivery Tracking | ParcelGrid</title>
        <meta
          name="title"
          content="Track Your Parcel | Live Upcountry Delivery Tracking | ParcelGrid"
        />
        <meta
          name="description"
          content="Track your ParcelGrid shipment across 132 towns in Kenya. Real-time updates for prepaid and Pay on Delivery (COD) parcels with Communications Authority licensed security."
        />
        <meta
          name="keywords"
          content="track parcel Kenya, parcel tracking, ParcelGrid tracking, track courier delivery, delivery status, track my parcel, parcel route, COD tracking, upcountry delivery tracking"
        />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta
          property="og:title"
          content="Track Your Parcel | Live Upcountry Delivery Tracking | ParcelGrid"
        />
        <meta
          property="og:description"
          content="Track your ParcelGrid shipment across 132 towns in Kenya. Real-time updates for prepaid and Pay on Delivery (COD) parcels."
        />
        <meta property="og:image" content={typeof window !== 'undefined' ? `${window.location.origin}/share_banner.jpg` : ''} />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta
          property="twitter:title"
          content="Track Your Parcel | Live Upcountry Delivery Tracking | ParcelGrid"
        />
        <meta
          property="twitter:description"
          content="Track your ParcelGrid shipment across 132 towns in Kenya with CA-licensed security."
        />
        <meta property="twitter:image" content={typeof window !== 'undefined' ? `${window.location.origin}/share_banner.jpg` : ''} />

        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/track` : ''} />

        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Kenya" />

      </Helmet>
      <JsonLd data={{
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Track Your Parcel | ParcelGrid',
            description:
              'Track your ParcelGrid shipment across 132 towns in Kenya. Real-time updates for prepaid and Pay on Delivery (COD) parcels with Communications Authority licensed security.',
            url: typeof window !== 'undefined' ? `${window.location.origin}/track` : '',
            publisher: {
              '@type': 'Organization',
              name: 'Escrow Courier Networks Limited',
            },
          }} />

      {/* Hero + Tracking form */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative z-10 mx-auto max-w-3xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <h1 className="font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Track Your Parcel
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-white/75 sm:text-lg">
            Real-time status updates for ParcelGrid deliveries across Kenya.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-lg sm:mt-10"
          >
            <Search className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
            <Input
              type="text"
              value={trackingNo}
              onChange={(e) => setTrackingNo(e.target.value)}
              placeholder="Enter your Tracking Number"
              className="h-12 flex-1 border-0 bg-transparent px-2 text-base focus-visible:border-transparent focus-visible:ring-0"
              aria-label="Tracking number"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 whitespace-nowrap rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4ee12] disabled:opacity-70 sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  Track Now
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-5 text-xs font-medium tracking-[0.12em] text-white/55 uppercase sm:text-[13px] sm:tracking-[0.08em] sm:normal-case">
            <span className="sm:tracking-normal">
              CA-Licensed Courier · Next-Day Upcountry · Instant M-Pesa COD Payouts
            </span>
          </p>

          {error && hasSearched && (
            <div
              className="mx-auto mt-6 max-w-2xl rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-left text-red-950 shadow-sm"
              role="alert"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                  <AlertCircle className="h-5 w-5" aria-hidden />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-[Sora] text-base font-semibold tracking-tight">{error.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-red-900/85">{error.what}</p>

                  <div className="mt-4 rounded-xl border border-red-200/80 bg-white/70 px-4 py-3">
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-red-800/70 uppercase">
                      What to do next
                    </p>
                    <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-sm leading-snug text-red-950/90">
                      {error.nextSteps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {error.kind !== 'empty' && (
                      <button
                        type="button"
                        onClick={() => void runTrack(trackingNo)}
                        disabled={loading}
                        className="inline-flex min-h-10 items-center rounded-full bg-[#00473E] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#00352f] disabled:opacity-50"
                      >
                        {loading ? 'Tracking…' : 'Try again'}
                      </button>
                    )}
                    <a
                      href={`https://wa.me/254745111555?text=${encodeURIComponent(
                        trackingNo.trim()
                          ? `Hi ParcelGrid, I need help tracking ${trackingNo.trim()}`
                          : 'Hi ParcelGrid, I need help tracking my parcel',
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-red-200 bg-white px-4 text-xs font-semibold text-red-950 transition-colors hover:bg-red-50"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden />
                      WhatsApp support
                    </a>
                    {error.kind === 'not_found' && (
                      <Link
                        to="/book-parcel"
                        className="inline-flex min-h-10 items-center rounded-full border border-red-200 bg-white px-4 text-xs font-semibold text-red-950 transition-colors hover:bg-red-50"
                      >
                        Book a parcel
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results / status */}
      {hasSearched && !loading && result && (
        <section className="bg-[#f7f8f6] py-10 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
            <div className="min-w-0 space-y-6">
            {/* Status card */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
              <div className="px-6 sm:px-8 py-6 sm:py-7">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                      Tracking Number
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-2xl text-gray-900">
                        {result.trackingNumber}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopy}
                        aria-label="Copy tracking number"
                        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-400 hover:text-[#00473E] hover:bg-gray-100 transition-colors"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                      Current Status
                    </p>
                    {currentStage ? (
                      <span
                        className={`inline-flex items-center gap-2.5 font-bold uppercase text-sm sm:text-base tracking-wide ${
                          stageIdx === displayStages.length - 1
                            ? 'text-green-700'
                            : stageIdx < 0
                            ? 'text-red-600'
                            : 'text-[#00473E]'
                        }`}
                      >
                        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#00473E]/10 text-[#00473E]">
                          <currentStage.icon className="w-5 h-5" />
                        </span>
                        {currentStage.title}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 font-bold uppercase text-sm sm:text-base tracking-wide text-red-600">
                        <AlertCircle className="w-5 h-5" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Parcel details — collapsed behind a "View Details" toggle */}
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <button
                    type="button"
                    onClick={handleToggleDetails}
                    aria-expanded={showDetails}
                    aria-controls="parcel-details-panel"
                    className="mx-auto flex min-h-11 items-center gap-2 rounded-full border border-[#00473E]/25 bg-[#00473E]/5 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#00473E] transition-colors hover:bg-[#00473E] hover:text-white"
                  >
                    {showDetails ? (
                      <>
                        <ChevronUp className="w-4 h-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4" />
                        View Details
                      </>
                    )}
                  </button>

                  {showDetails && (
                    <div id="parcel-details-panel" className="mt-6">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                            <MapPin className="w-3.5 h-3.5" /> Destination
                          </p>
                          <p className="text-sm font-medium text-gray-800">{result.destination || '—'}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                            <Store className="w-3.5 h-3.5" /> Origin
                          </p>
                          <p className="text-sm font-medium text-gray-800">{result.origin || '—'}</p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                            <Clock className="w-3.5 h-3.5" /> Last Update
                          </p>
                          <p className="text-sm font-medium text-gray-800">
                            {result.updatedAt
                              ? formatDate(result.updatedAt)
                              : result.events[result.events.length - 1]?.timestamp || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
                            <User className="w-3.5 h-3.5" /> Receiver
                          </p>
                          <p className="text-sm font-medium text-gray-800">{result.customerName || '—'}</p>
                        </div>
                      </div>

                      {/* Full detailed addresses + copyable phone numbers of the pickup agents */}
                      {agentLoading && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#00473E]/10 bg-[#00473E]/5 px-4 py-3 text-sm text-gray-500">
                          <Loader2 className="w-4 h-4 animate-spin text-[#00473E]" />
                          Resolving pickup station details…
                        </div>
                      )}
                      {!agentLoading && agentError && (
                        <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span className="flex-1">
                            Pickup station address and phone number could not be loaded right now.
                          </span>
                          <button
                            type="button"
                            onClick={retryAgents}
                            className="inline-flex min-h-11 items-center rounded-full border border-amber-400 bg-white px-4 py-1 text-xs font-semibold uppercase tracking-wide text-amber-900 transition-colors hover:bg-amber-400 hover:text-white"
                          >
                            Retry
                          </button>
                        </div>
                      )}
                      {!agentLoading && destAgent && (
                        <div className="mt-5 rounded-xl border border-[#00473E]/15 bg-[#00473E]/[0.05] p-4 sm:p-5">
                          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00473E] mb-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Destination Agent
                          </p>
                          <p className="text-sm font-bold text-gray-900">{agentDisplayName(destAgent)}</p>
                          <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                            {agentDisplayAddress(destAgent) || result.destination || '—'}
                          </p>
                          {agentDisplayMeta(destAgent) && (
                            <p className="mt-2 text-xs text-gray-500">{agentDisplayMeta(destAgent)}</p>
                          )}
                          {destAgentPhone && (
                            <AgentPhoneLine
                              phone={destAgentPhone}
                              copied={copiedKey === 'dest-agent-phone'}
                              onCopy={() => copyToClipboard(destAgentPhone, 'dest-agent-phone')}
                            />
                          )}
                        </div>
                      )}
                      {!agentLoading && originAgent && (!destAgent || originAgent !== destAgent) && (
                        <div className="mt-4 rounded-xl border border-[#00473E]/15 bg-[#00473E]/[0.05] p-4 sm:p-5">
                          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#00473E] mb-1.5">
                            <Store className="w-3.5 h-3.5" /> Origin Agent
                          </p>
                          <p className="text-sm font-bold text-gray-900">{agentDisplayName(originAgent)}</p>
                          <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                            {agentDisplayAddress(originAgent) || result.origin || '—'}
                          </p>
                          {agentDisplayMeta(originAgent) && (
                            <p className="mt-2 text-xs text-gray-500">{agentDisplayMeta(originAgent)}</p>
                          )}
                          {originAgentPhone && (
                            <AgentPhoneLine
                              phone={originAgentPhone}
                              copied={copiedKey === 'origin-agent-phone'}
                              onCopy={() => copyToClipboard(originAgentPhone, 'origin-agent-phone')}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery progress — vertical step timeline */}
            <div className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-sm">
              <div className="px-6 py-6 sm:px-8 sm:py-7">
                {/* Heading */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-[Sora] text-lg font-semibold text-gray-900">Delivery Progress</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Track your parcel&rsquo;s journey in real time.
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`block text-3xl font-extrabold tabular-nums tracking-tight leading-none ${
                        isCompleteJourney
                          ? 'text-green-600'
                          : stageIdx < 0
                          ? 'text-red-500'
                          : 'text-[#00473E]'
                      }`}
                    >
                      {stageIdx < 0 ? '—' : `${progressPercent}%`}
                    </span>
                    <span
                      className={`inline-flex items-center mt-2 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        isCompleteJourney
                          ? 'bg-green-600/10 text-green-700'
                          : stageIdx < 0
                          ? 'bg-red-50 text-red-600'
                          : 'bg-[#E9FF15] text-[#00473E]'
                      }`}
                    >
                      {isCompleteJourney
                        ? 'Completed'
                        : stageIdx < 0
                        ? 'Not Delivered'
                        : 'In Progress'}
                    </span>
                  </div>
                </div>

                {/* Vertical step timeline */}
                <ol className="mt-5">
                  {displayStages.map((step, i) => {
                    const isDone = i < stageIdx || (isCompleteJourney && i === stageIdx);
                    const isCurrent = i === stageIdx && !isCompleteJourney;
                    const isLast = i === displayStages.length - 1;

                    const badgeClass = isDone
                      ? 'border-green-600 bg-green-600 text-white'
                      : isCurrent
                      ? 'border-[#E9FF15] bg-[#E9FF15] text-[#00473E] ring-4 ring-[#E9FF15]/40'
                      : 'border-gray-200 bg-white text-gray-300';

                    const chipText = isDone ? 'Completed' : isCurrent ? 'Current Status' : 'Pending';
                    const chipClass = isDone
                      ? 'bg-green-600/10 text-green-700'
                      : isCurrent
                      ? 'bg-[#E9FF15] text-[#00473E]'
                      : 'bg-gray-100 text-gray-400';

                    return (
                      <li key={step.title} className="relative flex gap-4">
                        <div className="flex flex-col items-center">
                          <span
                            className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 text-sm font-bold transition-colors duration-300 ${badgeClass}`}
                          >
                            {i + 1}
                          </span>
                          {!isLast && (
                            <span
                              aria-hidden="true"
                              className={`my-1 w-0.5 flex-1 rounded-full ${
                                isDone ? 'bg-green-500' : 'bg-gray-100'
                              }`}
                            />
                          )}
                        </div>
                        <div className={`flex-1 ${isLast ? 'pb-1' : 'pb-6'}`}>
                          <div
                            className={`rounded-xl -ml-0.5 ${
                              isCurrent
                                ? 'bg-[#E9FF15]/20 ring-1 ring-[#E9FF15]/60 px-3 py-2.5'
                                : 'py-2'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <h4
                                className={`text-sm font-bold leading-snug ${
                                  isCurrent
                                    ? 'text-[#00473E]'
                                    : isDone
                                    ? 'text-gray-800'
                                    : 'text-gray-400'
                                }`}
                              >
                                {step.title}
                              </h4>
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${chipClass}`}
                              >
                                {chipText}
                              </span>
                            </div>
                            <p
                              className={`mt-1 text-xs leading-relaxed ${
                                isCurrent
                                  ? 'text-[#00473E]/80'
                                  : isDone
                                  ? 'text-gray-500'
                                  : 'text-gray-400'
                              }`}
                            >
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Status history details */}
                {result.events.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Status History</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.events.map((event, idx) => (
                        <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-gray-800">{event.status}</p>
                            {event.timestamp && (
                              <time
                                className="text-xs text-gray-400 tabular-nums whitespace-nowrap"
                                dateTime={event.date?.toISOString()}
                              >
                                {event.timestamp}
                              </time>
                            )}
                          </div>
                          {event.description && (
                            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{event.description}</p>
                          )}
                          {event.location && (
                            <p className="flex items-center gap-1 text-xs text-gray-400 mt-1.5">
                              <MapPin className="w-3 h-3" /> {event.location}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stageIdx < 0 && (
                  <div className="mt-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">
                      This parcel could not be delivered. Please contact ParcelGrid support for assistance.
                    </p>
                  </div>
                )}
              </div>
            </div>

            </div>

            <div className="lg:sticky lg:top-24">
              <TrackSoftSellRail />
            </div>
          </div>
        </section>
      )}

      {/* Loading state */}
      {hasSearched && loading && (
        <section className="bg-[#f7f8f6] py-10 sm:py-14">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            {/* Status message */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                <span className="absolute inset-0 rounded-full border-[3px] border-[#00473E]/15 border-t-[#00473E] animate-spin" />
                <Truck className="w-7 h-7 text-[#00473E]" />
              </div>
              <p className="text-base font-semibold text-[#00473E]">Fetching your parcel…</p>
              <p className="text-sm text-gray-500 mt-1">
                Looking up the latest status and journey updates.
              </p>
            </div>

            {/* Status card skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 sm:px-8 py-6 sm:py-7 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="h-3 w-28 bg-gray-200 rounded" />
                    <div className="h-6 w-44 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-3 sm:text-right">
                    <div className="h-3 w-24 bg-gray-200 rounded sm:ml-auto" />
                    <div className="h-9 w-44 bg-gray-300 rounded sm:ml-auto" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 border-t border-gray-100 pt-5">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 w-20 bg-gray-200 rounded" />
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress skeleton — vertical steps */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="px-6 sm:px-8 py-6 sm:py-7 animate-pulse">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-gray-200 rounded" />
                    <div className="h-3 w-56 bg-gray-200 rounded" />
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="h-7 w-14 bg-gray-200 rounded ml-auto" />
                    <div className="h-4 w-20 bg-gray-200 rounded-full ml-auto" />
                  </div>
                </div>
                <div className="mt-5 space-y-6">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="h-3.5 w-2/5 bg-gray-200 rounded" />
                          <div className="h-4 w-16 bg-gray-200 rounded-full" />
                        </div>
                        <div className="h-3 w-3/4 bg-gray-200 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status history skeleton */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-6">
              <div className="px-6 sm:px-8 py-6 sm:py-7 animate-pulse">
                <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded" />
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Empty state — marketing conversion */}
      {!hasSearched && <TrackEmptyMarketing />}

      <Footer />
    </div>
  );
};

export default TrackingPage;
