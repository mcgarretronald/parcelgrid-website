/**
 * Live delivery fee — same calculate-delivery-fee endpoint the vendor app uses.
 * Browser never fetches website-backend tokens; pricing goes through /api or CORS-safe website-backend.
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

const FEE_FN = '/api/calculate-fee';
const FEE_WEBSITE =
  'https://app.escrowcourier.com/website-backend-services/api/calculate-delivery-fee';

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
  signal?: AbortSignal,
): Promise<CalculateFeeResult | null> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
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
  try {
    const fromFn = await postFee(FEE_FN, payload, signal);
    if (fromFn && fromFn.totalFee != null) return fromFn;
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  // Website-backend proxy — CORS-friendly from escrowcourier.com (no browser token)
  try {
    const fromSite = await postFee(FEE_WEBSITE, payload, signal);
    if (fromSite && fromSite.totalFee != null) return fromSite;
    if (fromSite?.error) return fromSite;
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
  }

  return { totalFee: null, error: 'Unable to calculate delivery fee' };
}
