/**
 * Live delivery fee — same calculate-delivery-fee endpoint the vendor app uses.
 */

export type CalculateFeePayload = {
  weightRange?: string;
  distance?: number;
  originAgentId?: number | string;
  destinationAgentId?: number | string;
  originTown?: string;
  destinationTown?: string;
  subItemId?: number;
};

export type CalculateFeeResult = {
  totalFee: number | null;
  weightBandLabel?: string;
  isSpecial?: boolean;
  raw?: unknown;
  error?: string;
};

const AUTH_TOKEN_URL =
  'https://app.escrowcourier.com/website-backend-services/api/auth/token';
const FEE_DIRECT =
  'https://app.escrowcourier.com/pricing-services/api/pricing/calculate-delivery-fee';
const FEE_PROXY = '/calculate-fee-api';
const FEE_FN = '/api/calculate-fee';
const FEE_WEBSITE =
  'https://app.escrowcourier.com/website-backend-services/api/calculate-delivery-fee';

async function fetchWebsiteToken(): Promise<string | null> {
  try {
    const res = await fetch(AUTH_TOKEN_URL, { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.token || data.access_token || data.bearer_token || data.data?.token || null;
  } catch {
    return null;
  }
}

function extractFee(data: any): CalculateFeeResult {
  const nested = data?.data ?? data?.result ?? data;
  const fee =
    nested?.totalFee ??
    nested?.fee ??
    nested?.deliveryFee ??
    nested?.price ??
    nested?.amount ??
    data?.totalFee ??
    null;
  const n = typeof fee === 'string' ? Number(fee) : fee;
  return {
    totalFee: typeof n === 'number' && Number.isFinite(n) ? n : null,
    weightBandLabel: nested?.weightBand?.weightRange || nested?.weightBand?.name,
    isSpecial: Boolean(nested?.isSpecialCategory || nested?.specialCategory || data?.subItemId),
    raw: data,
  };
}

async function postFee(
  url: string,
  payload: CalculateFeePayload,
  headers: Record<string, string>,
  signal?: AbortSignal,
): Promise<CalculateFeeResult | null> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(payload),
    signal,
  });
  if (!res.ok) {
    const text = await res.text();
    let message = text || `Status ${res.status}`;
    try {
      const err = JSON.parse(text);
      message = err?.error?.message || err?.message || message;
    } catch {
      /* keep text */
    }
    return { totalFee: null, error: message };
  }
  return extractFee(await res.json());
}

/** Calculate live courier fee (weight band or special sub-item). */
export async function calculateDeliveryFee(
  payload: CalculateFeePayload,
  signal?: AbortSignal,
): Promise<CalculateFeeResult> {
  // Dev Vite middleware / Netlify function — token kept server-side
  try {
    const fromFn = await postFee(FEE_FN, payload, {}, signal);
    if (fromFn && fromFn.totalFee != null) return fromFn;
    // Keep hard errors (bad route) but continue if the path 404'd as SPA HTML
    if (fromFn?.error && !/status 404|doctype|<!doctype/i.test(fromFn.error)) {
      // Prefer continuing to CORS-friendly website-backend before surfacing
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  // Website-backend proxy — CORS-friendly from escrowcourier.com (no browser token needed)
  try {
    const fromSite = await postFee(FEE_WEBSITE, payload, {}, signal);
    if (fromSite && fromSite.totalFee != null) return fromSite;
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  const token = await fetchWebsiteToken();
  const auth = token ? { Authorization: `Bearer ${token}` } : {};

  if (import.meta.env.DEV && token) {
    try {
      const fromProxy = await postFee(FEE_PROXY, payload, auth, signal);
      if (fromProxy && fromProxy.totalFee != null) return fromProxy;
    } catch (err: any) {
      if (err?.name === 'AbortError') throw err;
    }
  }

  if (token) {
    try {
      const fromDirect = await postFee(FEE_DIRECT, payload, auth, signal);
      if (fromDirect && fromDirect.totalFee != null) return fromDirect;
      if (fromDirect?.error) return fromDirect;
    } catch (err: any) {
      if (err?.name === 'AbortError') throw err;
    }
  }

  return { totalFee: null, error: 'Unable to calculate delivery fee' };
}
